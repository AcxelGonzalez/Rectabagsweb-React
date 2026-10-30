import {
    guardarCompra,
    leerCompraPorId,
    actualizarEstadoCompra
} from "../services/compraService";

describe(
    "compraService",
    () => {

        const CLAVE_COMPRAS =
            "recta_compras";


        beforeEach(
            () => {

                localStorage.clear();

            }
        );


        afterEach(
            () => {

                localStorage.clear();

            }
        );


        it(
            "debe guardar una compra en LocalStorage",
            () => {

                vi.spyOn(
                    Date,
                    "now"
                ).mockReturnValue(
                    1000
                );


                const compra =
                    guardarCompra({
                        usuarioId:
                            "usuario-1",

                        cantidadProductos:
                            2,

                        subtotal:
                            50000
                    });


                const comprasGuardadas =
                    JSON.parse(
                        localStorage.getItem(
                            CLAVE_COMPRAS
                        )
                    );


                expect(
                    compra.id
                ).toMatch(
                    /^RB-1000-/
                );


                expect(
                    comprasGuardadas.length
                ).toBe(1);


                expect(
                    comprasGuardadas[0]
                        .subtotal
                ).toBe(
                    50000
                );

            }
        );


        it(
            "debe conservar las compras anteriores al guardar una nueva",
            () => {

                vi.spyOn(
                    Date,
                    "now"
                )
                    .mockReturnValueOnce(
                        1000
                    )
                    .mockReturnValueOnce(
                        2000
                    );


                guardarCompra({
                    subtotal:
                        10000
                });


                guardarCompra({
                    subtotal:
                        20000
                });


                const comprasGuardadas =
                    JSON.parse(
                        localStorage.getItem(
                            CLAVE_COMPRAS
                        )
                    );


                expect(
                    comprasGuardadas.length
                ).toBe(2);


                expect(
                    comprasGuardadas[0].id
                ).toMatch(
                    /^RB-1000-/
                );


                expect(
                    comprasGuardadas[1].id
                ).toMatch(
                    /^RB-2000-/
                );

            }
        );


        it(
            "debe encontrar una compra utilizando su identificador",
            () => {

                vi.spyOn(
                    Date,
                    "now"
                ).mockReturnValue(
                    3000
                );


                const guardada =
                    guardarCompra({
                        usuarioId:
                            "usuario-prueba",

                        subtotal:
                            75000
                    });


                const compra =
                    leerCompraPorId(
                        guardada.id
                    );


                expect(
                    compra
                ).not.toBeNull();


                expect(
                    compra.id
                ).toMatch(
                    /^RB-3000-/
                );


                expect(
                    compra.usuarioId
                ).toBe(
                    "usuario-prueba"
                );


                expect(
                    compra.subtotal
                ).toBe(
                    75000
                );

            }
        );


        it(
            "debe retornar null cuando la compra no existe",
            () => {

                const resultado =
                    leerCompraPorId(
                        "RB-INEXISTENTE"
                    );


                expect(
                    resultado
                ).toBeNull();

            }
        );


        it(
            "debe retornar null cuando no se entrega un identificador",
            () => {

                expect(
                    leerCompraPorId()
                ).toBeNull();


                expect(
                    leerCompraPorId("")
                ).toBeNull();

            }
        );


        it(
            "debe recuperarse si LocalStorage contiene datos inválidos",
            () => {

                localStorage.setItem(
                    CLAVE_COMPRAS,
                    "contenido-no-valido"
                );


                vi.spyOn(
                    Date,
                    "now"
                ).mockReturnValue(
                    4000
                );


                const compra =
                    guardarCompra({
                        subtotal:
                            30000
                    });


                const comprasGuardadas =
                    JSON.parse(
                        localStorage.getItem(
                            CLAVE_COMPRAS
                        )
                    );


                expect(
                    compra.id
                ).toMatch(
                    /^RB-4000-/
                );


                expect(
                    comprasGuardadas.length
                ).toBe(1);


                expect(
                    comprasGuardadas[0]
                        .subtotal
                ).toBe(
                    30000
                );

            }
        );

        it(
            "debe permitir avanzar de confirmada a en preparación",
            () => {

                const compra =
                    guardarCompra({
                        subtotal:
                            30000,

                        estado:
                            "confirmada"
                    });


                const resultado =
                    actualizarEstadoCompra(
                        compra.id,
                        "en preparación"
                    );


                expect(
                    resultado
                ).not.toBeNull();


                expect(
                    resultado.estado
                ).toBe(
                    "en preparación"
                );


                expect(
                    leerCompraPorId(
                        compra.id
                    ).estado
                ).toBe(
                    "en preparación"
                );

            }
        );

        it(
            "no debe permitir saltar de confirmada a enviada",
            () => {

                const compra =
                    guardarCompra({
                        estado:
                            "confirmada"
                    });


                const resultado =
                    actualizarEstadoCompra(
                        compra.id,
                        "enviada"
                    );


                expect(
                    resultado
                ).toBeNull();


                expect(
                    leerCompraPorId(
                        compra.id
                    ).estado
                ).toBe(
                    "confirmada"
                );

            }
        );

        it(
            "debe permitir avanzar de en preparación a enviada",
            () => {

                const compra =
                    guardarCompra({
                        estado:
                            "en preparación"
                    });


                const resultado =
                    actualizarEstadoCompra(
                        compra.id,
                        "enviada"
                    );


                expect(
                    resultado
                ).not.toBeNull();


                expect(
                    resultado.estado
                ).toBe(
                    "enviada"
                );

            }
        );

        it(
            "debe permitir avanzar de enviada a entregada",
            () => {

                const compra =
                    guardarCompra({
                        estado:
                            "enviada"
                    });


                const resultado =
                    actualizarEstadoCompra(
                        compra.id,
                        "entregada"
                    );


                expect(
                    resultado
                ).not.toBeNull();


                expect(
                    resultado.estado
                ).toBe(
                    "entregada"
                );

            }
        );

        it(
            "no debe permitir cancelar una orden ya entregada",
            () => {

                const compra =
                    guardarCompra({
                        estado:
                            "entregada"
                    });


                const resultado =
                    actualizarEstadoCompra(
                        compra.id,
                        "cancelada"
                    );


                expect(
                    resultado
                ).toBeNull();


                expect(
                    leerCompraPorId(
                        compra.id
                    ).estado
                ).toBe(
                    "entregada"
                );

            }
        );

        it(
            "debe permitir reactivar una orden cancelada como confirmada",
            () => {

                const compra =
                    guardarCompra({
                        estado:
                            "cancelada"
                    });


                const resultado =
                    actualizarEstadoCompra(
                        compra.id,
                        "confirmada"
                    );


                expect(
                    resultado
                ).not.toBeNull();


                expect(
                    resultado.estado
                ).toBe(
                    "confirmada"
                );

            }
        );

        it(
            "no debe permitir reactivar una orden cancelada directamente como enviada",
            () => {

                const compra =
                    guardarCompra({
                        estado:
                            "cancelada"
                    });


                const resultado =
                    actualizarEstadoCompra(
                        compra.id,
                        "enviada"
                    );


                expect(
                    resultado
                ).toBeNull();


                expect(
                    leerCompraPorId(
                        compra.id
                    ).estado
                ).toBe(
                    "cancelada"
                );

            }
        );

        it(
            "no debe modificar el estado de una orden archivada",
            () => {

                localStorage.setItem(
                    "recta_compras",
                    JSON.stringify([
                        {
                            id:
                                "RB-ARCHIVADA",

                            estado:
                                "confirmada",

                            archivada:
                                true,

                            subtotal:
                                30000
                        }
                    ])
                );


                const resultado =
                    actualizarEstadoCompra(
                        "RB-ARCHIVADA",
                        "en preparación"
                    );


                expect(
                    resultado
                ).toBeNull();


                expect(
                    leerCompraPorId(
                        "RB-ARCHIVADA"
                    ).estado
                ).toBe(
                    "confirmada"
                );

            }
        );

    }
);