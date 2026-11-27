import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo";
import Boleta from "../../components/Boleta";
import { obtenerBoleta } from "../../services/compraService";

function AdminBoleta() {
    const { id } = useParams();
    const [resultado, setResultado] = useState(null);
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
            : <div className="mt-2"><Boleta compra={resultado.compra} /></div>}
    </div></section>;
}
export default AdminBoleta;
