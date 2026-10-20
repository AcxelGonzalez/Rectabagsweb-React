const CLAVE_COMPRAS =
    "recta_compras";

const CLAVE_ULTIMA_COMPRA =
    "recta_ultima_compra";


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


    localStorage.setItem(
        CLAVE_ULTIMA_COMPRA,
        JSON.stringify(compra)
    );


    return compra;

}


export function leerUltimaCompra() {

    try {

        const compra =
            JSON.parse(
                localStorage.getItem(
                    CLAVE_ULTIMA_COMPRA
                )
            );


        return compra &&
            typeof compra === "object"
            ? compra
            : null;

    } catch {

        return null;

    }

}