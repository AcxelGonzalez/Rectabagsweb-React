import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo";
import { leerCompras, colorEstado } from "../../services/compraService";

function formatearPrecio(valor) {
    return Number(valor).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}

function AdminOrdenes() {

    useTitulo("Órdenes | Panel de administración");

    // Las más recientes primero
        const compras = leerCompras()
        .filter((compra) => !compra.archivada)
        .reverse();

    return (

        <section className="py-5">

            <div className="container">

                <Link to="/admin" className="small text-secondary">
                    ← Volver al panel
                </Link>

                <h1 className="display-6 fw-bold mb-4">
                    Órdenes
                </h1>

                {compras.length === 0 ? (

                    <div className="alert alert-light border">
                        Todavía no hay compras registradas.
                    </div>

                ) : (

                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="table-responsive">

                            <table className="table align-middle mb-0">

                                <thead className="table-light">
                                    <tr>
                                        <th>N° orden</th>
                                        <th>Fecha</th>
                                        <th>Cliente</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {compras.map((compra) => (

                                        <tr key={compra.id}>

                                            <td className="fw-semibold">{compra.id}</td>

                                            <td>{new Date(compra.fecha).toLocaleString("es-CL")}</td>

                                            <td>
                                                {compra.cliente.nombre} {compra.cliente.apellido}
                                                <div className="small text-secondary">
                                                    {compra.cliente.correo}
                                                </div>
                                            </td>

                                            <td>{formatearPrecio(compra.subtotal)}</td>

                                            <td>
                                                <span className={`badge ${colorEstado(compra.estado)} text-capitalize`}>
                                                    {compra.estado}
                                                </span>
                                            </td>

                                            <td className="text-end">
                                                <Link
                                                    to={`/admin/ordenes/${compra.id}`}
                                                    className="btn btn-sm btn-outline-dark"
                                                >
                                                    Ver boleta
                                                </Link>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    </div>

                )}

            </div>

        </section>

    );

}

export default AdminOrdenes;