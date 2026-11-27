import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Catalogo from "../pages/Catalogo";
import Ofertas from "../pages/Ofertas";
import ProductoDetalle from "../pages/ProductoDetalle";
import AdminCategoriaForm from "../pages/admin/AdminCategoriaForm";
import AdminUsuarioForm from "../pages/admin/AdminUsuarioForm";
import AdminProductos from "../pages/admin/AdminProductos";
import useProducts from "../hooks/useProducts";
import useAuth from "../hooks/useAuth";
vi.mock("../hooks/useProducts", () => ({ default: vi.fn() }));
vi.mock("../hooks/useAuth", () => ({ default: vi.fn() }));
vi.mock("../hooks/useCart", () => ({ default: () => ({ agregarProducto: vi.fn() }) }));

describe("carga, errores y categorías reales", () => {
    let nodo, raiz, catalogo;
    beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; });
    afterAll(() => { delete globalThis.IS_REACT_ACT_ENVIRONMENT; });
    beforeEach(() => {
        catalogo = { productos: [], categorias: [], cargando: false, cargandoCategorias: false,
            errorCarga: null, errorCategorias: null, obtenerProducto: () => null,
            cargarProductos: vi.fn().mockResolvedValue(), cargarCategorias: vi.fn().mockResolvedValue() };
        useProducts.mockImplementation(() => catalogo);
        useAuth.mockReturnValue({ usuarios: [], esAdmin: true, cargandoUsuarios: false });
        nodo = document.createElement("div"); document.body.appendChild(nodo); raiz = createRoot(nodo);
    });
    afterEach(async () => { await act(async () => raiz.unmount()); nodo.remove(); });
    async function mostrar(Componente, ruta = "/", path = "*") {
        await act(async () => raiz.render(React.createElement(MemoryRouter, { initialEntries: [ruta] },
            React.createElement(Routes, null, React.createElement(Route, { path, element: React.createElement(Componente) })))));
    }
    it("detalle espera la consulta antes de declarar un producto inexistente", async () => {
        catalogo.cargando = true;
        await mostrar(ProductoDetalle, "/producto/9", "/producto/:id");
        expect(nodo.querySelector('[role="status"]')).not.toBeNull();
        expect(nodo.textContent).not.toContain("Producto no encontrado");
        catalogo.cargando = false;
        await mostrar(ProductoDetalle);
        expect(nodo.textContent).toContain("Producto no encontrado");
    });
    it.each([Catalogo, Ofertas, AdminProductos])("una consulta fallida no aparece como un catálogo vacío", async Componente => {
        catalogo.errorCarga = "Servidor no disponible.";
        await mostrar(Componente);
        expect(nodo.querySelector('[role="alert"]').textContent).toContain("Servidor no disponible.");
        expect(nodo.textContent).not.toContain("No se encontraron productos");
        await act(async () => nodo.querySelector("button").click());
        expect(catalogo.cargarProductos).toHaveBeenCalledTimes(1);
    });
    it("una categoría inexistente termina de cargar aun cuando no hay categorías", async () => {
        await mostrar(AdminCategoriaForm, "/admin/categorias/9/editar", "/admin/categorias/:id/editar");
        expect(nodo.textContent).toContain("Categoría no encontrada");
        expect(nodo.querySelector('[role="status"]')).toBeNull();
    });
    it("el error de categorías permite reintentar sin declarar que no existen", async () => {
        catalogo.errorCategorias = "Error de categorías.";
        await mostrar(AdminCategoriaForm);
        expect(nodo.querySelector('[role="alert"]').textContent).toContain("Error de categorías.");
        await act(async () => nodo.querySelector("button").click());
        expect(catalogo.cargarCategorias).toHaveBeenCalledTimes(1);
    });
    it("el error de usuarios no se confunde con un usuario inexistente", async () => {
        const cargarUsuarios = vi.fn().mockResolvedValue();
        useAuth.mockReturnValue({ usuarios: [], errorUsuarios: "Error de usuarios.", cargarUsuarios });
        await mostrar(AdminUsuarioForm, "/admin/usuarios/9/editar", "/admin/usuarios/:id/editar");
        expect(nodo.textContent).not.toContain("Usuario no encontrado");
        await act(async () => nodo.querySelector("button").click());
        expect(cargarUsuarios).toHaveBeenCalledTimes(1);
    });
    it("filtra por identificador de categorías nuevas y renombradas", async () => {
        catalogo.categorias = [{ idCategoria: 88, nombre: "Accesorios nuevos" }, { idCategoria: 2, nombre: "Otra" }];
        catalogo.productos = [{ id: 1, idCategoria: 88, nombre: "Bolso nuevo", precio: 1000 },
            { id: 2, idCategoria: 2, nombre: "Producto distinto", precio: 2000 }];
        await mostrar(Catalogo);
        await act(async () => Array.from(nodo.querySelectorAll("button")).find(b => b.textContent === "Accesorios nuevos").click());
        expect(nodo.textContent).toContain("Bolso nuevo");
        expect(nodo.textContent).not.toContain("Producto distinto");
        catalogo.categorias = [{ idCategoria: 88, nombre: "Accesorios renombrados" }];
        await mostrar(Catalogo);
        expect(nodo.textContent).toContain("Accesorios renombrados");
        expect(nodo.textContent).not.toContain("Producto distinto");
    });
});
