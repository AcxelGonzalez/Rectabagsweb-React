import api from "./api";

const CLAVE_COMPRAS =
    "recta_compras";


export function leerCompras() {

    try {

        const compras =
            JSON.parse(
                localStorage.getItem(
                    CLAVE_COMPRAS
                )
            );


        return Array.isArray(compras)
            ? compras
            : [];

    } catch {

        return [];

    }

}


export async function guardarCompra(datosCompra) {
    const { data } = await api.post("/boletas", datosCompra);
    return data;
}

// Adapta el DTO de la API a las vistas de boletas e historiales existentes.
function aCompra(boleta) {
    return {
        id: boleta.idBoleta,
        folio: boleta.folio,
        usuarioId: boleta.idUsuario,
        fecha: boleta.fechaEmision,
        estado: boleta.estado,
        archivada: Boolean(boleta.fechaCierre),
        fechaCierre: boleta.fechaCierre,
        metodoPago: boleta.metodoPago,
        subtotal: Number(boleta.total),
        cliente: {
            nombre: boleta.nombreCliente, apellido: boleta.apellidoCliente,
            correo: boleta.correoCliente, telefono: boleta.telefonoCliente,
            direccion: boleta.direccionCliente, region: boleta.region, comuna: boleta.comuna
        },
        cantidadProductos: boleta.detalles.reduce((total, detalle) => total + detalle.cantidad, 0),
        productos: boleta.detalles.map(detalle => ({
            id: detalle.idProducto, nombre: detalle.nombreProducto,
            precio: Number(detalle.precioUnidad), cantidad: detalle.cantidad,
            subTotal: Number(detalle.subTotal)
        }))
    };
}

export async function listarOrdenes() {
    const { data } = await api.get("/boletas");
    return data.map(aCompra);
}

export async function obtenerBoleta(id) {
    const { data } = await api.get(`/boletas/${id}`);
    return aCompra(data);
}

export async function leerMisCompras() {
    const { data } = await api.get("/boletas/mias");
    return data.map(aCompra);
}

export async function leerHistorialUsuario(id) {
    const { data } = await api.get(`/boletas/usuario/${id}`);
    return data.map(aCompra);
}


export function leerCompraPorId(
    compraId
) {

    if (!compraId) {

        return null;

    }


    const compras =
        leerCompras();


    return (
        compras.find(
            (compra) =>
                compra.id ===
                compraId
        ) || null
    );

}


/*
Estados posibles de una compra, en orden.
*/
export const ESTADOS_COMPRA = [
    "confirmada",
    "en preparación",
    "enviada",
    "entregada",
    "cancelada"
];

/*
 * Define las transiciones válidas entre estados.

evitamos saltos errones entre estados:
confirmada → entregada
entregada → cancelada
cancelada → enviada
*/
const TRANSICIONES_COMPRA = {

    "confirmada": [
        "en preparación",
        "cancelada"
    ],

    "en preparación": [
        "enviada",
        "cancelada"
    ],

    "enviada": [
        "entregada"
    ],

    "entregada": [],

    "cancelada": [
        "confirmada"
    ]

};

/*
 * Devuelve los estados a los que una compra
 * puede avanzar desde su estado actual.
 */
export function obtenerEstadosPermitidos(
    estadoActual
) {

    const estados =
        TRANSICIONES_COMPRA[
            estadoActual
        ];


    return Array.isArray(estados)
        ? [...estados]
        : [];

}

/*
 * Una orden solamente puede archivarse cuando su ciclo ya terminó.
 * Las órdenes todavía en proceso deben permanecer activas
 * para que puedan continuar avanzando de estado.
 */
export function esCompraArchivable(
    compra
) {

    if (
        !compra ||
        compra.archivada
    ) {

        return false;

    }


    return [
        "entregada",
        "cancelada"
    ].includes(
        compra.estado
    );

}

/*
 * Color de Bootstrap para mostrar cada estado.
 */
export function colorEstado(estado) {

    const colores = {
        "PENDIENTE": "bg-secondary",
        "PAGADA": "bg-warning text-dark",
        "ENVIADA": "bg-info text-dark",
        "ENTREGADA": "bg-success",
        "CANCELADA": "bg-danger",
        "confirmada": "bg-secondary",
        "en preparación": "bg-warning text-dark",
        "enviada": "bg-info text-dark",
        "entregada": "bg-success",
        "cancelada": "bg-danger"
    };

    return colores[estado] || "bg-secondary";

}

/*
 * Cambia el estado de una compra y la guarda.
 * Devuelve la compra actualizada, o null si no existe.
 */
export function actualizarEstadoCompra(
    compraId,
    nuevoEstado
) {

    if (
        !ESTADOS_COMPRA.includes(
            nuevoEstado
        )
    ) {

        return null;

    }


    const compras =
        leerCompras();


    const compraExistente =
        compras.find(
            (compra) =>
                compra.id ===
                compraId
        );


    if (!compraExistente) {

        return null;

    }


    /*
     * Una compra perteneciente a un período cerrado
     * queda protegida contra modificaciones.
     */
    if (
        compraExistente.archivada
    ) {

        return null;

    }


    const estadosPermitidos =
        obtenerEstadosPermitidos(
            compraExistente.estado
        );


    /*
     * Rechazamos cualquier salto de estado
     * que no pertenezca al flujo permitido.
     */
    if (
        !estadosPermitidos.includes(
            nuevoEstado
        )
    ) {

        return null;

    }


    const compraActualizada = {

        ...compraExistente,

        estado:
            nuevoEstado

    };


    const comprasActualizadas =
        compras.map(
            (compra) =>
                compra.id ===
                compraId
                    ? compraActualizada
                    : compra
        );


    localStorage.setItem(
        CLAVE_COMPRAS,
        JSON.stringify(
            comprasActualizadas
        )
    );


    return compraActualizada;

}

/*
 * Cierre de ciclo
 
 * Solo archiva órdenes cuyo ciclo ya terminó:
 - entregadas
 - canceladas

 * Las órdenes todavía activas permanecen disponibles
 * para continuar su procesamiento.

 * Las compras no se eliminan: el cliente tiene acceso a su historial.
 */
export function archivarCompras() {

    const fechaCierre =
        new Date()
            .toISOString();


    let cantidad =
        0;


    const compras =
        leerCompras()
            .map(
                (compra) => {

                    if (
                        !esCompraArchivable(
                            compra
                        )
                    ) {

                        return compra;

                    }


                    cantidad++;


                    return {

                        ...compra,

                        archivada:
                            true,

                        fechaCierre

                    };

                }
            );


    localStorage.setItem(
        CLAVE_COMPRAS,
        JSON.stringify(
            compras
        )
    );

    return cantidad;

}
