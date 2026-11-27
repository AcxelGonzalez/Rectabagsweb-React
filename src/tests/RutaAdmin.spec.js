import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import RutaAdmin from "../components/RutaAdmin";
import useAuth from "../hooks/useAuth";

vi.mock("../hooks/useAuth", () => ({ default: vi.fn() }));

describe("acceso al panel por rol", () => {
    let contenedor, raiz;
    function Login() { return React.createElement("p", null, "LOGIN " + useLocation().state?.from?.pathname); }
    async function renderizar(rol, ruta = "/admin/productos", cargando = false) {
        useAuth.mockReturnValue({ estaAutenticado: Boolean(rol), puedeEntrarAlPanel: ["ADMIN", "VENDEDOR"].includes(rol), esVendedor: rol === "VENDEDOR", cargandoSesion: cargando });
        await act(async () => raiz.render(React.createElement(MemoryRouter, { initialEntries: [ruta] },
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/", element: React.createElement("p", null, "INICIO") }),
                React.createElement(Route, { path: "/login", element: React.createElement(Login) }),
                React.createElement(Route, { element: React.createElement(RutaAdmin) },
                    React.createElement(Route, { path: "/admin", element: React.createElement("p", null, "PANEL") }),
                    React.createElement(Route, { path: "/admin/*", element: React.createElement("p", null, "VISTA ADMINISTRATIVA") }))
            ))));
    }
    beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; });
    afterAll(() => { delete globalThis.IS_REACT_ACT_ENVIRONMENT; });
    beforeEach(() => { contenedor = document.createElement("div"); document.body.appendChild(contenedor); raiz = createRoot(contenedor); });
    afterEach(async () => { await act(async () => raiz.unmount()); contenedor.remove(); });
    it("visitante va al login conservando la ruta solicitada", async () => { await renderizar(null); expect(contenedor.textContent).toContain("LOGIN /admin/productos"); });
    it("cliente vuelve al inicio", async () => { await renderizar("CLIENTE"); expect(contenedor.textContent).toBe("INICIO"); });
    it("espera la comprobacion del token", async () => { await renderizar(null, "/admin/productos", true); expect(contenedor.textContent).toContain("Comprobando tu sesión"); });
    it("admin entra a todas las secciones", async () => { await renderizar("ADMIN", "/admin/usuarios"); expect(contenedor.textContent).toBe("VISTA ADMINISTRATIVA"); });
    for (const ruta of ["/admin/productos", "/admin/ordenes", "/admin/ordenes/15"]) {
        it(`vendedor puede consultar ${ruta}`, async () => { await renderizar("VENDEDOR", ruta); expect(contenedor.textContent).toBe("VISTA ADMINISTRATIVA"); });
    }
    for (const ruta of ["/admin/usuarios", "/admin/usuarios/nuevo", "/admin/reportes", "/admin/categorias", "/admin/productos/nuevo", "/admin/productos/1/editar"]) {
        it(`vendedor no puede abrir ${ruta}`, async () => { await renderizar("VENDEDOR", ruta); expect(contenedor.textContent).toBe("PANEL"); });
    }
});
