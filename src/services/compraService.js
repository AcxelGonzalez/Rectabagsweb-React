const CLAVE_COMPRAS =
    "recta_compras";


function leerCompras() {

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
            `RB-${Date.now()}`,

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