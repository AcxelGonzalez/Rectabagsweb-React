import {
    STOCK_POR_DEFECTO,
    obtenerStockValido
} from "../utils/stock";


describe(
    "obtenerStockValido",
    () => {

        it(
            "debe utilizar el stock por defecto cuando el stock es undefined",
            () => {

                const resultado =
                    obtenerStockValido(
                        undefined
                    );


                expect(
                    resultado
                ).toBe(
                    STOCK_POR_DEFECTO
                );

            }
        );


        it(
            "debe respetar un stock igual a cero",
            () => {

                const resultado =
                    obtenerStockValido(
                        0
                    );


                expect(
                    resultado
                ).toBe(0);

            }
        );


        it(
            "debe convertir un stock decimal a entero",
            () => {

                const resultado =
                    obtenerStockValido(
                        4.8
                    );


                expect(
                    resultado
                ).toBe(4);

            }
        );


        it(
            "debe impedir valores de stock negativos",
            () => {

                const resultado =
                    obtenerStockValido(
                        -5
                    );


                expect(
                    resultado
                ).toBe(0);

            }
        );


        it(
            "debe utilizar el stock por defecto cuando el valor no es numérico",
            () => {

                const resultado =
                    obtenerStockValido(
                        "stock-invalido"
                    );


                expect(
                    resultado
                ).toBe(
                    STOCK_POR_DEFECTO
                );

            }
        );

    }
);