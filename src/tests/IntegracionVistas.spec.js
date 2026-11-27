import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminOrdenes from "../pages/admin/AdminOrdenes";
import AdminBoleta from "../pages/admin/AdminBoleta";
import AdminPanel from "../pages/admin/AdminPanel";
import AdminProductos from "../pages/admin/AdminProductos";
import AdminUsuarioForm from "../pages/admin/AdminUsuarioForm";
import Carrito from "../pages/Carrito";
import AdminReportes from "../pages/admin/AdminReportes";
import useAuth from "../hooks/useAuth";
import useProducts from "../hooks/useProducts";
import useCart from "../hooks/useCart";
import { listarOrdenes, obtenerBoleta, cambiarEstadoBoleta, obtenerResumen, cerrarPeriodo } from "../services/compraService";

vi.mock("../hooks/useAuth", () => ({ default: vi.fn() }));
vi.mock("../hooks/useProducts", () => ({ default: vi.fn() }));
vi.mock("../hooks/useCart", () => ({ default: vi.fn() }));
vi.mock("../services/compraService", () => ({ listarOrdenes: vi.fn(), obtenerBoleta: vi.fn(), cambiarEstadoBoleta: vi.fn(), obtenerResumen: vi.fn(), cerrarPeriodo: vi.fn(), colorEstado: () => "bg-secondary" }));

describe("vistas integradas con usuarios, catalogo y boletas", () => {
    let contenedor, raiz;
    const compra = { id: 5, folio: "RB-2026-5", fecha: "2026-11-26T12:00:00", estado: "PENDIENTE", subtotal: 2000,
        cliente: { nombre: "Cliente", apellido: "Prueba", correo: "cliente@gmail.com" },
        productos: [{ id: 1, nombre: "Producto", precio: 1000, cantidad: 2, subTotal: 2000 }] };
    const usuario = { id: 3, nombre: "Cliente", apellido: "Prueba", run: "123456785", correo: "cliente@gmail.com", rol: "CLIENTE" };
    beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; });
    afterAll(() => { delete globalThis.IS_REACT_ACT_ENVIRONMENT; });
    beforeEach(() => {
        listarOrdenes.mockReset(); obtenerBoleta.mockReset();
        cambiarEstadoBoleta.mockReset(); obtenerResumen.mockReset(); cerrarPeriodo.mockReset();
        listarOrdenes.mockResolvedValue([compra]); obtenerBoleta.mockResolvedValue(compra);
        useAuth.mockReturnValue({ esAdmin: true, usuarios: [usuario], usuarioActual: { id: 1, rol: "ADMIN" }, actualizarUsuario: vi.fn().mockResolvedValue({ ok: true }) });
        useProducts.mockReturnValue({ productos: [{ id: 1, nombre: "Producto", stock: 5, precio: 1000 }], cargando: false, errorCarga: null });
        useCart.mockReturnValue({ carrito: [], cantidadProductos: 0, subtotal: 0, avisosCarrito: [], sincronizarConCatalogo: vi.fn() });
        contenedor = document.createElement("div"); document.body.appendChild(contenedor); raiz = createRoot(contenedor);
    });
    afterEach(async () => { await act(async () => raiz.unmount()); contenedor.remove(); });
    async function renderizar(Componente, ruta = "/admin/ordenes/5", path = "*") {
        await act(async () => raiz.render(React.createElement(MemoryRouter, { initialEntries: [ruta] },
            React.createElement(Routes, null, React.createElement(Route, { path, element: React.createElement(Componente) })))));
    }
    it("ordenes muestra el folio de PostgreSQL y enlaza por id numerico", async () => {
        await renderizar(AdminOrdenes);
        expect(contenedor.textContent).toContain(compra.folio);
        expect(contenedor.querySelector('a[href="/admin/ordenes/5"]')).not.toBeNull();
    });
    it("ordenes muestra errores de la API sin confundirlos con lista vacia", async () => {
        listarOrdenes.mockRejectedValue({ response: { data: { mensaje: "Sin permiso." } } });
        await renderizar(AdminOrdenes);
        expect(contenedor.querySelector('[role="alert"]').textContent).toBe("Sin permiso.");
    });
    it("detalle remoto muestra folio y precio historico en modo consulta", async () => {
        useAuth.mockReturnValue({ esAdmin: false, esVendedor: true });
        await renderizar(AdminBoleta, "/admin/ordenes/5", "/admin/ordenes/:id");
        expect(obtenerBoleta).toHaveBeenCalledWith("5");
        expect(contenedor.textContent).toContain("Boleta RB-2026-5");
        expect(contenedor.querySelector("select")).toBeNull();
    });
    it("admin cambia estado por API y recibe la boleta actualizada", async () => {
        cambiarEstadoBoleta.mockResolvedValue({ ...compra, estado: "CANCELADA" });
        await renderizar(AdminBoleta, "/admin/ordenes/5", "/admin/ordenes/:id");
        const select = contenedor.querySelector("select");
        expect(Array.from(select.options).map(option => option.value)).toEqual(["PAGADA", "CANCELADA"]);
        select.value = "CANCELADA";
        await act(async () => contenedor.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
        expect(cambiarEstadoBoleta).toHaveBeenCalledWith("5", "CANCELADA");
        expect(contenedor.textContent).toContain("CANCELADA");
        expect(contenedor.querySelector("select")).toBeNull();
    });
    it("cambio rechazado conserva la boleta y muestra el error del servidor", async () => {
        cambiarEstadoBoleta.mockRejectedValue({ response: { data: { mensaje: "Periodo cerrado." } } });
        await renderizar(AdminBoleta, "/admin/ordenes/5", "/admin/ordenes/:id");
        await act(async () => contenedor.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
        expect(contenedor.querySelector('[role="alert"]').textContent).toBe("Periodo cerrado.");
        expect(contenedor.textContent).toContain("PENDIENTE");
        expect(contenedor.querySelector("button").disabled).toBe(false);
    });
    it("boleta cerrada no muestra selector aunque sea admin", async () => {
        obtenerBoleta.mockResolvedValue({ ...compra, archivada: true });
        await renderizar(AdminBoleta, "/admin/ordenes/5", "/admin/ordenes/:id");
        expect(contenedor.querySelector("select")).toBeNull();
        expect(contenedor.textContent).toContain("periodo cerrado");
    });
    const resumen = { cantidadOrdenes: 1, totalVentas: 2000, ticketPromedio: 2000, unidadesVendidas: 2,
        productoMasVendido: { idProducto: 1, nombre: "Producto del servidor", unidades: 2 },
        rankingProductos: [{ idProducto: 1, nombre: "Producto del servidor", unidades: 2, total: 2000 }],
        comprasPorEstado: { PENDIENTE: 1 } };
    it("reportes usa el resumen remoto y confirma el cierre de todas las boletas", async () => {
        obtenerResumen.mockResolvedValueOnce(resumen).mockResolvedValueOnce({ ...resumen, comprasPorEstado: {}, rankingProductos: [], productoMasVendido: null, cantidadOrdenes: 0, totalVentas: 0 });
        cerrarPeriodo.mockResolvedValue(1);
        await renderizar(AdminReportes);
        expect(contenedor.textContent).toContain("Producto del servidor");
        await act(async () => Array.from(contenedor.querySelectorAll("button")).find(button => button.textContent.includes("Cerrar periodo")).click());
        expect(contenedor.querySelector('[role="dialog"]').textContent).toContain("incluidas las que están en proceso");
        await act(async () => Array.from(contenedor.querySelectorAll('[role="dialog"] button')).find(button => button.textContent.includes("Cerrar periodo")).click());
        expect(cerrarPeriodo).toHaveBeenCalledTimes(1);
        expect(obtenerResumen).toHaveBeenCalledTimes(2);
        expect(contenedor.textContent).toContain("1 boletas cerradas");
        expect(contenedor.querySelector('[role="dialog"]')).toBeNull();
    });
    it("reportes no presenta un error como ventas cero", async () => {
        obtenerResumen.mockRejectedValue({ response: { data: { mensaje: "No disponible." } } });
        await renderizar(AdminReportes);
        expect(contenedor.querySelector('[role="alert"]').textContent).toBe("No disponible.");
        expect(contenedor.textContent).not.toContain("Ventas totales");
    });
    it("cierre rechazado conserva el reporte y permite reintentar", async () => {
        obtenerResumen.mockResolvedValue(resumen);
        cerrarPeriodo.mockRejectedValue({ response: { data: { mensaje: "Cierre rechazado." } } });
        await renderizar(AdminReportes);
        await act(async () => Array.from(contenedor.querySelectorAll("button")).find(button => button.textContent.includes("Cerrar periodo")).click());
        await act(async () => Array.from(contenedor.querySelectorAll('[role="dialog"] button')).find(button => button.textContent.includes("Cerrar periodo")).click());
        expect(contenedor.querySelector('[role="alert"]').textContent).toBe("Cierre rechazado.");
        expect(contenedor.textContent).toContain("Producto del servidor");
        expect(obtenerResumen).toHaveBeenCalledTimes(1);
    });
    it("panel vendedor muestra solo productos y ordenes", async () => {
        useAuth.mockReturnValue({ esAdmin: false, usuarios: [], usuarioActual: { nombre: "Vendedor", rol: "VENDEDOR" } });
        await renderizar(AdminPanel);
        expect(contenedor.querySelector('a[href="/admin/productos"]')).not.toBeNull();
        expect(contenedor.querySelector('a[href="/admin/ordenes"]')).not.toBeNull();
        expect(contenedor.querySelector('a[href="/admin/usuarios"]')).toBeNull();
        expect(contenedor.querySelector('a[href="/admin/reportes"]')).toBeNull();
        expect(contenedor.querySelector('a[href="/admin/categorias"]')).toBeNull();
    });
    it("vendedor ve productos sin crear, editar ni eliminar", async () => {
        useAuth.mockReturnValue({ esAdmin: false });
        await renderizar(AdminProductos);
        expect(contenedor.querySelector('a[href="/producto/1"]')).not.toBeNull();
        expect(contenedor.textContent).not.toContain("Editar");
        expect(contenedor.textContent).not.toContain("Eliminar");
        expect(contenedor.querySelector('a[href="/admin/productos/nuevo"]')).toBeNull();
    });
    it("carrito espera la carga del catalogo antes de sincronizar", async () => {
        const sincronizar = vi.fn();
        useCart.mockReturnValue({ carrito: [], cantidadProductos: 0, subtotal: 0, avisosCarrito: [], sincronizarConCatalogo: sincronizar });
        useProducts.mockReturnValue({ productos: [], cargando: true });
        await renderizar(Carrito);
        expect(sincronizar).not.toHaveBeenCalled();
        useProducts.mockReturnValue({ productos: [{ id: 1 }], cargando: false });
        await renderizar(Carrito);
        expect(sincronizar).toHaveBeenCalledWith([{ id: 1 }]);
    });
    it("edicion de usuario reconoce id numerico y conserva RUN, correo y contacto", async () => {
        const actualizar = vi.fn().mockResolvedValue({ ok: false, mensaje: "Error de prueba." });
        useAuth.mockReturnValue({ usuarios: [usuario], usuarioActual: { id: 1 }, actualizarUsuario: actualizar, cargandoUsuarios: false });
        await renderizar(AdminUsuarioForm, "/admin/usuarios/3/editar", "/admin/usuarios/:id/editar");
        expect(contenedor.textContent).toContain(usuario.run);
        await act(async () => contenedor.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
        expect(actualizar).toHaveBeenCalledWith(3, expect.objectContaining({ run: usuario.run, correo: usuario.correo, rol: "CLIENTE" }));
        expect(contenedor.querySelector('[role="alert"]').textContent).toBe("Error de prueba.");
    });
});
