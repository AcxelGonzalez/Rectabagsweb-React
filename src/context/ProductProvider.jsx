import {
    useEffect,
    useState
} from "react";

import ProductContext
    from "./ProductContext";

import { obtenerStockValido } from "../utils/stock";

import { verificarStock } from "../utils/carrito";

import {
    productos as productosIniciales,
    obtenerProductoPorId,
    obtenerProductosPorCategoria,
    crearProducto as crearProductoEnLista,
    actualizarProducto as actualizarProductoEnLista,
    eliminarProducto as eliminarProductoDeLista
} from "../data/productos";


const CLAVE_PRODUCTOS =
    "recta_productos";


/*
 * Lee los productos guardados en localStorage.
 * Si no hay nada guardado (primera visita) o los datos
 * están dañados, usa la lista inicial de productos.js.
 */
function leerProductosGuardados() {

    try {

        const guardados =
            JSON.parse(
                localStorage.getItem(
                    CLAVE_PRODUCTOS
                )
            );

        return Array.isArray(guardados)
            ? guardados
            : productosIniciales;

    } catch {

        return productosIniciales;

    }

}


function ProductProvider({
    children
}) {

    const [
        productos,
        setProductos
    ] = useState(
        leerProductosGuardados
    );


    /*
     * Guarda los productos cada vez que cambian.
     */
    useEffect(() => {

        localStorage.setItem(
            CLAVE_PRODUCTOS,
            JSON.stringify(productos)
        );

    }, [productos]);


    /*
     * Busca un producto por su id.
     * El id de la URL llega como texto ("3"),
     * por eso se convierte con Number().
     */
    function obtenerProducto(id) {

        return obtenerProductoPorId(
            productos,
            id
        );

    }


    /*
     * Devuelve los productos de una categoría.
     * "todos" entrega la lista completa.
     */
    function obtenerPorCategoria(categoria) {

        return obtenerProductosPorCategoria(
            productos,
            categoria
        );

    }


    /*
     * ---------------------------------------------------------------
     * Operaciones del panel de administración
     * ---------------------------------------------------------------
     *
     * Cada función delega la lógica y las validaciones en las
     * funciones puras de data/productos.js. Aquí solo se guarda la
     * lista nueva en el estado cuando la operación resultó correcta;
     * el useEffect de arriba se encarga de la persistencia.
     *
     * Devuelven { ok, mensaje, producto } para que la vista muestre
     * el aviso de éxito o el error sin conocer los detalles.
     */

    function guardarResultado(resultado) {

        if (resultado.ok) {

            setProductos(
                resultado.productos
            );

        }


        return {
            ok:
                resultado.ok,
            mensaje:
                resultado.mensaje,
            producto:
                resultado.producto || null
        };

    }


    function crearProducto(datos) {

        return guardarResultado(
            crearProductoEnLista(
                productos,
                datos
            )
        );

    }


    function actualizarProducto(
        id,
        cambios
    ) {

        return guardarResultado(
            actualizarProductoEnLista(
                productos,
                id,
                cambios
            )
        );

    }


    function eliminarProducto(id) {

        return guardarResultado(
            eliminarProductoDeLista(
                productos,
                id
            )
        );

    }
    
    /*
    * Comprueba que todos los productos del carrito sigan existiendo
    * y tengan stock suficiente, sin modificar el catálogo.
    */
    function verificarDisponibilidad(items) {

        return verificarStock(
            items,
            productos
        );

    }

    /*
     Resta del stock las cantidades compradas, pero solo si alcanza.
     Recibe los productos del carrito: [{ id, cantidad }, ...]

     Antes de tocar nada verifica el carrito contra el catálogo: si algún
     producto no alcanza no se descuenta nada y se devuelve el detalle,
     para que el checkout no registre una venta imposible.
     */
    function descontarStock(items) {

        const verificacion = verificarStock(items, productos);

        if (!verificacion.ok) {
            return verificacion;
        }

        setProductos((actuales) =>
            actuales.map((producto) => {

                const item = items.find((i) => i.id === producto.id);

                if (!item) {
                    return producto;
                }

                const stockActual = obtenerStockValido(producto.stock);

                return {
                    ...producto,
                    stock: Math.max(0, stockActual - Number(item.cantidad))
                };

            })
        );

        return verificacion;

    }


    /*
     * Vuelve al catálogo original de productos.js.
     * Sirve para dejar la tienda como estaba después de hacer
     * pruebas en el panel de administración.
     */
    function restaurarProductos() {

        setProductos(
            productosIniciales
        );


        return {
            ok: true,
            mensaje:
                "Catálogo restaurado correctamente.",
            producto: null
        };

    }


    return (

        <ProductContext.Provider
            value={{
                productos,
                totalProductos:
                    productos.length,
                obtenerProducto,
                obtenerPorCategoria,
                crearProducto,
                actualizarProducto,
                eliminarProducto,
                restaurarProductos,
                verificarDisponibilidad,
                descontarStock
            }}
        >

            {children}

        </ProductContext.Provider>

    );

}


export default ProductProvider;