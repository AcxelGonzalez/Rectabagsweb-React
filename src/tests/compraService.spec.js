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

                spyOn(
                    Date,
                    "now"
                ).and.returnValue(
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
                ).toBe(
                    "RB-1000"
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

                spyOn(
                    Date,
                    "now"
                ).and.returnValues(
                    1000,
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
                ).toBe(
                    "RB-1000"
                );


                expect(
                    comprasGuardadas[1].id
                ).toBe(
                    "RB-2000"
                );

            }
        );


        it(
            "debe encontrar una compra utilizando su identificador",
            () => {

                spyOn(
                    Date,
                    "now"
                ).and.returnValue(
                    3000
                );


                guardarCompra({
                    usuarioId:
                        "usuario-prueba",

                    subtotal:
                        75000
                });


                const compra =
                    leerCompraPorId(
                        "RB-3000"
                    );


                expect(
                    compra
                ).not.toBeNull();


                expect(
                    compra.id
                ).toBe(
                    "RB-3000"
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


                spyOn(
                    Date,
                    "now"
                ).and.returnValue(
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
                ).toBe(
                    "RB-4000"
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
            "debe actualizar el estado de una compra",
            () => {

                spyOn(
                    Date,
                    "now"
                ).and.returnValue(
                    5000
                );


                guardarCompra({
                    subtotal:
                        30000,

                    estado:
                        "confirmada"
                });


                const actualizada =
                    actualizarEstadoCompra(
                        "RB-5000",
                        "cancelada"
                    );


                expect(
                    actualizada
                ).not.toBeNull();


                expect(
                    actualizada.estado
                ).toBe(
                    "cancelada"
                );


                expect(
                    leerCompraPorId(
                        "RB-5000"
                    ).estado
                ).toBe(
                    "cancelada"
                );

            }
        );

        it(
            "no debe aceptar un estado de compra inválido",
            () => {

                spyOn(
                    Date,
                    "now"
                ).and.returnValue(
                    6000
                );


                guardarCompra({
                    subtotal:
                        30000,

                    estado:
                        "confirmada"
                });


                const resultado =
                    actualizarEstadoCompra(
                        "RB-6000",
                        "estado inventado"
                    );


                expect(
                    resultado
                ).toBeNull();


                expect(
                    leerCompraPorId(
                        "RB-6000"
                    ).estado
                ).toBe(
                    "confirmada"
                );

            }
        );

        it(
            "debe retornar null al cambiar el estado de una compra inexistente",
            () => {

                const resultado =
                    actualizarEstadoCompra(
                        "RB-INEXISTENTE",
                        "cancelada"
                    );


                expect(
                    resultado
                ).toBeNull();

            }
        );

    }
);