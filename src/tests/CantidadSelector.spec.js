import React, { act } from "react";

import { createRoot } from "react-dom/client";

import CantidadSelector
    from "../components/products/CantidadSelector";


/*
 * Pruebas del selector de cantidad.
 *
 * Cubre las tres formas en que el cliente puede cambiar la cantidad:
 * los botones, sus topes y la escritura a mano en el campo.
 */

describe("CantidadSelector", () => {

    let contenedor;
    let raiz;


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


    // Monta el selector con las propiedades indicadas.
    function renderizar({
        cantidad = 1,
        maximo = 10,
        onCambiar = () => {}
    } = {}) {

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


    function campo() {

        return contenedor.querySelector('input[type="number"]');

    }


    function botones() {

        return contenedor.querySelectorAll("button");

    }


    // Simula que el cliente escribe un valor en el campo.
    function escribir(valor) {

        act(() => {

            const setter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
            ).set;

            setter.call(campo(), valor);

            campo().dispatchEvent(
                new Event("change", { bubbles: true })
            );

        });

    }


    describe("lo que muestra", () => {

        it("debe mostrar la cantidad recibida mediante props", () => {

            renderizar({ cantidad: 4, maximo: 10 });

            expect(campo().value).toBe("4");

            expect(campo().max).toBe("10");

        });

    });


    describe("botones", () => {

        it("debe aumentar la cantidad al presionar el botón más", () => {

            const onCambiar = vi.fn();

            renderizar({ cantidad: 2, maximo: 10, onCambiar });

            act(() => {
                botones()[1].click();
            });

            expect(onCambiar).toHaveBeenCalledWith(3);

            expect(onCambiar).toHaveBeenCalledTimes(1);

        });


        it("debe disminuir la cantidad al presionar el botón menos", () => {

            const onCambiar = vi.fn();

            renderizar({ cantidad: 3, maximo: 10, onCambiar });

            act(() => {
                botones()[0].click();
            });

            expect(onCambiar).toHaveBeenCalledWith(2);

            expect(onCambiar).toHaveBeenCalledTimes(1);

        });


        it("no debe aumentar la cantidad cuando ya alcanzó el máximo", () => {

            const onCambiar = vi.fn();

            renderizar({ cantidad: 5, maximo: 5, onCambiar });

            act(() => {
                botones()[1].click();
            });

            expect(onCambiar).not.toHaveBeenCalled();

        });

    });


    describe("topes de los botones", () => {

        it("debe deshabilitar el botón menos cuando la cantidad es uno", () => {

            renderizar({ cantidad: 1, maximo: 10 });

            expect(botones()[0].disabled).toBe(true);

            expect(botones()[1].disabled).toBe(false);

        });


        it("debe deshabilitar el botón más cuando alcanza el stock máximo", () => {

            renderizar({ cantidad: 5, maximo: 5 });

            expect(botones()[0].disabled).toBe(false);

            expect(botones()[1].disabled).toBe(true);

        });

    });


    describe("entrada por teclado", () => {

        it("debe informar la cantidad escrita", () => {

            const onCambiar = vi.fn();

            renderizar({ cantidad: 1, maximo: 10, onCambiar });

            escribir("5");

            expect(onCambiar).toHaveBeenCalledWith(5);

        });


        it("debe aceptar escribir exactamente el máximo", () => {

            const onCambiar = vi.fn();

            renderizar({ cantidad: 1, maximo: 10, onCambiar });

            escribir("10");

            expect(onCambiar).toHaveBeenCalledWith(10);

        });


        it("debe recortar al máximo cuando se escribe de más", () => {

            const onCambiar = vi.fn();

            renderizar({ cantidad: 1, maximo: 10, onCambiar });

            escribir("99");

            expect(onCambiar).toHaveBeenCalledWith(10);

        });


        it("debe subir a uno cuando se escribe cero", () => {

            const onCambiar = vi.fn();

            renderizar({ cantidad: 5, maximo: 10, onCambiar });

            escribir("0");

            expect(onCambiar).toHaveBeenCalledWith(1);

        });


        it("debe subir a uno cuando se escribe un negativo", () => {

            const onCambiar = vi.fn();

            renderizar({ cantidad: 5, maximo: 10, onCambiar });

            escribir("-3");

            expect(onCambiar).toHaveBeenCalledWith(1);

        });


        it("debe subir a uno cuando se borra el campo", () => {

            const onCambiar = vi.fn();

            renderizar({ cantidad: 5, maximo: 10, onCambiar });

            escribir("");

            expect(onCambiar).toHaveBeenCalledWith(1);

        });


        it("no debe permitir comprar fracciones de producto", () => {

            const onCambiar = vi.fn();

            renderizar({ cantidad: 1, maximo: 10, onCambiar });

            escribir("2.7");

            expect(onCambiar).toHaveBeenCalledWith(2);

        });

    });

});