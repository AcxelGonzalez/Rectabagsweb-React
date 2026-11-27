import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo";
import Boleta from "../../components/Boleta";
import { obtenerBoleta, cambiarEstadoBoleta } from "../../services/compraService";
import useAuth from "../../hooks/useAuth";

const TRANSICIONES = {
    PENDIENTE: ["PAGADA", "CANCELADA"], PAGADA: ["ENVIADA", "CANCELADA"],
    ENVIADA: ["ENTREGADA"], ENTREGADA: [], CANCELADA: []
};

function AdminBoleta() {
    const { id } = useParams();
    const [resultado, setResultado] = useState(null);
    const { esAdmin } = useAuth();
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    async function cambiarEstado(evento) {
        evento.preventDefault();
        const estado = new FormData(evento.currentTarget).get("estado");
        setGuardando(true);
        setMensaje(null);
        try {
            const compra = await cambiarEstadoBoleta(id, estado);
            setResultado({ id, compra });
            setMensaje({ tipo: "success", texto: "Estado actualizado correctamente." });
        } catch (error) {
            setMensaje({ tipo: "danger", texto: error.response?.data?.mensaje || "No fue posible actualizar el estado." });
        } finally { setGuardando(false); }
    }
    useTitulo(`Boleta ${id} | Panel de administración`);
    useEffect(() => {
        let activo = true;
        obtenerBoleta(id).then(compra => { if (activo) setResultado({ id, compra }); })
            .catch(e => { if (activo) setResultado({ id, error: e.response?.data?.mensaje || "No fue posible cargar la boleta." }); });
        return () => { activo = false; };
    }, [id]);
    return <section className="py-5"><div className="container" style={{ maxWidth: "820px" }}>
        <Link to="/admin/ordenes" className="small text-secondary">← Volver a órdenes</Link>
        {resultado?.id !== id ? <p role="status">Cargando boleta…</p>
            : resultado.error ? <div className="alert alert-danger mt-3" role="alert">{resultado.error}</div>
            : <div className="mt-2">
                <Boleta compra={resultado.compra} />
                {esAdmin && !resultado.compra.archivada && TRANSICIONES[resultado.compra.estado]?.length > 0 &&
                    <form onSubmit={cambiarEstado} className="mt-3 d-print-none">
                        <label htmlFor="estado-boleta" className="form-label">Cambiar estado</label>
                        <select key={resultado.compra.estado} id="estado-boleta" name="estado" className="form-select" disabled={guardando}>
                            {TRANSICIONES[resultado.compra.estado].map(estado => <option key={estado} value={estado}>{estado}</option>)}
                        </select>
                        <p className="small text-secondary mt-2">Al cancelar, el servidor devuelve el stock de la compra.</p>
                        <button className="btn btn-dark" disabled={guardando}>{guardando ? "Guardando…" : "Actualizar estado"}</button>
                    </form>}
                {resultado.compra.archivada && <p className="mt-3">Esta boleta pertenece a un periodo cerrado.</p>}
                {mensaje && <div role="alert" className={`alert alert-${mensaje.tipo} mt-3`}>{mensaje.texto}</div>}
            </div>}
    </div></section>;
}
export default AdminBoleta;
