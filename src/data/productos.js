import {
    obtenerStockValido
} from "../utils/stock";

import {
    validarProducto
} from "../utils/validaciones";


export const productos = [

    {
        id: 1,
        nombre: "RC-30",
        categoria: "mochilas",
        precio: 45000,

        descripcion:
            "Mochila rolltop diseñada para uso urbano y viajes.",

        descripcionCompleta:
            "Mochila de 30 litros de capacidad, diseñada para un uso funcional y versátil. Incorpora bolsillos organizadores internos que optimizan el almacenamiento y una red frontal externa que permite ampliar la capacidad de carga. Ideal para actividades diarias, viajes cortos o uso outdoor.",

        imagen:
            "/img/Mochila RC-30/MOCHILA_MAIN.png",

        imagenes: [
            "/img/Mochila RC-30/MOCHILA_MAIN3.png",
            "/img/Mochila RC-30/MOCHILA_MAIN2.png",
            "/img/Mochila RC-30/MOCHILA_MAIN.png"
        ],

        imagenDetalle:
            "/img/Mochila RC-30/RC-30_BOTTOM.png",

        medidas: [
            "30 cm de ancho",
            "45 cm de alto",
            "15 cm de largo"
        ],

        rating: 4.8,

        opiniones: [
            {
                estrellas: 5,
                porcentaje: 90
            },
            {
                estrellas: 4,
                porcentaje: 10
            },
            {
                estrellas: 3,
                porcentaje: 0
            },
            {
                estrellas: 2,
                porcentaje: 0
            },
            {
                estrellas: 1,
                porcentaje: 0
            }
        ],

        stock: 10
    },

    {
        id: 2,
        nombre: "Cilindro",
        categoria: "cilindros",
        precio: 32000,

        descripcion:
            "Bolso cilíndrico para equipamiento de bikepacking.",

        descripcionCompleta:
            "Bolso de manillar compacto con diseño cilíndrico, pensado para un acceso rápido y eficiente durante el pedaleo. Fabricado en materiales de alta resistencia, incorpora un sistema de sujeción estable para el manubrio y un elástico frontal que permite adosar carga ligera extra. Ideal para llevar herramientas, cortavientos y esenciales en rutas urbanas o bikepacking.",

        imagen:
            "/img/CILINDRO/CILINDRO_MAIN.png",

        imagenes: [
            "/img/CILINDRO/CILINDRO_MAIN.png",
            "/img/CILINDRO/CILINDRO_MAIN2.png",
            "/img/CILINDRO/CILINDRO_MAIN3.png"
        ],

        imagenDetalle:
            "/img/CILINDRO/CILINDRO_BOTTOM.png",

        medidas: [
            "30 cm de ancho",
            "16 cm de diámetro"
        ],

        rating: 4.8,

        opiniones: [
            {
                estrellas: 5,
                porcentaje: 90
            },
            {
                estrellas: 4,
                porcentaje: 5
            },
            {
                estrellas: 3,
                porcentaje: 5
            },
            {
                estrellas: 2,
                porcentaje: 0
            },
            {
                estrellas: 1,
                porcentaje: 0
            }
        ],

        stock: 10
    },

    {
        id: 3,
        nombre: "Musette",
        categoria: "musette",
        precio: 18000,
        precioOferta: 14990,

        descripcion:
            "Bolso ligero inspirado en las clásicas musette de ciclismo.",

        descripcionCompleta:
            "Bolso cruzado de perfil bajo inspirado en el clásico musette de ciclismo, reestructurado para el uso urbano e interurbano. Confeccionado en textil de alta resistencia con cierre impermeable, incorpora un bolsillo frontal de malla para acceso rápido y una correa cruzada de tres puntos con hebilla táctica que evita el desplazamiento al pedalear. Ideal para transportar esenciales, herramientas o alimentos con total estabilidad.",

        imagen:
            "/img/Musette/Musette_main.png",

        imagenes: [
            "/img/Musette/Musette_main.png",
            "/img/Musette/Musette_main2.png",
            "/img/Musette/Musette_main3.jpeg"
        ],

        imagenDetalle:
            "/img/Musette/Musette_bottom.png",

        medidas: [
            "35 cm de ancho",
            "31 cm de alto"
        ],

        rating: 4.8,

        opiniones: [
            {
                estrellas: 5,
                porcentaje: 100
            },
            {
                estrellas: 4,
                porcentaje: 0
            },
            {
                estrellas: 3,
                porcentaje: 0
            },
            {
                estrellas: 2,
                porcentaje: 0
            },
            {
                estrellas: 1,
                porcentaje: 0
            }
        ],

        stock: 10
    },

    {
        id: 4,
        nombre: "Cilindro x Thomson",
        categoria: "cilindros",
        precio: 35000,
        descripcion:
            "Cilindro colaboración con Thomson.",
        descripcionCompleta:
            "Cilindro colaboración con Thomson.",
        imagen:
            "/img/FOTOS_EJEMPLOS_TEMP/cilindro_th.png"
    },

    {
        id: 5,
        nombre: "Cilindro Verde",
        categoria: "cilindros",
        precio: 32000,
        descripcion:
            "Cilindro verde customizado.",
        descripcionCompleta:
            "Cilindro verde customizado.",
        imagen:
            "/img/FOTOS_EJEMPLOS_TEMP/cilindro_vd.png"
    },

    {
        id: 6,
        nombre: "Hippouch porta U-Lock",
        categoria: "otros",
        precio: 40000,
        precioOferta: 34990,
        
        descripcion:
            "Hippouch porta U-Lock customizable de Rectabags.",
        descripcionCompleta:
            "Hippouch porta U-Lock customizable de Rectabags.",
        imagen:
            "/img/FOTOS_EJEMPLOS_TEMP/hippopunch.png"
    },

    {
        id: 7,
        nombre: "EVA-01",
        categoria: "otros",
        precio: 35000,
        descripcion:
            "EVA-01 customizado.",
        descripcionCompleta:
            "EVA-01 customizado.",
        imagen:
            "/img/FOTOS_EJEMPLOS_TEMP/vea01.png"
    },

    {
        id: 8,
        nombre: "RC-30 Verde",
        categoria: "mochilas",
        precio: 44000,
        descripcion:
            "RC-30 verde customizada.",
        descripcionCompleta:
            "RC-30 verde customizada.",
        imagen:
            "/img/FOTOS_EJEMPLOS_TEMP/mochi.png"
    },

    {
        id: 9,
        nombre: "RC-30 Rosa",
        categoria: "mochilas",
        precio: 44000,
        descripcion:
            "RC-30 rosa customizada.",
        descripcionCompleta:
            "RC-30 rosa customizada.",
        imagen:
            "/img/FOTOS_EJEMPLOS_TEMP/mochila_r.png"
    }

];

/*
 * ---------------------------------------------------------------
 * Operaciones CRUD sobre los productos
 * ---------------------------------------------------------------
 *
 * Estas funciones son puras: nunca modifican la lista que reciben,
 * siempre devuelven una lista nueva. Así el ProductProvider puede
 * usarlas con setProductos() sin efectos secundarios, y las pruebas
 * unitarias pueden ejecutarlas sin necesitar React ni localStorage.
 *
 * Todas devuelven el mismo formato de respuesta:
 * {
 *   ok:        true / false
 *   mensaje:   texto para mostrar al usuario
 *   productos: la lista resultante
 *   producto:  el producto creado o actualizado (cuando corresponde)
 * }
 */


function normalizarLista(
    lista
) {

    return Array.isArray(lista)
        ? lista
        : [];

}


function normalizarTexto(
    texto
) {

    return String(
        texto || ""
    ).trim();

}


/*
 * Calcula el id que le corresponde al próximo producto:
 * el mayor id existente + 1. Con la lista vacía parte en 1.
 */
export function siguienteId(
    lista
) {

    const productosActuales =
        normalizarLista(lista);


    if (
        productosActuales.length === 0
    ) {

        return 1;

    }


    const idMayor =
        productosActuales.reduce(
            (mayor, producto) =>
                Math.max(
                    mayor,
                    Number(producto.id) || 0
                ),
            0
        );


    return idMayor + 1;

}


/*
 * READ - Busca un producto por su id.
 * El id puede llegar como texto desde la URL ("3"), por eso Number().
 */
export function obtenerProductoPorId(
    lista,
    id
) {

    return (
        normalizarLista(lista).find(
            (producto) =>
                producto.id === Number(id)
        ) || null
    );

}


/*
 * READ - Filtra los productos por categoría.
 * La categoría "todos" devuelve la lista completa.
 */
export function obtenerProductosPorCategoria(
    lista,
    categoria
) {

    const productosActuales =
        normalizarLista(lista);


    const valor =
        normalizarTexto(
            categoria
        ).toLowerCase();


    if (
        !valor ||
        valor === "todos"
    ) {

        return productosActuales;

    }


    return productosActuales.filter(
        (producto) =>
            String(
                producto.categoria || ""
            ).toLowerCase() === valor
    );

}


/*
 * Revisa si el nombre ya lo usa otro producto.
 * idActual permite excluirse a sí mismo al editar.
 */
function nombreRepetido(
    lista,
    nombre,
    idActual
) {

    const valor =
        normalizarTexto(
            nombre
        ).toLowerCase();


    return normalizarLista(lista).some(
        (producto) =>
            producto.id !== Number(idActual) &&
            normalizarTexto(
                producto.nombre
            ).toLowerCase() === valor
    );

}

export const STOCK_CRITICO_POR_DEFECTO = 3;

/*
 * Convierte el precio de oferta del formulario.
 * Vacío, 0 o inválido significa "sin oferta" (null).
 */
function normalizarPrecioOferta(valor) {

    const numero = Number(valor);

    return Number.isFinite(numero) && numero > 0
        ? numero
        : null;

}

/*
 * Convierte el stock crítico del formulario.
 * Si viene vacío se usa el valor por defecto.
 */
function normalizarStockCritico(valor) {

    if (valor === undefined || valor === null || valor === "") {
        return STOCK_CRITICO_POR_DEFECTO;
    }

    const numero = Math.trunc(Number(valor));

    return Number.isFinite(numero) && numero >= 0
        ? numero
        : STOCK_CRITICO_POR_DEFECTO;

}

/*
 * Deja los datos del formulario en el formato que usa la tienda.
 */
function armarProducto(
    datos,
    base
) {

    const original =
        base || {};

    const descripcion =
        normalizarTexto(
            datos.descripcion
        );


    return {

        ...original,

        nombre:
            normalizarTexto(
                datos.nombre
            ),

        categoria:
            normalizarTexto(
                datos.categoria
            ).toLowerCase(),

        precio:
            Number(datos.precio),

        descripcion,

        descripcionCompleta:
            normalizarTexto(
                datos.descripcionCompleta
            ) || descripcion,

        imagen:
            normalizarTexto(
                datos.imagen
            ) ||
            original.imagen ||
            "/img/FOTOS_EJEMPLOS_TEMP/mochi.png",

        stock:
            obtenerStockValido(
                datos.stock
            ),
            
        precioOferta:
            normalizarPrecioOferta(
                datos.precioOferta
            ),

        stockCritico:
            normalizarStockCritico(
                datos.stockCritico
            )


    };

}


/*
 * CREATE - Agrega un producto nuevo al final de la lista.
 */
export function crearProducto(
    lista,
    datos
) {

    const productosActuales =
        normalizarLista(lista);


    const error =
        validarProducto(datos);


    if (error) {

        return {
            ok: false,
            mensaje: error,
            productos: productosActuales
        };

    }


    if (
        nombreRepetido(
            productosActuales,
            datos.nombre,
            null
        )
    ) {

        return {
            ok: false,
            mensaje:
                "Ya existe un producto con ese nombre.",
            productos: productosActuales
        };

    }


    const nuevoProducto =
        armarProducto(
            datos,
            {
                id:
                    siguienteId(
                        productosActuales
                    )
            }
        );


    return {
        ok: true,
        mensaje:
            "Producto creado correctamente.",
        producto: nuevoProducto,
        productos: [
            ...productosActuales,
            nuevoProducto
        ]
    };

}


/*
 * UPDATE - Reemplaza los datos de un producto existente.
 * Los campos que no vengan en "cambios" se mantienen.
 */
export function actualizarProducto(
    lista,
    id,
    cambios
) {

    const productosActuales =
        normalizarLista(lista);


    const productoExistente =
        obtenerProductoPorId(
            productosActuales,
            id
        );


    if (!productoExistente) {

        return {
            ok: false,
            mensaje:
                "No se encontró el producto que intentas editar.",
            productos: productosActuales
        };

    }


    const datosCombinados = {
        ...productoExistente,
        ...(cambios || {})
    };


    const error =
        validarProducto(
            datosCombinados
        );


    if (error) {

        return {
            ok: false,
            mensaje: error,
            productos: productosActuales
        };

    }


    if (
        nombreRepetido(
            productosActuales,
            datosCombinados.nombre,
            productoExistente.id
        )
    ) {

        return {
            ok: false,
            mensaje:
                "Ya existe otro producto con ese nombre.",
            productos: productosActuales
        };

    }


    const productoActualizado =
        armarProducto(
            datosCombinados,
            productoExistente
        );


    return {
        ok: true,
        mensaje:
            "Producto actualizado correctamente.",
        producto: productoActualizado,
        productos:
            productosActuales.map(
                (producto) =>
                    producto.id ===
                        productoExistente.id
                        ? productoActualizado
                        : producto
            )
    };

}


/*
 * DELETE - Quita un producto de la lista.
 */
export function eliminarProducto(
    lista,
    id
) {

    const productosActuales =
        normalizarLista(lista);


    const productoExistente =
        obtenerProductoPorId(
            productosActuales,
            id
        );


    if (!productoExistente) {

        return {
            ok: false,
            mensaje:
                "No se encontró el producto que intentas eliminar.",
            productos: productosActuales
        };

    }


    return {
        ok: true,
        mensaje:
            "Producto eliminado correctamente.",
        producto: productoExistente,
        productos:
            productosActuales.filter(
                (producto) =>
                    producto.id !==
                    productoExistente.id
            )
    };

}