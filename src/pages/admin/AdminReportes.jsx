import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo";
import { leerCompras, colorEstado } from "../../services/compraService";
import { calcularEstadisticas } from "../../utils/estadisticas";

function formatearPrecio(valor) {
    return Number(valor).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}

/*
 * Tarjeta con un número destacado.
 */
function TarjetaEstadistica({ titulo, valor, detalle }) {
    return (
        <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
                <div className="text-secondary small">{titulo}</div>
                <div className="fs-3 fw-bold">{valor}</div>
                {detalle && <div className="text-secondary small">{detalle}</div>}
            </div>
        </div>
    );
}

function AdminReportes() {

    useTitulo("Reportes | Panel de administración");

    const estadisticas = calcularEstadisticas(leerCompras());

    const {
        cantidadOrdenes,
        totalVentas,
        unidadesVendidas,
        ticketPromedio,
        productoMasVendido,
        rankingProductos,
        comprasPorEstado
    } = estadisticas;

    return (

        <section className="py-5">

            <div className="container">

                <Link to="/admin" className="small text-secondary">
                    ← Volver al panel
                </Link>

                <h1 className="display-6 fw-bold mb-4">
                    Reportes
                </h1>

                {/* Tarjetas principales */}
                <div className="row g-4 mb-4">

                    <div className="col-12 col-sm-6 col-lg-3">
                        <TarjetaEstadistica
                            titulo="Ventas totales"
                            valor={formatearPrecio(totalVentas)}
                        />
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                        <TarjetaEstadistica
                            titulo="Órdenes"
                            valor={cantidadOrdenes}
                            detalle="sin contar canceladas"
                        />
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                        <TarjetaEstadistica
                            titulo="Ticket promedio"
                            valor={formatearPrecio(ticketPromedio)}
                            detalle="gasto promedio por compra"
                        />
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                        <TarjetaEstadistica
                            titulo="Producto más vendido"
                            valor={productoMasVendido ? productoMasVendido.nombre : "—"}
                            detalle={productoMasVendido ? `${productoMasVendido.unidades} unidades` : "sin ventas"}
                        />
                    </div>

                </div>

                <div className="row g-4">

                    {/* Ranking de productos */}
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">

                                <h2 className="h5 fw-bold mb-3">
                                    Ventas por producto
                                </h2>

                                {rankingProductos.length === 0 ? (
                                    <p className="text-secondary mb-0">Todavía no hay ventas.</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Producto</th>
                                                    <th className="text-center">Unidades</th>
                                                    <th className="text-end">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rankingProductos.map((producto, indice) => (
                                                    <tr key={producto.nombre}>
                                                        <td>{indice + 1}</td>
                                                        <td>{producto.nombre}</td>
                                                        <td className="text-center">{producto.unidades}</td>
                                                        <td className="text-end">{formatearPrecio(producto.total)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th colSpan="2">Total</th>
                                                    <th className="text-center">{unidadesVendidas}</th>
                                                    <th className="text-end">{formatearPrecio(totalVentas)}</th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Compras por estado */}
                    <div className="col-12 col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">

                                <h2 className="h5 fw-bold mb-3">
                                    Órdenes por estado
                                </h2>

                                {Object.keys(comprasPorEstado).length === 0 ? (
                                    <p className="text-secondary mb-0">Sin órdenes.</p>
                                ) : (
                                    <ul className="list-unstyled mb-0">
                                        {Object.entries(comprasPorEstado).map(([estado, cantidad]) => (
                                            <li key={estado} className="d-flex justify-content-between align-items-center mb-2">
                                                <span className={`badge ${colorEstado(estado)} text-capitalize`}>
                                                    {estado}
                                                </span>
                                                <span className="fw-bold">{cantidad}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </section>

    );

}

export default AdminReportes;