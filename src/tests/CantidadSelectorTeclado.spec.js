import React, { act } from "react";

import { createRoot } from "react-dom/client";

import CantidadSelector
    from "../components/products/CantidadSelector";


/*
 * Pruebas de la entrada por teclado del selector de cantidad.

 * El otro archivo de pruebas cubre los botones + y −. Aquí se cubre el
 * camino que faltaba: cuando el cliente escribe la cantidad a mano en
 * el campo, que es por donde pueden entrar valores inesperados.
 */

describe("CantidadSelector · entrada por teclado", () => {

    let contenedor;
    let raiz;
    let onCambiar;


    function renderizar(cantidad = 1, maximo = 10) {

        onCambiar =
            vi.fn();

        act(() => {
            raiz.render(
                React.createElement(CantidadSelector, {
                    cantidad,
                    maximo,
                    onCambiar
                })
            );
        });

    }


    // Simula que el cliente escribe un valor en el campo.
    function escribir(valor) {

        const campo = contenedor.querySelector("input");

        act(() => {

            const setter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
            ).set;

            setter.call(campo, valor);

            campo.dispatchEvent(
                new Event("change", { bubbles: true })
            );

        });

    }


    beforeAll(() => {
        globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    });


    beforeEach(() => {
        contenedor = document.createElement("div");
        document.body.appendChild(contenedor);
        raiz = createRoot(contenedor);
    });


    afterEach(() => {
        act(() => {
            raiz.unmount();
        });
        contenedor.remove();
    });


    afterAll(() => {
        delete globalThis.IS_REACT_ACT_ENVIRONMENT;
    });


    describe("valores válidos", () => {

        it("debe informar la cantidad escrita", () => {

            renderizar(1, 10);

            escribir("5");

            expect(onCambiar).toHaveBeenCalledWith(5);

        });

        it("debe aceptar escribir exactamente el máximo", () => {

            renderizar(1, 10);

            escribir("10");

            expect(onCambiar).toHaveBeenCalledWith(10);

        });

    });


    describe("valores fuera de rango", () => {

        it("debe recortar al máximo cuando se escribe de más", () => {

            renderizar(1, 10);

            escribir("99");

            expect(onCambiar).toHaveBeenCalledWith(10);

        });

        it("debe subir a uno cuando se escribe cero", () => {

            renderizar(5, 10);

            escribir("0");

            expect(onCambiar).toHaveBeenCalledWith(1);

        });

        it("debe subir a uno cuando se escribe un negativo", () => {

            renderizar(5, 10);

            escribir("-3");

            expect(onCambiar).toHaveBeenCalledWith(1);

        });

        it("debe subir a uno cuando se borra el campo", () => {

            renderizar(5, 10);

            escribir("");

            expect(onCambiar).toHaveBeenCalledWith(1);

        });

    });


    describe("cantidades no enteras", () => {

        it("no debe permitir comprar fracciones de producto", () => {

            renderizar(1, 10);

            escribir("2.7");

            expect(onCambiar).toHaveBeenCalledWith(2);

        });

    });

});