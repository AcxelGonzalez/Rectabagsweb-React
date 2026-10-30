/*
 * Compras que cuentan para las estadísticas:
 * no archivadas (paso 8c) y no canceladas.
 */
export function comprasDelPeriodo(
    compras
) {

    const lista =
        Array.isArray(compras)
            ? compras
            : [];


    return lista.filter(
        (compra) =>
            compra &&
            !compra.archivada &&
            compra.estado !==
                "cancelada"
    );

}

/*
 * Calcula el total histórico efectivamente gastado.
 *
 * Las compras canceladas no representan dinero gastado.
 * Las compras archivadas sí se consideran, ya que archivar
 * solo las excluye del período administrativo actual.
 */
export function calcularTotalGastado(
    compras
) {

    const lista =
        Array.isArray(compras)
            ? compras
            : [];


    return lista
        .filter(
            (compra) =>
                compra &&
                compra.estado !==
                    "cancelada"
        )
        .reduce(
            (suma, compra) =>
                suma +
                Number(
                    compra.subtotal ||
                    0
                ),
            0
        );

}

/*
 * Calcula las estadísticas del negocio a partir de las compras.
 */
export function calcularEstadisticas(compras) {

    const validas = comprasDelPeriodo(compras);

    // Suma de todas las ventas
    const totalVentas = validas.reduce(
        (suma, compra) => suma + Number(compra.subtotal || 0),
        0
    );

    // Cantidad de productos vendidos
    const unidadesVendidas = validas.reduce(
        (suma, compra) => suma + Number(compra.cantidadProductos || 0),
        0
    );

    // Gasto promedio por compra
    const ticketPromedio = validas.length > 0
        ? Math.round(totalVentas / validas.length)
        : 0;

    // Agrupa las ventas por producto
    const ventasPorProducto = {};

    validas.forEach(
        (compra) => {

            const productos =
                Array.isArray(
                    compra.productos
                )
                    ? compra.productos
                    : [];


            productos.forEach(
                (producto) => {

                    if (
                        !producto ||
                        producto.id ===
                            undefined ||
                        producto.id ===
                            null
                    ) {

                        return;

                    }


                    const cantidad =
                        Number(
                            producto.cantidad ||
                            0
                        );


                    const precio =
                        Number(
                            producto.precio ||
                            0
                        );


                    if (
                        !ventasPorProducto[
                            producto.id
                        ]
                    ) {

                        ventasPorProducto[
                            producto.id
                        ] = {

                            nombre:
                                producto.nombre ||
                                "Producto",

                            unidades:
                                0,

                            total:
                                0

                        };

                    }


                    ventasPorProducto[
                        producto.id
                    ].unidades +=
                        cantidad;


                    ventasPorProducto[
                        producto.id
                    ].total +=
                        precio *
                        cantidad;

                }
            );

        }
    );

    // De más vendido a menos vendido
    const rankingProductos = Object.values(ventasPorProducto)
        .sort((a, b) => b.unidades - a.unidades);

    // Cuántas compras hay en cada estado (incluye canceladas)
    const comprasPorEstado = {};

    const listaCompras =
        Array.isArray(compras)
            ? compras
            : [];


    listaCompras
        .filter(
            (compra) =>
                compra &&
                !compra.archivada &&
                compra.estado
        )
        .forEach(
            (compra) => {

                comprasPorEstado[
                    compra.estado
                ] =
                    (
                        comprasPorEstado[
                            compra.estado
                        ] ||
                        0
                    ) +
                    1;

            }
        );

    return {
        cantidadOrdenes: validas.length,
        totalVentas,
        unidadesVendidas,
        ticketPromedio,
        productoMasVendido: rankingProductos[0] || null,
        rankingProductos,
        comprasPorEstado
    };

}