import {
    ESTADOS_COMPRA,
    actualizarEstadoCompra,
    archivarCompras,
    colorEstado,
    guardarCompra,
    leerCompras
} from "../services/compraService";


/*
 * Pruebas del ciclo de estados de las órdenes.
 *
 * El otro archivo cubre el registro y la lectura de compras. Aquí se
 * cubren las funciones que agregó el panel de administración: cambiar
 * el estado de una orden, su color y el cierre de periodo.
 */

describe("compraService · estados de las órdenes", () => {

    const CLAVE_COMPRAS = "recta_compras";


    // Registra una compra de prueba y devuelve su id.
    function crearCompra(cambios = {}) {

        const compra = guardarCompra({
            usuarioId: "cli-1",
            cliente: { nombre: "Acxel" },
            productos: [{ id: 1, nombre: "RC-30", precio: 45000, cantidad: 1 }],
            cantidadProductos: 1,
            subtotal: 45000,
            estado: "confirmada",
            ...cambios
        });

        return compra.id;

    }


    function leerCompra(id) {

        return leerCompras().find((c) => c.id === id);

    }


    beforeEach(() => {
        localStorage.clear();
    });


    afterEach(() => {
        localStorage.clear();
    });


    describe("ESTADOS_COMPRA", () => {

        it("debe incluir los cinco estados del ciclo", () => {

            expect(ESTADOS_COMPRA).toEqual([
                "confirmada",
                "en preparación",
                "enviada",
                "entregada",
                "cancelada"
            ]);

        });

    });


    describe("colorEstado", () => {

        it("debe dar un color distinto a cada estado del ciclo", () => {

            const colores = ESTADOS_COMPRA.map(colorEstado);

            expect(new Set(colores).size).toBe(ESTADOS_COMPRA.length);

        });

        it("debe marcar en rojo las órdenes canceladas", () => {

            expect(colorEstado("cancelada")).toContain("danger");

        });

        it("debe entregar un color neutro ante un estado desconocido", () => {

            expect(colorEstado("inventado")).toBe("bg-secondary");

        });

    });


    describe("actualizarEstadoCompra", () => {

        it("debe cambiar el estado de la orden indicada", () => {

            const id = crearCompra();
            const resultado = actualizarEstadoCompra(id, "enviada");

            expect(resultado.estado).toBe("enviada");

        });

        it("debe guardar el cambio, no solo devolverlo", () => {

            const id = crearCompra();

            actualizarEstadoCompra(id, "entregada");

            expect(leerCompra(id).estado).toBe("entregada");

        });

        it("debe permitir cancelar una orden", () => {

            const id = crearCompra();

            actualizarEstadoCompra(id, "cancelada");

            expect(leerCompra(id).estado).toBe("cancelada");

        });

        it("debe rechazar un estado que no existe en el ciclo", () => {

            const id = crearCompra();
            const resultado = actualizarEstadoCompra(id, "inventado");

            expect(resultado).toBeNull();

        });

        it("no debe modificar la orden cuando el estado es inválido", () => {

            const id = crearCompra();

            actualizarEstadoCompra(id, "inventado");

            expect(leerCompra(id).estado).toBe("confirmada");

        });

        it("debe devolver null cuando la orden no existe", () => {

            crearCompra();

            expect(actualizarEstadoCompra("RB-inexistente", "enviada"))
                .toBeNull();

        });

        it("no debe tocar las demás órdenes", () => {

            const primera = crearCompra();
            const segunda = crearCompra();

            actualizarEstadoCompra(primera, "cancelada");

            expect(leerCompra(segunda).estado).toBe("confirmada");

        });

    });


    describe("archivarCompras", () => {

        it("debe archivar todas las órdenes pendientes", () => {

            crearCompra();
            crearCompra();

            expect(archivarCompras()).toBe(2);

        });

        it("debe marcar cada orden como archivada con su fecha de cierre", () => {

            const id = crearCompra();

            archivarCompras();

            expect(leerCompra(id).archivada).toBeTrue();
            expect(leerCompra(id).fechaCierre).toBeDefined();

        });

        it("no debe volver a archivar lo que ya estaba archivado", () => {

            crearCompra();

            archivarCompras();

            expect(archivarCompras()).toBe(0);

        });

        it("debe conservar las órdenes archivadas, no borrarlas", () => {

            crearCompra();

            archivarCompras();

            expect(leerCompras().length).toBe(1);

        });

        it("debe devolver cero cuando no hay ninguna orden", () => {

            expect(archivarCompras()).toBe(0);

        });

    });


    describe("resistencia a datos dañados", () => {

        it("debe tolerar un almacenamiento con contenido inválido", () => {

            localStorage.setItem(CLAVE_COMPRAS, "{dato-roto");

            expect(leerCompras()).toEqual([]);

        });

    });

});