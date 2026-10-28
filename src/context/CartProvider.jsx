import { useContext, useEffect, useState } from "react";

import AuthContext from "./AuthContext";
import CartContext from "./CartContext";
import { obtenerStockValido } from "../utils/stock";
import { fusionarCarritos, sincronizarCarrito as sincronizarContraCatalogo } from "../utils/carrito";


// Carrito de quien no ha iniciado sesión
const CLAVE_INVITADO = "recta_carrito_invitado";


/*
 cada usuario tiene su carrito con un ID único para que el navegador no los mezcle al cambiar de cuenta
 */
function claveDe(usuarioId) {

    return usuarioId ? `recta_carrito_${usuarioId}` : CLAVE_INVITADO;

}


function leerCarritoGuardado(usuarioId) {

    try {
        const guardado = JSON.parse(
            localStorage.getItem(claveDe(usuarioId)));

        return Array.isArray(guardado) ? guardado : [];

    } catch {

        return [];

    }

}


/*
 Carrito que corresponde mostrar para una identidad. Al iniciar sesión
 se le suma lo que la persona había juntado como invitada.
 */
function cargarCarritoDe(usuarioId) {

    const propio = leerCarritoGuardado(usuarioId);

    if (!usuarioId) {
        return propio;
    }

    const invitado = leerCarritoGuardado(null);

    return invitado.length > 0
        ? fusionarCarritos(invitado, propio)
        : propio;

}


function CartProvider({ children }) {

    /*
    el carrito debe funcionar sin sesion, en ese caso el carrito es del invitado
     */
    const auth = useContext(AuthContext);

    const usuarioId = auth?.usuarioActual?.id || null;

    const [carrito, setCarrito] = useState(
        () => cargarCarritoDe(usuarioId)
    );

    /*
    si alguien entra, sale y cambia de cuenta, se carga el carrito que corresponde y se renderiza 
    para que no se vea el carrito del usuario anterior
     */
    const [idAnterior, setIdAnterior] = useState(usuarioId);

    if (idAnterior !== usuarioId) {

        setIdAnterior(usuarioId);
        setCarrito(cargarCarritoDe(usuarioId));

    }

    // Dentro de una sesión el carrito de invitado ya se fusionó.
    useEffect(() => {

        if (usuarioId) {
            localStorage.removeItem(CLAVE_INVITADO);
        }

    }, [usuarioId]);


    /*
     * Avisos del último ajuste contra el catálogo (precios que cambiaron,
     * productos agotados o eliminados). Viven aquí y no en la página,
     * para que no se pierdan al volver a dibujarla.
     */
    const [avisosCarrito, setAvisosCarrito] = useState([]);


    // Guarda el carrito cada vez que cambia su estado
    useEffect(() => {

        localStorage.setItem(claveDe(usuarioId), JSON.stringify(carrito));

    }, [carrito, usuarioId]);


    // sincroniza el carrito si hay algun cambio desde otra pestaña
    useEffect(() => {

        function alCambiarElAlmacenamiento(evento) {

            if (evento.key === claveDe(usuarioId)) {
                setCarrito(leerCarritoGuardado(usuarioId));
            }

        }

        window.addEventListener("storage", alCambiarElAlmacenamiento);

        return () => {
            window.removeEventListener("storage", alCambiarElAlmacenamiento);
        };

    }, [usuarioId]);


    function agregarProducto(producto, cantidad = 1) {

        const cantidadAgregar = Math.max(1, Number(cantidad) || 1);

        const stockProducto = obtenerStockValido(producto.stock);

        if (stockProducto === 0) {
            return false;
        }

        setCarrito((carritoActual) => {

            const existente = carritoActual.find(
                (item) => item.id === producto.id
            );

            // Ya estaba: se suma la cantidad sin pasar del stock.
            if (existente) {

                return carritoActual.map((item) => {

                    if (item.id !== producto.id) {
                        return item;
                    }

                    const cantidadActual = Number(item.cantidad) || 0;

                    const stock = obtenerStockValido(item.stock, stockProducto);

                    return {
                        ...item,
                        cantidad: Math.min(
                            cantidadActual + cantidadAgregar,
                            stock
                        )
                    };

                });

            }

            // Producto nuevo en el carrito.
            return [
                ...carritoActual,
                {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precioOferta || producto.precio,
                    imagen: producto.imagen,
                    cantidad: Math.min(cantidadAgregar, stockProducto),
                    stock: stockProducto
                }
            ];

        });

        return true;

    }


    function cambiarCantidad(id, cambio) {

        setCarrito((carritoActual) =>
            carritoActual.map((item) => {

                if (item.id !== id) {
                    return item;
                }

                const stock = obtenerStockValido(item.stock);

                if (stock === 0) {
                    return item;
                }

                const cantidadActual = Number(item.cantidad) || 1;

                // Nunca menos de 1 ni más que el stock disponible.
                return {
                    ...item,
                    cantidad: Math.max(
                        1,
                        Math.min(stock, cantidadActual + cambio)
                    )
                };

            })
        );

    }

    function eliminarProducto(id) {

        setCarrito((carritoActual) =>
            carritoActual.filter((item) => item.id !== id));

    }

    function vaciarCarrito() {

        setCarrito([]);

    }

    /*
    actualiza el carrito con el catálogo: precios, nombres, imagenes y stock
     */
    function sincronizarConCatalogo(productos) {

        const resultado = sincronizarContraCatalogo(carrito, productos);

        if (resultado.huboCambios) {

            setCarrito(resultado.carrito);

            if (resultado.cambios.length > 0) {
                setAvisosCarrito(resultado.cambios);
            }

        }

        return resultado.cambios;

    }

    function descartarAvisos() {
        setAvisosCarrito([]);
    }

    const cantidadProductos = carrito.reduce(
        (total, item) => total + (Number(item.cantidad) || 0),
        0
    );


    const subtotal = carrito.reduce(
        (total, item) =>
            total + (Number(item.precio) || 0) * (Number(item.cantidad) || 0),0
    );

    return (

        <CartContext.Provider
            value={{
                carrito,
                agregarProducto,
                cambiarCantidad,
                eliminarProducto,
                vaciarCarrito,
                sincronizarConCatalogo,
                avisosCarrito,
                descartarAvisos,
                cantidadProductos,
                subtotal
            }}
        >

            {children}

        </CartContext.Provider>

    );

}

export default CartProvider;