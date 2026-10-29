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


export function guardarCompra(
    datosCompra
) {

    const compra = {

        id:
            `RB-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,

        fecha:
            new Date().toISOString(),

        ...datosCompra

    };


    const compras =
        leerCompras();


    localStorage.setItem(
        CLAVE_COMPRAS,
        JSON.stringify([
            ...compras,
            compra
        ])
    );


    return compra;

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
 * Estados posibles de una compra, en orden.
 */
export const ESTADOS_COMPRA = [
    "confirmada",
    "en preparación",
    "enviada",
    "entregada",
    "cancelada"
];


/*
 * Color de Bootstrap para mostrar cada estado.
 */
export function colorEstado(estado) {

    const colores = {
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
export function actualizarEstadoCompra(compraId, nuevoEstado) {

    if (!ESTADOS_COMPRA.includes(nuevoEstado)) {
        return null;
    }

    let compraActualizada = null;

    const compras = leerCompras().map((compra) => {

        if (compra.id !== compraId) {
            return compra;
        }

        compraActualizada = { ...compra, estado: nuevoEstado };

        return compraActualizada;

    });

    if (!compraActualizada) {
        return null;
    }

    localStorage.setItem(
        CLAVE_COMPRAS,
        JSON.stringify(compras)
    );

    return compraActualizada;

}

/*
 * Cierre de periodo: marca como archivadas todas las compras
 * que aún no lo están. No se borran: el cliente las sigue viendo.
 * Devuelve cuántas compras se archivaron.
 */
export function archivarCompras() {

    const fechaCierre = new Date().toISOString();

    let cantidad = 0;

    const compras = leerCompras().map((compra) => {

        if (compra.archivada) {
            return compra;
        }

        cantidad++;

        return { ...compra, archivada: true, fechaCierre };

    });

    localStorage.setItem(
        CLAVE_COMPRAS,
        JSON.stringify(compras)
    );

    return cantidad;

}