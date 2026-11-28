import api from "./api";

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

export async function cambiarEstadoBoleta(id, estado) {
    const { data } = await api.patch(`/boletas/${id}/estado`, { estado });
    return aCompra(data);
}

export async function obtenerResumen() {
    const { data } = await api.get("/reportes/resumen");
    return data;
}

export async function cerrarPeriodo() {
    const { data } = await api.post("/reportes/cierre");
    return data.cantidadCerradas;
}

// Color de Bootstrap para los estados actuales de la API.
export function colorEstado(estado) {
    const colores = {
        PENDIENTE: "bg-secondary",
        PAGADA: "bg-warning text-dark",
        ENVIADA: "bg-info text-dark",
        ENTREGADA: "bg-success",
        CANCELADA: "bg-danger"
    };

    return colores[estado] || "bg-secondary";
}
