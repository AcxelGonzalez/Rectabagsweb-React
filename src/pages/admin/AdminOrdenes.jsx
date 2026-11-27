import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo";
import { listarOrdenes, colorEstado } from "../../services/compraService";

function AdminOrdenes() {
    useTitulo("Órdenes | Panel de administración");
    const [compras, setCompras] = useState(null);
    const [error, setError] = useState("");
    useEffect(() => {
        let activo = true;
        listarOrdenes().then(data => { if (activo) setCompras(data.filter(c => !c.archivada)); })
            .catch(e => { if (activo) setError(e.response?.data?.mensaje || "No fue posible cargar las órdenes."); });
        return () => { activo = false; };
    }, []);
    return <section className="py-5"><div className="container">
        <Link to="/admin" className="small text-secondary">← Volver al panel</Link>
        <h1 className="display-6 fw-bold mb-4">Órdenes</h1>
        {error ? <div className="alert alert-danger" role="alert">{error}</div>
            : compras === null ? <p role="status">Cargando órdenes…</p>
            : compras.length === 0 ? <div className="alert alert-light border">Todavía no hay compras registradas.</div>
            : <div className="card border-0 shadow-sm rounded-4"><div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                    <thead className="table-dark"><tr><th>N° orden</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
                    <tbody>{compras.map(compra => <tr key={compra.id}>
                        <td>{compra.folio}</td><td>{new Date(compra.fecha).toLocaleString("es-CL")}</td>
                        <td>{compra.cliente.nombre} {compra.cliente.apellido}<div className="small text-secondary">{compra.cliente.correo}</div></td>
                        <td>{compra.subtotal.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
                        <td><span className={`badge ${colorEstado(compra.estado)}`}>{compra.estado}</span></td>
                        <td><Link to={`/admin/ordenes/${compra.id}`} className="btn btn-sm btn-outline-dark">Ver boleta</Link></td>
                    </tr>)}</tbody>
                </table>
            </div></div>}
    </div></section>;
}
export default AdminOrdenes;
