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

        it(
            "debe cambiar el estado de la orden indicada",
            () => {

                const compra =
                    guardarCompra({
                        estado:
                            "confirmada"
                    });


                const actualizada =
                    actualizarEstadoCompra(
                        compra.id,
                        "en preparación"
                    );


                expect(
                    actualizada
                ).not.toBeNull();


                expect(
                    actualizada.estado
                ).toBe(
                    "en preparación"
                );

            }
        );

        it(
            "debe guardar el cambio, no solo devolverlo",
            () => {

                const id =
                    crearCompra();


                const actualizada =
                    actualizarEstadoCompra(
                        id,
                        "en preparación"
                    );


                expect(
                    actualizada
                ).not.toBeNull();


                const guardada =
                    leerCompra(
                        id
                    );


                expect(
                    guardada
                ).toBeDefined();


                expect(
                    guardada.estado
                ).toBe(
                    "en preparación"
                );

            }
        );

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


    describe(
        "archivarCompras",
        () => {

            it(
                "debe archivar órdenes entregadas y canceladas",
                () => {

                    const entregada =
                        crearCompra({
                            estado:
                                "entregada"
                        });


                    const cancelada =
                        crearCompra({
                            estado:
                                "cancelada"
                        });


                    expect(
                        archivarCompras()
                    ).toBe(2);


                    expect(
                        leerCompra(
                            entregada
                        ).archivada
                    ).toBe(true);


                    expect(
                        leerCompra(
                            cancelada
                        ).archivada
                    ).toBe(true);

                }
            );


            it(
                "no debe archivar órdenes que todavía están activas",
                () => {

                    const confirmada =
                        crearCompra({
                            estado:
                                "confirmada"
                        });


                    const preparacion =
                        crearCompra({
                            estado:
                                "en preparación"
                        });


                    const enviada =
                        crearCompra({
                            estado:
                                "enviada"
                        });


                    expect(
                        archivarCompras()
                    ).toBe(0);


                    expect(
                        leerCompra(
                            confirmada
                        ).archivada
                    ).not.toBe(true);


                    expect(
                        leerCompra(
                            preparacion
                        ).archivada
                    ).not.toBe(true);


                    expect(
                        leerCompra(
                            enviada
                        ).archivada
                    ).not.toBe(true);

                }
            );


            it(
                "debe archivar solo las finalizadas y mantener activas las demás",
                () => {

                    const entregada =
                        crearCompra({
                            estado:
                                "entregada"
                        });


                    const cancelada =
                        crearCompra({
                            estado:
                                "cancelada"
                        });


                    const confirmada =
                        crearCompra({
                            estado:
                                "confirmada"
                        });


                    const enviada =
                        crearCompra({
                            estado:
                                "enviada"
                        });


                    expect(
                        archivarCompras()
                    ).toBe(2);


                    expect(
                        leerCompra(
                            entregada
                        ).archivada
                    ).toBe(true);


                    expect(
                        leerCompra(
                            cancelada
                        ).archivada
                    ).toBe(true);


                    expect(
                        leerCompra(
                            confirmada
                        ).archivada
                    ).not.toBe(true);


                    expect(
                        leerCompra(
                            enviada
                        ).archivada
                    ).not.toBe(true);

                }
            );


            it(
                "debe guardar la fecha de cierre en las órdenes archivadas",
                () => {

                    const id =
                        crearCompra({
                            estado:
                                "entregada"
                        });


                    archivarCompras();


                    expect(
                        leerCompra(
                            id
                        ).archivada
                    ).toBe(true);


                    expect(
                        leerCompra(
                            id
                        ).fechaCierre
                    ).toBeDefined();

                }
            );


            it(
                "no debe volver a archivar una orden ya archivada",
                () => {

                    crearCompra({
                        estado:
                            "entregada"
                    });


                    expect(
                        archivarCompras()
                    ).toBe(1);


                    expect(
                        archivarCompras()
                    ).toBe(0);

                }
            );


            it(
                "debe conservar las órdenes archivadas y no borrarlas",
                () => {

                    crearCompra({
                        estado:
                            "entregada"
                    });


                    archivarCompras();


                    expect(
                        leerCompras()
                            .length
                    ).toBe(1);

                }
            );


            it(
                "debe devolver cero cuando no existen órdenes",
                () => {

                    expect(
                        archivarCompras()
                    ).toBe(0);

                }
            );

        }
    );


    describe("resistencia a datos dañados", () => {

        it("debe tolerar un almacenamiento con contenido inválido", () => {

            localStorage.setItem(CLAVE_COMPRAS, "{dato-roto");

            expect(leerCompras()).toEqual([]);

        });

    });

});