import { useState } from "react";

export default function EstadoDatos({ cargando, error, onReintentar }) {
    const [reintentando, setReintentando] = useState(false);
    async function reintentar() {
        setReintentando(true);
        try { await onReintentar(); }
        finally { setReintentando(false); }
    }
    return <section className="container py-5">
        {cargando ? <p role="status">Cargando datos…</p> : <div role="alert" className="alert alert-danger">
            <p>{error}</p>
            {onReintentar && <button type="button" className="btn btn-outline-dark" disabled={reintentando} onClick={reintentar}>
                {reintentando ? "Reintentando…" : "Reintentar"}
            </button>}
        </div>}
    </section>;
}
