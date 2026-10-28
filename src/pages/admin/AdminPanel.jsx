import useAuth from "../../hooks/useAuth";
import useProducts from "../../hooks/useProducts";
import { Link } from "react-router-dom";
import { leerCompras } from "../../services/compraService";
import useTitulo from "../../hooks/useTitulo";

function AdminPanel() {

    useTitulo("Panel de administración | Rectabags");

    const { usuarioActual, usuarios } = useAuth();
    const { productos } = useProducts();

    return (

        <section className="py-5">

            <div className="container">

                <h1 className="display-6 fw-bold mb-1">
                    Panel de administración
                </h1>

                <p className="text-secondary mb-4">
                    Bienvenido/a, {usuarioActual?.nombre}.
                </p>

                <Link to="/admin/reportes" className="btn btn-outline-dark mb-4">
                    Ver reportes y estadísticas
                </Link>

                <div className="row g-4">

                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <h2 className="h5 fw-bold">Productos</h2>
                                <p className="display-6 fw-bold mb-0">
                                    {productos.length}
                                </p>
                                <p className="text-secondary">
                                    productos en el catálogo
                                </p>
                                <Link to="/admin/productos" className="btn btn-dark">
                                    Administrar productos
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <h2 className="h5 fw-bold">Usuarios</h2>
                                <p className="display-6 fw-bold mb-0">
                                    {usuarios.length}
                                </p>
                                <p className="text-secondary">
                                    usuarios registrados
                                </p>
                               <Link to="/admin/usuarios" className="btn btn-dark">
                                    Administrar usuarios
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <h2 className="h5 fw-bold">Órdenes</h2>
                                <p className="display-6 fw-bold mb-0">
                                    {leerCompras().filter((compra) => !compra.archivada).length}
                                </p>
                                <p className="text-secondary">
                                    compras realizadas
                                </p>
                                <Link to="/admin/ordenes" className="btn btn-dark">
                                    Ver órdenes
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </section>

    );

}

export default AdminPanel;