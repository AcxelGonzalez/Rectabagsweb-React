import {
    calcularTotalGastado,
    calcularEstadisticas,
    comprasDelPeriodo
} from "../utils/estadisticas";


describe(
    "calcularTotalGastado",
    () => {

        it(
            "debe excluir las compras canceladas del total gastado",
            () => {

                const compras = [
                    {
                        subtotal: 30000,
                        estado: "entregada"
                    },
                    {
                        subtotal: 50000,
                        estado: "cancelada"
                    },
                    {
                        subtotal: 20000,
                        estado: "enviada"
                    }
                ];


                const total =
                    calcularTotalGastado(
                        compras
                    );


                expect(
                    total
                ).toBe(
                    50000
                );

            }
        );


        it(
            "debe incluir compras archivadas porque pertenecen al historial del usuario",
            () => {

                const compras = [
                    {
                        subtotal: 40000,
                        estado: "entregada",
                        archivada: true
                    },
                    {
                        subtotal: 15000,
                        estado: "confirmada",
                        archivada: false
                    }
                ];


                const total =
                    calcularTotalGastado(
                        compras
                    );


                expect(
                    total
                ).toBe(
                    55000
                );

            }
        );


        it(
            "debe retornar cero cuando todas las compras están canceladas",
            () => {

                const compras = [
                    {
                        subtotal: 25000,
                        estado: "cancelada"
                    },
                    {
                        subtotal: 10000,
                        estado: "cancelada"
                    }
                ];


                const total =
                    calcularTotalGastado(
                        compras
                    );


                expect(
                    total
                ).toBe(
                    0
                );

            }
        );


        it(
            "debe manejar subtotales inexistentes sin generar NaN",
            () => {

                const compras = [
                    {
                        estado: "entregada"
                    },
                    {
                        subtotal: 10000,
                        estado: "confirmada"
                    }
                ];


                const total =
                    calcularTotalGastado(
                        compras
                    );


                expect(
                    total
                ).toBe(
                    10000
                );

            }
        );

    }
);

describe(
    "comprasDelPeriodo",
    () => {

        it(
            "debe excluir compras canceladas y archivadas",
            () => {

                const compras = [

                    {
                        id: "1",
                        estado:
                            "confirmada"
                    },

                    {
                        id: "2",
                        estado:
                            "cancelada"
                    },

                    {
                        id: "3",
                        estado:
                            "entregada",
                        archivada:
                            true
                    },

                    {
                        id: "4",
                        estado:
                            "enviada"
                    }

                ];


                const resultado =
                    comprasDelPeriodo(
                        compras
                    );


                expect(
                    resultado.map(
                        (compra) =>
                            compra.id
                    )
                ).toEqual([
                    "1",
                    "4"
                ]);

            }
        );


        it(
            "debe manejar una entrada inválida como una lista vacía",
            () => {

                expect(
                    comprasDelPeriodo(
                        null
                    )
                ).toEqual([]);


                expect(
                    comprasDelPeriodo(
                        undefined
                    )
                ).toEqual([]);

            }
        );

    }
);

describe(
    "calcularEstadisticas",
    () => {

        const compras = [

            {
                id:
                    "RB-1",

                estado:
                    "confirmada",

                archivada:
                    false,

                subtotal:
                    60000,

                cantidadProductos:
                    3,

                productos: [

                    {
                        id:
                            1,

                        nombre:
                            "RC-30",

                        precio:
                            20000,

                        cantidad:
                            2
                    },

                    {
                        id:
                            2,

                        nombre:
                            "Musette",

                        precio:
                            20000,

                        cantidad:
                            1
                    }

                ]

            },


            {
                id:
                    "RB-2",

                estado:
                    "enviada",

                archivada:
                    false,

                subtotal:
                    40000,

                cantidadProductos:
                    2,

                productos: [

                    {
                        id:
                            1,

                        nombre:
                            "RC-30",

                        precio:
                            20000,

                        cantidad:
                            1
                    },

                    {
                        id:
                            3,

                        nombre:
                            "Hippouch",

                        precio:
                            20000,

                        cantidad:
                            1
                    }

                ]

            },


            {
                id:
                    "RB-3",

                estado:
                    "cancelada",

                archivada:
                    false,

                subtotal:
                    100000,

                cantidadProductos:
                    5,

                productos: [

                    {
                        id:
                            99,

                        nombre:
                            "Producto cancelado",

                        precio:
                            20000,

                        cantidad:
                            5
                    }

                ]

            },


            {
                id:
                    "RB-4",

                estado:
                    "entregada",

                archivada:
                    true,

                subtotal:
                    30000,

                cantidadProductos:
                    1,

                productos: [

                    {
                        id:
                            4,

                        nombre:
                            "Producto archivado",

                        precio:
                            30000,

                        cantidad:
                            1
                    }

                ]

            }

        ];

        it(
            "debe calcular ventas utilizando solo órdenes válidas del periodo",
            () => {

                const resultado =
                    calcularEstadisticas(
                        compras
                    );


                expect(
                    resultado.totalVentas
                ).toBe(
                    100000
                );


                expect(
                    resultado.cantidadOrdenes
                ).toBe(
                    2
                );

            }
        );

        it(
            "debe calcular correctamente las unidades vendidas",
            () => {

                const resultado =
                    calcularEstadisticas(
                        compras
                    );


                expect(
                    resultado.unidadesVendidas
                ).toBe(
                    5
                );

            }
        );

        it(
            "debe calcular el ticket promedio de las órdenes válidas",
            () => {

                const resultado =
                    calcularEstadisticas(
                        compras
                    );


                expect(
                    resultado.ticketPromedio
                ).toBe(
                    50000
                );

            }
        );

        it(
            "debe identificar el producto más vendido por unidades",
            () => {

                const resultado =
                    calcularEstadisticas(
                        compras
                    );


                expect(
                    resultado
                        .productoMasVendido
                        .nombre
                ).toBe(
                    "RC-30"
                );


                expect(
                    resultado
                        .productoMasVendido
                        .unidades
                ).toBe(
                    3
                );


                expect(
                    resultado
                        .productoMasVendido
                        .total
                ).toBe(
                    60000
                );

            }
        );

        it(
            "debe ordenar el ranking desde el producto más vendido",
            () => {

                const resultado =
                    calcularEstadisticas(
                        compras
                    );


                expect(
                    resultado
                        .rankingProductos[0]
                        .nombre
                ).toBe(
                    "RC-30"
                );


                expect(
                    resultado
                        .rankingProductos[0]
                        .unidades
                ).toBe(
                    3
                );


                expect(
                    resultado
                        .rankingProductos.length
                ).toBe(
                    3
                );

            }
        );

        it(
            "debe contar estados activos incluyendo canceladas no archivadas",
            () => {

                const resultado =
                    calcularEstadisticas(
                        compras
                    );


                expect(
                    resultado.comprasPorEstado
                ).toEqual({

                    confirmada:
                        1,

                    enviada:
                        1,

                    cancelada:
                        1

                });

            }
        );

        it(
            "debe devolver estadísticas vacías cuando no existen compras",
            () => {

                const resultado =
                    calcularEstadisticas(
                        []
                    );


                expect(
                    resultado.cantidadOrdenes
                ).toBe(0);


                expect(
                    resultado.totalVentas
                ).toBe(0);


                expect(
                    resultado.unidadesVendidas
                ).toBe(0);


                expect(
                    resultado.ticketPromedio
                ).toBe(0);


                expect(
                    resultado.productoMasVendido
                ).toBeNull();


                expect(
                    resultado.rankingProductos
                ).toEqual([]);


                expect(
                    resultado.comprasPorEstado
                ).toEqual({});

            }
        );

        it(
            "debe tolerar compras sin arreglo de productos",
            () => {

                const resultado =
                    calcularEstadisticas([
                        {
                            estado:
                                "confirmada",

                            subtotal:
                                15000,

                            cantidadProductos:
                                0
                        }
                    ]);


                expect(
                    resultado.totalVentas
                ).toBe(
                    15000
                );


                expect(
                    resultado.rankingProductos
                ).toEqual([]);


                expect(
                    resultado.productoMasVendido
                ).toBeNull();

            }
        );
    });