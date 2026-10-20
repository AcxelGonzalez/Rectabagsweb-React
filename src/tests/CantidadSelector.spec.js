import React, {
    act
} from "react";

import {
    createRoot
} from "react-dom/client";

import CantidadSelector
    from "../components/products/CantidadSelector";


describe(
    "CantidadSelector",
    () => {

        let contenedor;
        let raiz;


        beforeAll(
            () => {

                globalThis
                    .IS_REACT_ACT_ENVIRONMENT =
                    true;

            }
        );


        beforeEach(
            () => {

                contenedor =
                    document.createElement(
                        "div"
                    );


                document.body.appendChild(
                    contenedor
                );


                raiz =
                    createRoot(
                        contenedor
                    );

            }
        );


        afterEach(
            () => {

                act(
                    () => {

                        raiz.unmount();

                    }
                );


                contenedor.remove();

            }
        );


        afterAll(
            () => {

                delete globalThis
                    .IS_REACT_ACT_ENVIRONMENT;

            }
        );


        function renderizarSelector({
            cantidad = 1,
            maximo = 10,
            onCambiar = () => {}
        } = {}) {

            act(
                () => {

                    raiz.render(
                        React.createElement(
                            CantidadSelector,
                            {
                                cantidad,
                                maximo,
                                onCambiar
                            }
                        )
                    );

                }
            );

        }


        it(
            "debe mostrar la cantidad recibida mediante props",
            () => {

                renderizarSelector({
                    cantidad: 4,
                    maximo: 10
                });


                const input =
                    contenedor.querySelector(
                        'input[type="number"]'
                    );


                expect(
                    input.value
                ).toBe("4");


                expect(
                    input.max
                ).toBe("10");

            }
        );


        it(
            "debe aumentar la cantidad al presionar el botón más",
            () => {

                const onCambiar =
                    jasmine.createSpy(
                        "onCambiar"
                    );


                renderizarSelector({
                    cantidad: 2,
                    maximo: 10,
                    onCambiar
                });


                const botones =
                    contenedor.querySelectorAll(
                        "button"
                    );


                const botonAumentar =
                    botones[1];


                act(
                    () => {

                        botonAumentar.click();

                    }
                );


                expect(
                    onCambiar
                ).toHaveBeenCalledWith(
                    3
                );


                expect(
                    onCambiar
                        .calls
                        .count()
                ).toBe(1);

            }
        );


        it(
            "debe disminuir la cantidad al presionar el botón menos",
            () => {

                const onCambiar =
                    jasmine.createSpy(
                        "onCambiar"
                    );


                renderizarSelector({
                    cantidad: 3,
                    maximo: 10,
                    onCambiar
                });


                const botones =
                    contenedor.querySelectorAll(
                        "button"
                    );


                const botonDisminuir =
                    botones[0];


                act(
                    () => {

                        botonDisminuir.click();

                    }
                );


                expect(
                    onCambiar
                ).toHaveBeenCalledWith(
                    2
                );


                expect(
                    onCambiar
                        .calls
                        .count()
                ).toBe(1);

            }
        );


        it(
            "debe deshabilitar el botón menos cuando la cantidad es uno",
            () => {

                renderizarSelector({
                    cantidad: 1,
                    maximo: 10
                });


                const botones =
                    contenedor.querySelectorAll(
                        "button"
                    );


                expect(
                    botones[0].disabled
                ).toBe(true);


                expect(
                    botones[1].disabled
                ).toBe(false);

            }
        );


        it(
            "debe deshabilitar el botón más cuando alcanza el stock máximo",
            () => {

                renderizarSelector({
                    cantidad: 5,
                    maximo: 5
                });


                const botones =
                    contenedor.querySelectorAll(
                        "button"
                    );


                expect(
                    botones[0].disabled
                ).toBe(false);


                expect(
                    botones[1].disabled
                ).toBe(true);

            }
        );


        it(
            "no debe aumentar la cantidad cuando ya alcanzó el máximo",
            () => {

                const onCambiar =
                    jasmine.createSpy(
                        "onCambiar"
                    );


                renderizarSelector({
                    cantidad: 5,
                    maximo: 5,
                    onCambiar
                });


                const botones =
                    contenedor.querySelectorAll(
                        "button"
                    );


                const botonAumentar =
                    botones[1];


                act(
                    () => {

                        botonAumentar.click();

                    }
                );


                expect(
                    onCambiar
                ).not.toHaveBeenCalled();

            }
        );

    }
);