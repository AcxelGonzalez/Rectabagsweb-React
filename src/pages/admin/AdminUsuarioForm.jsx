import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitulo from "../../hooks/useTitulo";
import CampoFormulario from "../../components/admin/CampoFormulario";

function AdminUsuarioForm() {

    useTitulo("Editar usuario | Panel de administración");

    const { id } = useParams();
    const navigate = useNavigate();

    const { usuarios, usuarioActual, actualizarUsuario } = useAuth();

    const usuario = usuarios.find((item) => item.id === id);
    const esUnoMismo = usuario?.id === usuarioActual?.id;

    const [formulario, setFormulario] = useState(() => ({
        nombre: usuario?.nombre ?? "",
        apellido: usuario?.apellido ?? "",
        telefono: usuario?.telefono ?? "",
        rol: usuario?.rol ?? "cliente"
    }));

    const [mensajeError, setMensajeError] = useState(null);


    if (!usuario) {
        return (
            <section className="py-5">
                <div className="container">
                    <h1 className="h3 fw-bold mb-3">Usuario no encontrado</h1>
                    <Link to="/admin/usuarios" className="btn btn-dark">
                        Volver a usuarios
                    </Link>
                </div>
            </section>
        );
    }


    function cambio(evento) {
        const { name, value } = evento.target;
        setFormulario((valores) => ({ ...valores, [name]: value }));
        setMensajeError(null);
    }


    function envio(evento) {

        evento.preventDefault();

        const resultado = actualizarUsuario(usuario.id, formulario);

        if (!resultado.ok) {
            setMensajeError(resultado.mensaje);
            return;
        }

        navigate("/admin/usuarios", {
            state: { mensaje: resultado.mensaje }
        });

    }


    return (

        <section className="py-5">

            <div className="container" style={{ maxWidth: "720px" }}>

                <Link to="/admin/usuarios" className="small text-secondary">
                    ← Volver a usuarios
                </Link>

                <h1 className="display-6 fw-bold mb-4">
                    Editar {usuario.nombre} {usuario.apellido}
                </h1>

                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4 p-md-5">

                        {/* Datos que no se pueden modificar */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <div className="small text-secondary">Correo</div>
                                <div className="fw-semibold">{usuario.correo}</div>
                            </div>
                            <div className="col-md-6">
                                <div className="small text-secondary">RUT</div>
                                <div className="fw-semibold">{usuario.rut}</div>
                            </div>
                        </div>

                        <form onSubmit={envio} noValidate>

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <CampoFormulario
                                        etiqueta="Nombre"
                                        nombre="nombre"
                                        valor={formulario.nombre}
                                        onChange={cambio}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <CampoFormulario
                                        etiqueta="Apellido"
                                        nombre="apellido"
                                        valor={formulario.apellido}
                                        onChange={cambio}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <CampoFormulario
                                        etiqueta="Teléfono"
                                        nombre="telefono"
                                        tipo="tel"
                                        valor={formulario.telefono}
                                        onChange={cambio}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <CampoFormulario
                                        etiqueta="Rol"
                                        nombre="rol"
                                        como="select"
                                        valor={formulario.rol}
                                        onChange={cambio}
                                        disabled={esUnoMismo}
                                        ayuda={esUnoMismo ? "No puedes cambiar tu propio rol." : null}
                                    >
                                        <option value="cliente">Cliente</option>
                                        <option value="admin">Administrador</option>
                                    </CampoFormulario>
                                </div>

                            </div>

                            {mensajeError && (
                                <div className="alert alert-danger mt-4 mb-0" role="alert">
                                    {mensajeError}
                                </div>
                            )}

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Link to="/admin/usuarios" className="btn btn-outline-secondary">
                                    Cancelar
                                </Link>
                                <button type="submit" className="btn btn-dark">
                                    Guardar cambios
                                </button>
                            </div>

                        </form>

                    </div>
                </div>

            </div>

        </section>

    );

}

export default AdminUsuarioForm;