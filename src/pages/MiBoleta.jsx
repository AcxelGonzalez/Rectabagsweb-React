import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useTitulo from "../hooks/useTitulo";
import Boleta from "../components/Boleta";
import { obtenerBoleta } from "../services/compraService";

function MiBoleta() {
    useTitulo("Mi boleta | Rectabags");
    const { id } = useParams();
    const { usuarioActual, cargandoSesion } = useAuth();
    const [resultado, setResultado] = useState(null);
    const usuarioId = usuarioActual?.id;
    useEffect(() => {
        let activo = true;
        if (!usuarioId || cargandoSesion) return;
        obtenerBoleta(id).then(compra => { if (activo) setResultado({ id, compra }); })
            .catch(e => { if (activo) setResultado({ id, error: e.response?.data?.mensaje || "No fue posible cargar la boleta." }); });
        return () => { activo = false; };
    }, [id, usuarioId, cargandoSesion]);
    if (cargandoSesion) return <p className="container py-5" role="status">Comprobando tu sesión…</p>;
    if (!usuarioActual) return <Navigate to="/login" replace />;
    return <section className="py-5"><div className="container" style={{ maxWidth: "820px" }}>
        <Link to="/perfil" className="small text-secondary">← Volver a mi perfil</Link>
        {resultado?.id !== id ? <p role="status">Cargando boleta…</p>
            : resultado.error ? <div className="alert alert-danger mt-3" role="alert">{resultado.error}</div>
            : <div className="mt-2"><Boleta compra={resultado.compra} /></div>}
    </div></section>;
}
export default MiBoleta;
