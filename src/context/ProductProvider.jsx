import {
    useCallback,
    useEffect,
    useState
} from "react";

import ProductContext from "./ProductContext";

import api from "../services/api";

import { obtenerStockValido } from "../utils/stock";

import { verificarStock } from "../utils/carrito";

import {
    productos as datosExtra,
    obtenerProductoPorId,
    obtenerProductosPorCategoria
} from "../data/productos";


/*
 * Convierte un producto del backend al formato que usa la tienda.
 * Los datos visuales que no están en la base de datos (galería,
 * medidas, opiniones, descripción completa) se toman de data/productos.js.
 */
function normalizarProducto(p) {

    const extra =
        datosExtra.find((e) => e.nombre === p.nombre) || {};

    return {
        // Extras visuales (solo frontend)
        imagenes: extra.imagenes,
        imagenDetalle: extra.imagenDetalle,
        medidas: extra.medidas,
        rating: extra.rating,
        opiniones: extra.opiniones,

        // Datos del backend
        id: p.idProducto,
        codigo: p.codigo,
        nombre: p.nombre,
        categoria: p.categoria?.nombre?.toLowerCase() ?? "",
        idCategoria: p.categoria?.idCategoria ?? null,
        precio: Number(p.precio),
        precioOferta: p.precioOferta != null ? Number(p.precioOferta) : null,
        stock: p.stock,
        stockCritico: p.stockCritico,
        descripcion: p.descripcion ?? "",
        descripcionCompleta: extra.descripcionCompleta || p.descripcion || "",
        imagen: p.imagen || "/img/FOTOS_EJEMPLOS_TEMP/mochi.png"
    };

}


/*
 * Convierte los datos del formulario al formato que espera el backend.
 * Los campos opcionales vacíos se envían como null.
 */
function aRequest(datos) {

    const numeroOpcional = (valor) =>
        valor === "" || valor === null || valor === undefined
            ? null
            : Number(valor);

    return {
        codigo: String(datos.codigo || "").trim(),
        nombre: String(datos.nombre || "").trim(),
        descripcion: String(datos.descripcion || "").trim() || null,
        precio: Number(datos.precio),
        precioOferta: numeroOpcional(datos.precioOferta),
        stock: Number(datos.stock),
        stockCritico: numeroOpcional(datos.stockCritico),
        imagen: String(datos.imagen || "").trim() || null,
        idCategoria: Number(datos.idCategoria)
    };

}


/*
 * Saca el mensaje de error que manda el backend ({ mensaje: "..." }).
 * Si el backend está apagado, no hay respuesta.
 */
function mensajeDeError(error) {

    return (
        error.response?.data?.mensaje ||
        "No se pudo conectar con el servidor. Revisa que el backend esté encendido."
    );

}


function ProductProvider({ children }) {

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState(null);


    /*
     * Pide los productos y las categorías al backend.
     */
    const cargarProductos = useCallback(() => {
        return api.get("/productos").then(({ data }) => {
            setProductos(data.map(normalizarProducto));
            setErrorCarga(null);
        }).catch(error => {
            setErrorCarga(mensajeDeError(error));
        }).finally(() => {
            setCargando(false);
        });

    }, []);


    const cargarCategorias = useCallback(() => {
        return api.get("/categorias").then(({ data }) => {
            setCategorias(data);
        }).catch(() => {
            setCategorias([]);
        });
    }, []);


    // Al abrir la página, carga todo desde el backend
    useEffect(() => {
        cargarProductos();
        cargarCategorias();
    }, [cargarProductos, cargarCategorias]);


    /*
     * Lectura (igual que antes, sobre la lista ya cargada)
     */
    function obtenerProducto(id) {
        return obtenerProductoPorId(productos, id);
    }

    function obtenerPorCategoria(categoria) {
        return obtenerProductosPorCategoria(productos, categoria);
    }


    /*
     * ---------------------------------------------------------------
     * Operaciones del panel de administración (ahora con el backend)
     * ---------------------------------------------------------------
     * Devuelven { ok, mensaje, producto } igual que antes,
     * pero son async: hay que usarlas con await.
     */

    async function crearProducto(datos) {

        try {
            const { data } = await api.post("/productos", aRequest(datos));
            await cargarProductos();
            return {
                ok: true,
                mensaje: "Producto creado correctamente.",
                producto: normalizarProducto(data)
            };
        } catch (error) {
            return { ok: false, mensaje: mensajeDeError(error), producto: null };
        }

    }


    async function actualizarProducto(id, cambios) {

        try {
            const { data } = await api.put(`/productos/${id}`, aRequest(cambios));
            await cargarProductos();
            return {
                ok: true,
                mensaje: "Producto actualizado correctamente.",
                producto: normalizarProducto(data)
            };
        } catch (error) {
            return { ok: false, mensaje: mensajeDeError(error), producto: null };
        }

    }


    async function eliminarProducto(id) {

        try {
            await api.delete(`/productos/${id}`);
            await cargarProductos();
            return { ok: true, mensaje: "Producto eliminado correctamente.", producto: null };
        } catch (error) {
            return { ok: false, mensaje: mensajeDeError(error), producto: null };
        }

    }


    /*
     * Antes volvía al catálogo de productos.js.
     * Ahora recarga los datos reales desde el backend.
     */
    async function restaurarProductos() {

        await cargarProductos();

        return {
            ok: true,
            mensaje: "Catálogo recargado desde el servidor.",
            producto: null
        };

    }

    /*
     * ---------------------------------------------------------------
     * Categorías (mantenedor del admin)
     * ---------------------------------------------------------------
     */

    async function crearCategoria(datos) {

        try {
            await api.post("/categorias", {
                nombre: String(datos.nombre || "").trim(),
                descripcion: String(datos.descripcion || "").trim() || null
            });
            await cargarCategorias();
            return { ok: true, mensaje: "Categoría creada correctamente." };
        } catch (error) {
            return { ok: false, mensaje: mensajeDeError(error) };
        }

    }


    async function actualizarCategoria(id, datos) {

        try {
            await api.put(`/categorias/${id}`, {
                nombre: String(datos.nombre || "").trim(),
                descripcion: String(datos.descripcion || "").trim() || null
            });
            await cargarCategorias();
            await cargarProductos(); // los productos muestran el nombre de su categoría
            return { ok: true, mensaje: "Categoría actualizada correctamente." };
        } catch (error) {
            return { ok: false, mensaje: mensajeDeError(error) };
        }

    }


    async function eliminarCategoria(id) {

        try {
            await api.delete(`/categorias/${id}`);
            await cargarCategorias();
            return { ok: true, mensaje: "Categoría eliminada correctamente." };
        } catch (error) {
            return { ok: false, mensaje: mensajeDeError(error) };
        }

    }

    /*
     * ---------------------------------------------------------------
     * Stock (checkout) – SIN CAMBIOS
     * ---------------------------------------------------------------
     * Lo reemplaza la Parte 3 cuando el backend descuente el stock.
     */

    function verificarDisponibilidad(items) {
        return verificarStock(items, productos);
    }


    function reponerStock(items) {

        setProductos((actuales) =>
            actuales.map((producto) => {

                const item = items.find((i) => i.id === producto.id);

                if (!item) {
                    return producto;
                }

                const stockActual = obtenerStockValido(producto.stock);
                const cantidad = Math.max(0, Math.trunc(Number(item.cantidad) || 0));

                return { ...producto, stock: stockActual + cantidad };

            })
        );

        return { ok: true, mensaje: "Stock repuesto correctamente." };

    }


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


    return (

        <ProductContext.Provider
            value={{
                productos,
                totalProductos: productos.length,
                categorias,
                cargando,
                errorCarga,
                cargarProductos,
                cargarCategorias,
                crearCategoria,        
                actualizarCategoria,  
                eliminarCategoria,       
                obtenerProducto,
                obtenerPorCategoria,
                crearProducto,
                actualizarProducto,
                eliminarProducto,
                restaurarProductos,
                verificarDisponibilidad,
                descontarStock,
                reponerStock
            }}
        >

            {children}

        </ProductContext.Provider>

    );

}


export default ProductProvider;
