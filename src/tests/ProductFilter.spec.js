import React, {
    act
} from "react";

import {
    createRoot
} from "react-dom/client";

import ProductFilter
    from "../components/products/ProductFilter";


describe(
    "ProductFilter",
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


        function renderizarFiltro(
            categoria = "todos",
            onCategoriaChange =
                () => {}
        ) {

            act(
                () => {

                    raiz.render(
                        React.createElement(
                            ProductFilter,
                            {
                                categoria,
                                onCategoriaChange
                            }
                        )
                    );

                }
            );

        }


        it(
            "debe renderizar las cinco categorías disponibles",
            () => {

                renderizarFiltro();


                const botones =
                    contenedor
                        .querySelectorAll(
                            "button"
                        );


                expect(
                    botones.length
                ).toBe(5);

            }
        );


        it(
            "debe destacar visualmente la categoría activa",
            () => {

                renderizarFiltro(
                    "mochilas"
                );


                const botones =
                    Array.from(
                        contenedor
                            .querySelectorAll(
                                "button"
                            )
                    );


                const botonMochilas =
                    botones.find(
                        (boton) =>
                            boton
                                .textContent
                                .trim() ===
                            "Mochilas"
                    );


                expect(
                    botonMochilas
                        .classList
                        .contains(
                            "btn-dark"
                        )
                ).toBe(true);

            }
        );


        it(
            "debe informar la categoría seleccionada al hacer clic",
            () => {

                const onCategoriaChange =
                    jasmine.createSpy(
                        "onCategoriaChange"
                    );


                renderizarFiltro(
                    "todos",
                    onCategoriaChange
                );


                const botones =
                    Array.from(
                        contenedor
                            .querySelectorAll(
                                "button"
                            )
                    );


                const botonCilindros =
                    botones.find(
                        (boton) =>
                            boton
                                .textContent
                                .trim() ===
                            "Cilindros"
                    );


                act(
                    () => {

                        botonCilindros.click();

                    }
                );


                expect(
                    onCategoriaChange
                ).toHaveBeenCalledWith(
                    "cilindros"
                );


                expect(
                    onCategoriaChange
                        .calls
                        .count()
                ).toBe(1);

            }
        );

    }
);