import {
    useEffect,
    useState
} from "react";

import ProductContext
    from "./ProductContext";

import {
    productos as productosIniciales
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

        return (
            productos.find(
                (producto) =>
                    producto.id === Number(id)
            ) || null
        );

    }


    return (

        <ProductContext.Provider
            value={{
                productos,
                obtenerProducto
            }}
        >

            {children}

        </ProductContext.Provider>

    );

}


export default ProductProvider;