import { formatearPrecio } from "../../utils/moneda";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitulo from "../../hooks/useTitulo";
import { leerHistorialUsuario, colorEstado } from "../../services/compraService";

function AdminHistorialUsuario() {
    useTitulo("Historial de compras | Panel de administración");
    const { id } = useParams();
    const { usuarios } = useAuth();
    const usuario = usuarios.find(u => String(u.id) === id);
    const [resultado, setResultado] = useState(null);
    useEffect(() => {
        let activo = true;
        leerHistorialUsuario(id).then(compras => { if (activo) setResultado({ id, compras }); })
            .catch(e => { if (activo) setResultado({ id, error: e.response?.data?.mensaje || "No fue posible cargar el historial." }); });
        return () => { activo = false; };
    }, [id]);
    const compras = resultado?.id === id ? resultado.compras : null;
    const total = (compras || []).filter(c => c.estado !== "CANCELADA").reduce((suma, c) => suma + c.subtotal, 0);
    return <section className="py-5"><div className="container">
        <Link to="/admin/usuarios" className="small text-secondary">← Volver a usuarios</Link>
        <h1 className="display-6 fw-bold mb-4">Historial de {usuario ? `${usuario.nombre} ${usuario.apellido}` : `usuario ${id}`}</h1>
        {resultado?.id === id && resultado.error ? <div className="alert alert-danger" role="alert">{resultado.error}</div>
            : !compras ? <p role="status">Cargando historial…</p>
            : <><p>{compras.length} compras · Total gastado: {formatearPrecio(total)}</p>
                {compras.length === 0 ? <p>Este usuario todavía no ha realizado compras.</p>
                    : <div className="table-responsive"><table className="table align-middle">
                        <thead><tr><th>N° orden</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>{compras.map(c => <tr key={c.id}><td>{c.folio}</td><td>{new Date(c.fecha).toLocaleString("es-CL")}</td>
                            <td>{formatearPrecio(c.subtotal)}</td>
                            <td><span className={`badge ${colorEstado(c.estado)}`}>{c.estado}</span></td>
                            <td><Link to={`/admin/ordenes/${c.id}`} className="btn btn-sm btn-outline-dark">Ver boleta</Link></td>
                        </tr>)}</tbody>
                    </table></div>}</>}
    </div></section>;
}
export default AdminHistorialUsuario;
