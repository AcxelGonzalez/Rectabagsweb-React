import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminOrdenes from "../pages/admin/AdminOrdenes";
import AdminBoleta from "../pages/admin/AdminBoleta";
import AdminPanel from "../pages/admin/AdminPanel";
import AdminProductos from "../pages/admin/AdminProductos";
import AdminUsuarioForm from "../pages/admin/AdminUsuarioForm";
import Carrito from "../pages/Carrito";
import useAuth from "../hooks/useAuth";
import useProducts from "../hooks/useProducts";
import useCart from "../hooks/useCart";
import { listarOrdenes, obtenerBoleta } from "../services/compraService";

vi.mock("../hooks/useAuth", () => ({ default: vi.fn() }));
vi.mock("../hooks/useProducts", () => ({ default: vi.fn() }));
vi.mock("../hooks/useCart", () => ({ default: vi.fn() }));
vi.mock("../services/compraService", () => ({ listarOrdenes: vi.fn(), obtenerBoleta: vi.fn(), colorEstado: () => "bg-secondary" }));

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
        await renderizar(AdminBoleta, "/admin/ordenes/5", "/admin/ordenes/:id");
        expect(obtenerBoleta).toHaveBeenCalledWith("5");
        expect(contenedor.textContent).toContain("Boleta RB-2026-5");
        expect(contenedor.querySelector("select")).toBeNull();
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
