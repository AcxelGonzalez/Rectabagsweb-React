import React, { act } from "react";

import { createRoot } from "react-dom/client";

import {
    MemoryRouter,
    Route,
    Routes,
    useLocation
} from "react-router-dom";

import AuthProvider
    from "../context/AuthProvider";

import RutaAdmin
    from "../components/RutaAdmin";


/*
 * Pruebas del guardia de las rutas del panel de administración.
 *
 * Se monta un enrutador de prueba con tres destinos posibles y se
 * cambia la sesión guardada en localStorage para representar a un
 * visitante, a un cliente y a un administrador.
 *
 * Cubre el requisito no funcional 3.3.2 del ERS, "Protección de Rutas".
 */

describe("RutaAdmin", () => {

    const CLAVE_SESION = "recta_usuario_actual";

    let contenedor;
    let raiz;


    // Pantalla de login de prueba: muestra de dónde viene el usuario.
    function LoginFalso() {

        const location = useLocation();

        return React.createElement(
            "div",
            null,
            `PANTALLA LOGIN origen:${location.state?.from?.pathname || "ninguno"}`
        );

    }


    function iniciarSesionComo(rol) {

        localStorage.setItem(
            CLAVE_SESION,
            JSON.stringify({
                id: `usuario-${rol}`,
                nombre: "Usuario",
                apellido: "Prueba",
                correo: "usuario@duoc.cl",
                rol
            })
        );

    }


    function renderizar(ruta = "/admin/productos") {

        act(() => {

            raiz.render(
                React.createElement(
                    AuthProvider,
                    null,
                    React.createElement(
                        MemoryRouter,
                        { initialEntries: [ruta] },
                        React.createElement(
                            Routes,
                            null,
                            React.createElement(Route, {
                                path: "/",
                                element: React.createElement(
                                    "div", null, "PANTALLA INICIO"
                                )
                            }),
                            React.createElement(Route, {
                                path: "/login",
                                element: React.createElement(LoginFalso)
                            }),
                            React.createElement(
                                Route,
                                { element: React.createElement(RutaAdmin) },
                                React.createElement(Route, {
                                    path: "/admin/productos",
                                    element: React.createElement(
                                        "div", null, "PANEL DE PRODUCTOS"
                                    )
                                })
                            )
                        )
                    )
                )
            );

        });

    }


    beforeAll(() => {
        globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    });


    beforeEach(() => {
        localStorage.clear();
        contenedor = document.createElement("div");
        document.body.appendChild(contenedor);
        raiz = createRoot(contenedor);
    });


    afterEach(() => {
        act(() => {
            raiz.unmount();
        });
        contenedor.remove();
        localStorage.clear();
    });


    afterAll(() => {
        delete globalThis.IS_REACT_ACT_ENVIRONMENT;
    });


    describe("visitante sin sesión", () => {

        it("no debe mostrar la página del panel", () => {

            renderizar();

            expect(contenedor.textContent).not.toContain("PANEL DE PRODUCTOS");

        });

        it("debe enviarlo al login", () => {

            renderizar();

            expect(contenedor.textContent).toContain("PANTALLA LOGIN");

        });

        it("debe recordar la página que intentaba abrir", () => {

            renderizar();

            expect(contenedor.textContent).toContain("origen:/admin/productos");

        });

    });


    describe("cliente autenticado", () => {

        beforeEach(() => {
            iniciarSesionComo("cliente");
        });

        it("no debe mostrar la página del panel", () => {

            renderizar();

            expect(contenedor.textContent).not.toContain("PANEL DE PRODUCTOS");

        });

        it("debe devolverlo al inicio y no al login", () => {

            renderizar();

            expect(contenedor.textContent).toContain("PANTALLA INICIO");
            expect(contenedor.textContent).not.toContain("PANTALLA LOGIN");

        });

    });


    describe("administrador", () => {

        beforeEach(() => {
            iniciarSesionComo("admin");
        });

        it("debe mostrar la página del panel", () => {

            renderizar();

            expect(contenedor.textContent).toContain("PANEL DE PRODUCTOS");

        });

        it("no debe redirigirlo a ninguna parte", () => {

            renderizar();

            expect(contenedor.textContent).not.toContain("PANTALLA LOGIN");
            expect(contenedor.textContent).not.toContain("PANTALLA INICIO");

        });

    });

});