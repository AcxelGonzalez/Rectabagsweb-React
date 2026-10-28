import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitulo from "../../hooks/useTitulo";

function AdminUsuarios() {

    useTitulo("Usuarios | Panel de administración");

    const { usuarios, usuarioActual, eliminarUsuario } = useAuth();

    const location = useLocation();

    // Usuario que se quiere eliminar (abre el modal)
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    // Mensaje de la última acción (o el que viene del formulario)
    const [mensaje, setMensaje] = useState(() =>
        location.state?.mensaje
            ? { tipo: "success", texto: location.state.mensaje }
            : null
    );


    function confirmarEliminacion() {

        const resultado = eliminarUsuario(usuarioAEliminar.id);

        setMensaje({
            tipo: resultado.ok ? "success" : "danger",
            texto: resultado.mensaje
        });

        setUsuarioAEliminar(null);

    }


    return (

        <section className="py-5">

            <div className="container">

                <Link to="/admin" className="small text-secondary">
                    ← Volver al panel
                </Link>

                <h1 className="display-6 fw-bold mb-4">
                    Usuarios
                </h1>

                {mensaje && (
                    <div className={`alert alert-${mensaje.tipo}`} role="alert">
                        {mensaje.texto}
                    </div>
                )}

                <div className="card border-0 shadow-sm rounded-4">
                    <div className="table-responsive">

                        <table className="table align-middle mb-0">

                            <thead className="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>RUT</th>
                                    <th>Rol</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {usuarios.map((usuario) => (

                                    <tr key={usuario.id}>

                                        <td className="fw-semibold">
                                            {usuario.nombre} {usuario.apellido}
                                            {usuario.id === usuarioActual?.id && (
                                                <span className="badge bg-secondary ms-2">Tú</span>
                                            )}
                                        </td>

                                        <td>{usuario.correo}</td>

                                        <td>{usuario.rut}</td>

                                        <td>
                                            <span className={`badge ${usuario.rol === "admin" ? "bg-warning text-dark" : "bg-light text-dark border"}`}>
                                                {usuario.rol === "admin" ? "Administrador" : "Cliente"}
                                            </span>
                                        </td>

                                          <td className="text-end">
                                            <Link
                                                to={`/admin/usuarios/${usuario.id}/compras`}
                                                className="btn btn-sm btn-outline-secondary me-2"
                                            >
                                                Compras
                                            </Link>
                                            <Link
                                                to={`/admin/usuarios/${usuario.id}/editar`}
                                                className="btn btn-sm btn-outline-dark me-2"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => setUsuarioAEliminar(usuario)}
                                                disabled={usuario.id === usuarioActual?.id}
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
            {usuarioAEliminar && (
                <>
                    <div className="modal d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h2 className="modal-title h5">Eliminar usuario</h2>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Cerrar"
                                        onClick={() => setUsuarioAEliminar(null)}
                                    />
                                </div>

                                <div className="modal-body">
                                    ¿Seguro que quieres eliminar a{" "}
                                    <strong>{usuarioAEliminar.nombre} {usuarioAEliminar.apellido}</strong>?
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setUsuarioAEliminar(null)}
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

                    <div className="modal-backdrop show" />
                </>
            )}

        </section>

    );

}

export default AdminUsuarios;