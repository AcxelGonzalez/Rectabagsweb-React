import {
    useEffect,
    useState
} from "react";

import CartContext
    from "./CartContext";

import {
    obtenerStockValido
} from "../utils/stock";

const CLAVE_CARRITO =
    "recta_carrito_invitado";


function leerCarritoGuardado() {

    try {

        const guardado =
            JSON.parse(
                localStorage.getItem(
                    CLAVE_CARRITO
                )
            );


        return Array.isArray(guardado)
            ? guardado
            : [];

    } catch {

        return [];

    }

}


function CartProvider({
    children
}) {

    const [
        carrito,
        setCarrito
    ] = useState(
        leerCarritoGuardado
    );


    /*
     * Guarda automáticamente el carrito
     * cada vez que cambia su estado.
     */
    useEffect(() => {

        localStorage.setItem(
            CLAVE_CARRITO,
            JSON.stringify(carrito)
        );

    }, [carrito]);


    /*
     * Sincroniza el carrito si cambia
     * desde otra pestaña del navegador.
     */
    useEffect(() => {

        function sincronizarCarrito(
            evento
        ) {

            if (
                evento.key ===
                CLAVE_CARRITO
            ) {

                setCarrito(
                    leerCarritoGuardado()
                );

            }

        }


        window.addEventListener(
            "storage",
            sincronizarCarrito
        );


        return () => {

            window.removeEventListener(
                "storage",
                sincronizarCarrito
            );

        };

    }, []);


    function agregarProducto(
        producto,
        cantidad = 1
    ) {

        const cantidadAgregar =
            Math.max(
                1,
                Number(cantidad) || 1
            );


        const stockProducto =
            obtenerStockValido(
                producto.stock
            );
        
        if (stockProducto === 0) {
            return false;
        }


        setCarrito(
            (carritoActual) => {

                const existente =
                    carritoActual.find(
                        (item) =>
                            item.id ===
                            producto.id
                    );


                if (existente) {

                    return carritoActual.map(
                        (item) => {

                            if (
                                item.id !==
                                producto.id
                            ) {

                                return item;

                            }


                            const cantidadActual =
                                Number(
                                    item.cantidad
                                ) || 0;


                            const stock =
                                obtenerStockValido(
                                    item.stock,
                                    stockProducto
                                );


                            return {
                                ...item,

                                cantidad:
                                    Math.min(
                                        cantidadActual +
                                        cantidadAgregar,

                                        stock
                                    )
                            };

                        }
                    );

                }


                return [
                    ...carritoActual,

                    {
                        id:
                            producto.id,

                        nombre:
                            producto.nombre,

                        precio:
                            producto.precio,

                        imagen:
                            producto.imagen,

                        cantidad:
                            Math.min(
                                cantidadAgregar,
                                stockProducto
                            ),

                        stock:
                            stockProducto
                    }
                ];

            }
        );
        
        return true;
    }


    function cambiarCantidad(
        id,
        cambio
    ) {

        setCarrito(
            (carritoActual) =>
                carritoActual.map(
                    (item) => {

                        if (
                            item.id !== id
                        ) {

                            return item;

                        }


                        const cantidadActual =
                            Number(
                                item.cantidad
                            ) || 1;


                        const stock =
                            obtenerStockValido(
                                item.stock
                            );

                        if (stock === 0) {
                            return item;
                        }

                        const nuevaCantidad =
                            Math.max(
                                1,

                                Math.min(
                                    stock,

                                    cantidadActual +
                                    cambio
                                )
                            );


                        return {
                            ...item,
                            cantidad:
                                nuevaCantidad
                        };

                    }
                )
        );

    }


    function eliminarProducto(id) {

        setCarrito(
            (carritoActual) =>
                carritoActual.filter(
                    (item) =>
                        item.id !== id
                )
        );

    }


    function vaciarCarrito() {

        setCarrito([]);

    }


    const cantidadProductos =
        carrito.reduce(
            (total, item) =>
                total +
                (
                    Number(
                        item.cantidad
                    ) || 0
                ),

            0
        );


    const subtotal =
        carrito.reduce(
            (total, item) =>
                total +
                (
                    Number(
                        item.precio
                    ) || 0
                ) *
                (
                    Number(
                        item.cantidad
                    ) || 0
                ),

            0
        );


    return (

        <CartContext.Provider
            value={{
                carrito,
                agregarProducto,
                cambiarCantidad,
                eliminarProducto,
                vaciarCarrito,
                cantidadProductos,
                subtotal
            }}
        >

            {children}

        </CartContext.Provider>

    );

}


export default CartProvider;