import {
    calcularTotalGastado
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