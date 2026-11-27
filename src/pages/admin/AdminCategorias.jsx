import EstadoDatos from "../../components/EstadoDatos";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import useTitulo from "../../hooks/useTitulo";


/*
 * Lista de categorías del panel de administración.
 */
function AdminCategorias() {

    useTitulo("Categorías | Panel de administración");

    const { categorias, productos, eliminarCategoria, cargando, errorCarga, cargandoCategorias, errorCategorias, cargarProductos, cargarCategorias } = useProducts();

    const location = useLocation();

    // Mensaje que llega desde el formulario (crear / editar)
    const [mensaje, setMensaje] = useState(() =>
        location.state?.mensaje
            ? { tipo: "success", texto: location.state.mensaje }
            : null
    );

    // Categoría que se quiere eliminar (abre el modal)
    const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);


    // Cuántos productos activos tiene cada categoría
    function cantidadProductos(idCategoria) {
        return productos.filter((p) => p.idCategoria === idCategoria).length;
    }


    async function confirmarEliminacion() {

        const resultado = await eliminarCategoria(categoriaAEliminar.idCategoria);

        setMensaje({
            tipo: resultado.ok ? "success" : "danger",
            texto: resultado.mensaje
        });

        setCategoriaAEliminar(null);

    }


    if (cargando || cargandoCategorias || errorCarga || errorCategorias) return <EstadoDatos cargando={cargando || cargandoCategorias} error={errorCarga || errorCategorias} onReintentar={() => Promise.all([cargarProductos(), cargarCategorias()])} />;

    return (

        <section className="py-5">

            <div className="container">

                <Link to="/admin" className="small text-secondary">
                    ← Volver al panel
                </Link>

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <h1 className="display-6 fw-bold mb-0">Categorías</h1>
                    <Link to="/admin/categorias/nueva" className="btn btn-dark">
                        + Nueva categoría
                    </Link>
                </div>

                {mensaje && (
                    <div className={`alert alert-${mensaje.tipo}`} role="alert">
                        {mensaje.texto}
                    </div>
                )}

                <div className="card border-0 shadow-sm rounded-4">
                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-dark">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th className="text-center">Productos</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {categorias.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center text-secondary py-4">
                                            No hay categorías registradas.
                                        </td>
                                    </tr>
                                )}

                                {categorias.map((categoria) => (

                                    <tr key={categoria.idCategoria}>

                                        <td className="fw-semibold">{categoria.nombre}</td>

                                        <td className="text-secondary">
                                            {categoria.descripcion || "—"}
                                        </td>

                                        <td className="text-center">
                                            {cantidadProductos(categoria.idCategoria)}
                                        </td>

                                        <td className="text-end text-nowrap">
                                            <Link
                                                to={`/admin/categorias/${categoria.idCategoria}/editar`}
                                                className="btn btn-sm btn-outline-dark me-2"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => setCategoriaAEliminar(categoria)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                </div>

            </div>


            {/* Modal de confirmación */}
            {categoriaAEliminar && (
                <>
                    <div className="modal d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h2 className="modal-title h5">Eliminar categoría</h2>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Cerrar"
                                        onClick={() => setCategoriaAEliminar(null)}
                                    />
                                </div>

                                <div className="modal-body">
                                    ¿Seguro que quieres eliminar{" "}
                                    <strong>{categoriaAEliminar.nombre}</strong>?
                                    <div className="small text-secondary mt-2">
                                        Solo se puede eliminar si no tiene productos activos.
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setCategoriaAEliminar(null)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={confirmarEliminacion}
                                    >
                                        Eliminar
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop show"></div>
                </>
            )}

        </section>

    );

}

export default AdminCategorias;