import React, { act } from "react";

import { createRoot } from "react-dom/client";

import ConfirmarCompraModal
    from "../components/ConfirmarCompraModal";


/*
 Pruebas del componente ConfirmarCompraModal.
 
 * Cubren las cuatro categorías pedidas:
 - renderizado correcto (la lista muestra todos los productos),
 - renderizado condicional (el método de pago solo si existe),
 - propiedades recibidas (incluida una función: formatearPrecio),
 - eventos (los clics ejecutan onConfirmar y onCancelar).
 */

describe("ConfirmarCompraModal", () => {

    let contenedor;
    let raiz;
    let props;


    const productosPrueba = [
        { id: 1, nombre: "RC-30", precio: 45000, cantidad: 2 },
        { id: 2, nombre: "Musette MU-05", precio: 14990, cantidad: 1 }
    ];


    // Formateador simple y predecible, para poder afirmar sobre el texto.
    function formatoPrueba(valor) {
        return `$${valor}`;
    }


    function renderizar(cambios) {

        props = {
            productos: productosPrueba,
            cantidadProductos: 3,
            subtotal: 104990,
            direccion: "del zarco 84",
            comuna: "Santiago",
            region: "Región Metropolitana",
            metodoPago: "Transferencia bancaria",
            formatearPrecio: jasmine.createSpy("formatearPrecio")
                .and.callFake(formatoPrueba),
            onConfirmar: jasmine.createSpy("onConfirmar"),
            onCancelar: jasmine.createSpy("onCancelar"),
            ...cambios
        };

        act(() => {
            raiz.render(
                React.createElement(ConfirmarCompraModal, props)
            );
        });

    }


    // Busca un botón por el texto que muestra.
    function boton(texto) {

        return Array.from(
            contenedor.querySelectorAll("button")
        ).find(
            (b) => b.textContent.trim() === texto
        );

    }


    function clic(elemento) {

        act(() => {
            elemento.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
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


    describe("renderizado", () => {

        it("debe mostrar todos los productos recibidos", () => {

            renderizar();

            expect(contenedor.textContent).toContain("RC-30");
            expect(contenedor.textContent).toContain("Musette MU-05");

        });

        it("debe mostrar la cantidad de cada producto", () => {

            renderizar();

            expect(contenedor.textContent).toContain("Cantidad: 2");
            expect(contenedor.textContent).toContain("Cantidad: 1");

        });

        it("debe mostrar la dirección de despacho", () => {

            renderizar();

            expect(contenedor.textContent).toContain("del zarco 84");
            expect(contenedor.textContent).toContain("Santiago");
            expect(contenedor.textContent).toContain("Región Metropolitana");

        });

        it("debe mostrar la pregunta de confirmación", () => {

            renderizar();

            expect(contenedor.textContent)
                .toContain("¿Deseas confirmar la compra?");

        });

        it("debe dibujar el fondo oscuro del modal", () => {

            renderizar();

            expect(
                contenedor.querySelector(".modal-backdrop")
            ).not.toBeNull();

        });

    });


    describe("renderizado condicional", () => {

        it("debe mostrar el método de pago cuando viene informado", () => {

            renderizar();

            expect(contenedor.textContent)
                .toContain("Método de pago: Transferencia bancaria");

        });

        it("no debe mostrar el método de pago cuando viene vacío", () => {

            renderizar({ metodoPago: "" });

            expect(contenedor.textContent).not.toContain("Método de pago");

        });

        it("no debe fallar cuando la lista de productos no es un arreglo", () => {

            renderizar({ productos: undefined });

            expect(contenedor.textContent)
                .toContain("¿Deseas confirmar la compra?");

        });

    });


    describe("propiedades recibidas", () => {

        it("debe usar la función formatearPrecio que recibe por propiedades", () => {

            renderizar();

            expect(props.formatearPrecio).toHaveBeenCalled();

        });

        it("debe calcular el total de cada línea con precio por cantidad", () => {

            renderizar();

            // RC-30: 45000 x 2
            expect(props.formatearPrecio).toHaveBeenCalledWith(90000);

        });

        it("debe mostrar el subtotal que recibe", () => {

            renderizar();

            expect(props.formatearPrecio).toHaveBeenCalledWith(104990);
            expect(contenedor.textContent).toContain("$104990");

        });

    });


    describe("eventos", () => {

        it("debe ejecutar onConfirmar al pulsar Sí, confirmar", () => {

            renderizar();

            clic(boton("Sí, confirmar"));

            expect(props.onConfirmar).toHaveBeenCalledTimes(1);
            expect(props.onCancelar).not.toHaveBeenCalled();

        });

        it("debe ejecutar onCancelar al pulsar No", () => {

            renderizar();

            clic(boton("No"));

            expect(props.onCancelar).toHaveBeenCalledTimes(1);
            expect(props.onConfirmar).not.toHaveBeenCalled();

        });

        it("debe ejecutar onCancelar al pulsar la equis de cerrar", () => {

            renderizar();

            clic(contenedor.querySelector(".btn-close"));

            expect(props.onCancelar).toHaveBeenCalledTimes(1);

        });

        it("no debe ejecutar nada mientras no se pulse ningún botón", () => {

            renderizar();

            expect(props.onConfirmar).not.toHaveBeenCalled();
            expect(props.onCancelar).not.toHaveBeenCalled();

        });

    });

});