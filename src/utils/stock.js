export const STOCK_POR_DEFECTO = 10;


export function obtenerStockValido(
    stock,
    porDefecto = STOCK_POR_DEFECTO
) {

    if (
        stock === undefined ||
        stock === null ||
        stock === ""
    ) {

        return porDefecto;

    }


    const stockNumerico =
        Number(stock);


    if (
        !Number.isFinite(
            stockNumerico
        )
    ) {

        return porDefecto;

    }


    return Math.max(
        0,
        Math.trunc(stockNumerico)
    );

}