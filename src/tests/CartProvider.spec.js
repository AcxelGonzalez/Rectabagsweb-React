import React, {
    act
} from "react";

import {
    createRoot
} from "react-dom/client";

import CartProvider
    from "../context/CartProvider";

import useCart
    from "../hooks/useCart";


describe(
    "CartProvider",
    () => {

        const CLAVE_CARRITO =
            "recta_carrito_invitado";


        let contenedor;
        let raiz;
        let carritoApi;


        const productoPrueba = {

            id:
                999,

            nombre:
                "Producto Test",

            precio:
                10000,

            imagen:
                "/img/test.webp",

            stock:
                5

        };


        function ConsumidorPrueba() {

            carritoApi =
                useCart();


            return React.createElement(
                "div",
                {
                    id:
                        "estado-carrito"
                },

                String(
                    carritoApi
                        .cantidadProductos
                )
            );

        }


        function renderizarCarrito() {

            act(
                () => {

                    raiz.render(
                        React.createElement(
                            CartProvider,
                            null,

                            React.createElement(
                                ConsumidorPrueba
                            )
                        )
                    );

                }
            );

        }


        beforeAll(
            () => {

                globalThis
                    .IS_REACT_ACT_ENVIRONMENT =
                    true;

            }
        );


        beforeEach(
            () => {

                localStorage.clear();


                carritoApi =
                    null;


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


                localStorage.clear();

            }
        );


        afterAll(
            () => {

                delete globalThis
                    .IS_REACT_ACT_ENVIRONMENT;

            }
        );


        it(
            "debe iniciar con el carrito vacío",
            () => {

                renderizarCarrito();


                expect(
                    carritoApi.carrito.length
                ).toBe(0);


                expect(
                    carritoApi
                        .cantidadProductos
                ).toBe(0);


                expect(
                    carritoApi.subtotal
                ).toBe(0);

            }
        );


        it(
            "debe agregar un producto al carrito",
            () => {

                renderizarCarrito();


                let resultado;


                act(
                    () => {

                        resultado =
                            carritoApi
                                .agregarProducto(
                                    productoPrueba,
                                    2
                                );

                    }
                );


                expect(
                    resultado
                ).toBe(true);


                expect(
                    carritoApi.carrito.length
                ).toBe(1);


                expect(
                    carritoApi.carrito[0]
                        .cantidad
                ).toBe(2);


                expect(
                    carritoApi
                        .cantidadProductos
                ).toBe(2);


                expect(
                    carritoApi.subtotal
                ).toBe(
                    20000
                );

            }
        );


        it(
            "debe acumular cantidades cuando se agrega el mismo producto",
            () => {

                renderizarCarrito();


                act(
                    () => {

                        carritoApi
                            .agregarProducto(
                                productoPrueba,
                                2
                            );

                    }
                );


                act(
                    () => {

                        carritoApi
                            .agregarProducto(
                                productoPrueba,
                                2
                            );

                    }
                );


                expect(
                    carritoApi.carrito.length
                ).toBe(1);


                expect(
                    carritoApi.carrito[0]
                        .cantidad
                ).toBe(4);


                expect(
                    carritoApi.subtotal
                ).toBe(
                    40000
                );

            }
        );


        it(
            "no debe superar el stock máximo al agregar cantidades",
            () => {

                renderizarCarrito();


                act(
                    () => {

                        carritoApi
                            .agregarProducto(
                                productoPrueba,
                                4
                            );

                    }
                );


                act(
                    () => {

                        carritoApi
                            .agregarProducto(
                                productoPrueba,
                                4
                            );

                    }
                );


                expect(
                    carritoApi.carrito[0]
                        .cantidad
                ).toBe(5);


                expect(
                    carritoApi
                        .cantidadProductos
                ).toBe(5);


                expect(
                    carritoApi.subtotal
                ).toBe(
                    50000
                );

            }
        );


        it(
            "debe rechazar productos sin stock",
            () => {

                renderizarCarrito();


                const productoSinStock = {
                    ...productoPrueba,
                    id:
                        1000,
                    stock:
                        0
                };


                let resultado;


                act(
                    () => {

                        resultado =
                            carritoApi
                                .agregarProducto(
                                    productoSinStock
                                );

                    }
                );


                expect(
                    resultado
                ).toBe(false);


                expect(
                    carritoApi.carrito.length
                ).toBe(0);


                expect(
                    carritoApi
                        .cantidadProductos
                ).toBe(0);

            }
        );


        it(
            "debe respetar los límites al cambiar la cantidad",
            () => {

                renderizarCarrito();


                act(
                    () => {

                        carritoApi
                            .agregarProducto(
                                productoPrueba,
                                3
                            );

                    }
                );


                act(
                    () => {

                        carritoApi
                            .cambiarCantidad(
                                productoPrueba.id,
                                10
                            );

                    }
                );


                expect(
                    carritoApi.carrito[0]
                        .cantidad
                ).toBe(5);


                act(
                    () => {

                        carritoApi
                            .cambiarCantidad(
                                productoPrueba.id,
                                -20
                            );

                    }
                );


                expect(
                    carritoApi.carrito[0]
                        .cantidad
                ).toBe(1);

            }
        );


        it(
            "debe eliminar un producto del carrito",
            () => {

                renderizarCarrito();


                act(
                    () => {

                        carritoApi
                            .agregarProducto(
                                productoPrueba,
                                2
                            );

                    }
                );


                act(
                    () => {

                        carritoApi
                            .eliminarProducto(
                                productoPrueba.id
                            );

                    }
                );


                expect(
                    carritoApi.carrito.length
                ).toBe(0);


                expect(
                    carritoApi.subtotal
                ).toBe(0);

            }
        );


        it(
            "debe vaciar completamente el carrito",
            () => {

                renderizarCarrito();


                act(
                    () => {

                        carritoApi
                            .agregarProducto(
                                productoPrueba,
                                3
                            );

                    }
                );


                act(
                    () => {

                        carritoApi
                            .vaciarCarrito();

                    }
                );


                expect(
                    carritoApi.carrito.length
                ).toBe(0);


                expect(
                    carritoApi
                        .cantidadProductos
                ).toBe(0);


                expect(
                    carritoApi.subtotal
                ).toBe(0);

            }
        );


        it(
            "debe persistir el carrito en LocalStorage",
            () => {

                renderizarCarrito();


                act(
                    () => {

                        carritoApi
                            .agregarProducto(
                                productoPrueba,
                                2
                            );

                    }
                );


                const guardado =
                    JSON.parse(
                        localStorage.getItem(
                            CLAVE_CARRITO
                        )
                    );


                expect(
                    guardado.length
                ).toBe(1);


                expect(
                    guardado[0].id
                ).toBe(
                    productoPrueba.id
                );


                expect(
                    guardado[0].cantidad
                ).toBe(2);

            }
        );


        it(
            "debe recuperar un carrito almacenado previamente",
            () => {

                localStorage.setItem(
                    CLAVE_CARRITO,
                    JSON.stringify([
                        {
                            ...productoPrueba,
                            cantidad:
                                3
                        }
                    ])
                );


                renderizarCarrito();


                expect(
                    carritoApi.carrito.length
                ).toBe(1);


                expect(
                    carritoApi.carrito[0]
                        .cantidad
                ).toBe(3);


                expect(
                    carritoApi
                        .cantidadProductos
                ).toBe(3);


                expect(
                    carritoApi.subtotal
                ).toBe(
                    30000
                );

            }
        );

    }
);