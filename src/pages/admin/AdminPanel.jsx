import useAuth from "../../hooks/useAuth";
import useProducts from "../../hooks/useProducts";
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

                <div className="row g-4">

                    <div className="col-12 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <h2 className="h5 fw-bold">Productos</h2>
                                <p className="display-6 fw-bold mb-0">
                                    {productos.length}
                                </p>
                                <p className="text-secondary mb-0">
                                    productos en el catálogo
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <h2 className="h5 fw-bold">Usuarios</h2>
                                <p className="display-6 fw-bold mb-0">
                                    {usuarios.length}
                                </p>
                                <p className="text-secondary mb-0">
                                    usuarios registrados
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </section>

    );

}

export default AdminPanel;