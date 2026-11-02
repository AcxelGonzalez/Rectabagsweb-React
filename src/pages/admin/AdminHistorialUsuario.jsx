import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitulo from "../../hooks/useTitulo";
import { leerCompras } from "../../services/compraService";
import { calcularTotalGastado } from "../../utils/estadisticas";

function formatearPrecio(valor) {
    return Number(valor).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}

function AdminHistorialUsuario() {

    useTitulo("Historial de compras | Panel de administración");

    const { id } = useParams();
    const { usuarios } = useAuth();

    const usuario = usuarios.find((item) => item.id === id);

    // Solo las compras de este usuario, las más recientes primero
    const compras = leerCompras()
        .filter((compra) => compra.usuarioId === id)
        .reverse();

    const totalGastado =
        calcularTotalGastado(
            compras
        );

    if (!usuario) {
        return (
            <section className="py-5">
                <div className="container">
                    <h1 className="h3 fw-bold mb-3">Usuario no encontrado</h1>
                    <Link to="/admin/usuarios" className="btn btn-dark">
                        Volver a usuarios
                    </Link>
                </div>
            </section>
        );
    }

    return (

        <section className="py-5">

            <div className="container">

                <Link to="/admin/usuarios" className="small text-secondary">
                    ← Volver a usuarios
                </Link>

                <h1 className="display-6 fw-bold mb-1">
                    Historial de {usuario.nombre} {usuario.apellido}
                </h1>

                <p className="text-secondary mb-4">
                    {compras.length} {compras.length === 1 ? "compra" : "compras"} ·
                    Total gastado: {formatearPrecio(totalGastado)}
                </p>

                {compras.length === 0 ? (

                    <div className="alert alert-light border">
                        Este usuario todavía no ha realizado compras.
                    </div>

                ) : (

                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="table-responsive">

                            <table className="table align-middle mb-0">

                                <thead className="table-light">
                                    <tr>
                                        <th>N° orden</th>
                                        <th>Fecha</th>
                                        <th>Productos</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th className="text-end">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {compras.map((compra) => (

                                        <tr key={compra.id}>

                                            <td className="fw-semibold">{compra.id}</td>

                                            <td>{new Date(compra.fecha).toLocaleString("es-CL")}</td>

                                            <td>{compra.cantidadProductos}</td>

                                            <td>{formatearPrecio(compra.subtotal)}</td>

                                            <td>
                                                <span
                                                    className={
                                                        compra.estado ===
                                                        "cancelada"
                                                            ? "badge text-bg-danger"
                                                            : "badge text-bg-secondary"
                                                    }
                                                >
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

export default AdminHistorialUsuario;