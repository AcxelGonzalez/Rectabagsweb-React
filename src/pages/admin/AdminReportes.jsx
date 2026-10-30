import { useState } from "react";
import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo";
import {
    leerCompras,
    colorEstado,
    archivarCompras,
    esCompraArchivable
} from "../../services/compraService";
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

    // Las compras se guardan en el estado para poder
    // actualizar la página después de cerrar el periodo
    const [compras, setCompras] = useState(leerCompras);

    const [confirmandoCierre, setConfirmandoCierre] = useState(false);

    const [mensaje, setMensaje] = useState(null);

    const {
        cantidadOrdenes,
        totalVentas,
        unidadesVendidas,
        ticketPromedio,
        productoMasVendido,
        rankingProductos,
        comprasPorEstado
    } = calcularEstadisticas(compras);

    const cantidadArchivables =
        compras.filter(
            esCompraArchivable
        ).length;

    function descargarPdf() {
        window.print();
    }


    function cerrarPeriodo() {

        const cantidad = archivarCompras();

        setCompras(leerCompras());
        setConfirmandoCierre(false);

        setMensaje(
            `Periodo cerrado: se archivaron ${cantidad} órdenes finalizadas. Las órdenes en proceso permanecen activas.`
        );

    }


    return (

        <section className="py-5">

            <div className="container">

                <Link to="/admin" className="small text-secondary d-print-none">
                    ← Volver al panel
                </Link>

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

                    <div>
                        <h1 className="display-6 fw-bold mb-0">
                            Reportes
                        </h1>
                        {/* Solo aparece en el PDF */}
                        <div className="d-none d-print-block text-secondary">
                            Rectabags · Reporte generado el {new Date().toLocaleString("es-CL")}
                        </div>
                    </div>

                    <div className="d-flex gap-2 d-print-none">
                        <button
                            type="button"
                            className="btn btn-outline-dark"
                            onClick={descargarPdf}
                        >
                            Descargar PDF
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={
                                () =>
                                    setConfirmandoCierre(
                                        true
                                    )
                            }
                            disabled={
                                cantidadArchivables ===
                                0
                            }
                        >
                            Cerrar periodo
                        </button>
                    </div>

                </div>

                {mensaje && (
                    <div className="alert alert-success d-print-none" role="alert">
                        {mensaje}
                    </div>
                )}

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


            {/* Confirmación del cierre */}
            {confirmandoCierre && (
                <>
                    <div className="modal d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h2 className="modal-title h5">Cerrar periodo</h2>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Cerrar"
                                        onClick={() => setConfirmandoCierre(false)}
                                    />
                                </div>

                                <div className="modal-body">
                                    <p>
                                        Solo se archivarán las órdenes
                                        <strong> entregadas o canceladas</strong>.
                                        Estas dejarán de aparecer entre las órdenes
                                        activas y en las estadísticas del período,
                                        pero los clientes seguirán viéndolas en su historial.
                                    </p>

                                    <p>
                                        Las órdenes
                                        <strong> confirmadas, en preparación o enviadas</strong>
                                        permanecerán activas para continuar su procesamiento.
                                    </p>
                                    
                                    <p className="mb-0">
                                        Te recomendamos <strong>descargar el PDF</strong> antes de cerrar.
                                    </p>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setConfirmandoCierre(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={cerrarPeriodo}
                                    >
                                        Cerrar periodo
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="modal-backdrop show" />
                </>
            )}

        </section>

    );

}

export default AdminReportes;