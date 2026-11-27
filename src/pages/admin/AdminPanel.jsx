import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useProducts from "../../hooks/useProducts";
import { Link } from "react-router-dom";
import { listarOrdenes } from "../../services/compraService";
import useTitulo from "../../hooks/useTitulo";

function AdminPanel() {
    useTitulo("Panel de administración | Rectabags");
    const { usuarioActual, usuarios, esAdmin, cargandoUsuarios, errorUsuarios } = useAuth();
    const { productos, cargando, errorCarga } = useProducts();
    const [ordenes, setOrdenes] = useState(null);
    useEffect(() => {
        let activo = true;
        listarOrdenes().then(data => { if (activo) setOrdenes(data.filter(c => !c.archivada).length); })
            .catch(() => { if (activo) setOrdenes(null); });
        return () => { activo = false; };
    }, []);
    return <section className="py-5"><div className="container">
        <h1 className="display-6 fw-bold mb-1">Panel de administración</h1>
        <p className="text-secondary mb-4">Bienvenido/a, {usuarioActual?.nombre}.</p>
        {esAdmin && <Link to="/admin/reportes" className="btn btn-outline-dark mb-4">Ver reportes y estadísticas</Link>}
        <div className="row g-4">
            <div className="col-12 col-md-4"><div className="card border-0 shadow-sm rounded-4 h-100"><div className="card-body p-4">
                <h2 className="h5 fw-bold">Productos</h2><p className="display-6 fw-bold">{cargando || errorCarga ? "—" : productos.length}</p>
                {errorCarga && <p role="alert">{errorCarga}</p>}
                <Link to="/admin/productos" className="btn btn-dark">{esAdmin ? "Administrar productos" : "Ver productos"}</Link>
                {esAdmin && <Link to="/admin/categorias" className="btn btn-outline-dark ms-2">Categorías</Link>}
            </div></div></div>
            {esAdmin && <div className="col-12 col-md-4"><div className="card border-0 shadow-sm rounded-4 h-100"><div className="card-body p-4">
                <h2 className="h5 fw-bold">Usuarios</h2><p className="display-6 fw-bold">{cargandoUsuarios || errorUsuarios ? "—" : usuarios.length}</p>
                {errorUsuarios && <p role="alert">{errorUsuarios}</p>}
                <Link to="/admin/usuarios" className="btn btn-dark">Administrar usuarios</Link>
            </div></div></div>}
            <div className="col-12 col-md-4"><div className="card border-0 shadow-sm rounded-4 h-100"><div className="card-body p-4">
                <h2 className="h5 fw-bold">Órdenes</h2><p className="display-6 fw-bold">{ordenes ?? "—"}</p>
                <Link to="/admin/ordenes" className="btn btn-dark">Ver órdenes</Link>
            </div></div></div>
        </div>
    </div></section>;
}
export default AdminPanel;
