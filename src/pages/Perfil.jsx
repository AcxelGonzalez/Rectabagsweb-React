import {
    useState
} from "react";

import {
    Navigate
} from "react-router-dom";

import useAuth
    from "../hooks/useAuth";

import useTitulo
    from "../hooks/useTitulo";


function Perfil() {

    useTitulo(
        "Mi perfil | Rectabags"
    );


    const {
        usuarioActual,
        usuarios,
        actualizarPerfil
    } = useAuth();


    const usuario =
        usuarios.find(
            (item) =>
                item.id ===
                usuarioActual?.id
        ) || usuarioActual;


    const [
        formulario,
        setFormulario
    ] = useState(
        () => ({

            nombre:
                usuario?.nombre || "",

            apellido:
                usuario?.apellido || "",

            fechaNacimiento:
                usuario?.fechaNacimiento || "",

            telefono:
                usuario?.telefono || "",

            region:
                usuario?.region || "",

            comuna:
                usuario?.comuna || "",

            direccion:
                usuario?.direccion || ""

        })
    );


    const [
        mensaje,
        setMensaje
    ] = useState(null);


    if (!usuarioActual) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    function cambioFormulario(
        evento
    ) {

        const {
            name,
            value
        } = evento.target;


        setFormulario(
            (valores) => ({
                ...valores,
                [name]: value
            })
        );


        if (mensaje) {

            setMensaje(null);

        }

    }


    function envio(
        evento
    ) {

        evento.preventDefault();


        const resultado =
            actualizarPerfil(
                formulario
            );


        setMensaje({

            tipo:
                resultado.ok
                    ? "success"
                    : "danger",

            texto:
                resultado.mensaje

        });

    }


    return (

        <section className="py-5">

            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-lg-8">

                        <div className="mb-4">

                            <h1 className="display-6 fw-bold mb-2">
                                Mi Perfil
                            </h1>

                            <p className="text-secondary mb-0">
                                Revisa y actualiza tus datos personales.
                            </p>

                        </div>


                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-4 p-md-5">

                                <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">

                                    <div>

                                        <div className="small text-secondary">
                                            Sesión iniciada como
                                        </div>

                                        <div className="fw-bold fs-5">

                                            {
                                                usuarioActual.nombre
                                            }{" "}

                                            {
                                                usuarioActual.apellido
                                            }

                                        </div>

                                    </div>


                                    <div>

                                        <span
                                            className={
                                                usuarioActual.rol ===
                                                    "admin"
                                                    ? "badge text-bg-warning"
                                                    : "badge text-bg-dark"
                                            }
                                        >

                                            {
                                                usuarioActual.rol ===
                                                    "admin"
                                                    ? "Administrador"
                                                    : "Cliente"
                                            }

                                        </span>

                                    </div>

                                </div>


                                <form
                                    onSubmit={envio}
                                >

                                    <div className="row g-3">

                                        <div className="col-md-6">

                                            <label
                                                htmlFor="perfil-nombre"
                                                className="form-label fw-semibold"
                                            >
                                                Nombre
                                            </label>

                                            <input
                                                type="text"
                                                id="perfil-nombre"
                                                name="nombre"
                                                className="form-control"
                                                value={
                                                    formulario.nombre
                                                }
                                                onChange={
                                                    cambioFormulario
                                                }
                                                required
                                            />

                                        </div>


                                        <div className="col-md-6">

                                            <label
                                                htmlFor="perfil-apellido"
                                                className="form-label fw-semibold"
                                            >
                                                Apellido
                                            </label>

                                            <input
                                                type="text"
                                                id="perfil-apellido"
                                                name="apellido"
                                                className="form-control"
                                                value={
                                                    formulario.apellido
                                                }
                                                onChange={
                                                    cambioFormulario
                                                }
                                                required
                                            />

                                        </div>


                                        <div className="col-md-6">

                                            <label
                                                htmlFor="perfil-correo"
                                                className="form-label fw-semibold"
                                            >
                                                Correo electrónico
                                            </label>

                                            <input
                                                type="email"
                                                id="perfil-correo"
                                                className="form-control"
                                                value={
                                                    usuarioActual.correo
                                                }
                                                readOnly
                                            />

                                            <div className="form-text">
                                                El correo no puede modificarse desde el perfil.
                                            </div>

                                        </div>


                                        <div className="col-md-6">

                                            <label
                                                htmlFor="perfil-rut"
                                                className="form-label fw-semibold"
                                            >
                                                RUT
                                            </label>

                                            <input
                                                type="text"
                                                id="perfil-rut"
                                                className="form-control"
                                                value={
                                                    usuarioActual.rut
                                                }
                                                readOnly
                                            />

                                            <div className="form-text">
                                                El RUT identifica tu cuenta y no puede modificarse.
                                            </div>

                                        </div>


                                        <div className="col-md-6">

                                            <label
                                                htmlFor="perfil-fecha"
                                                className="form-label fw-semibold"
                                            >
                                                Fecha de nacimiento
                                            </label>

                                            <input
                                                type="date"
                                                id="perfil-fecha"
                                                name="fechaNacimiento"
                                                className="form-control"
                                                value={
                                                    formulario.fechaNacimiento
                                                }
                                                onChange={
                                                    cambioFormulario
                                                }
                                            />

                                        </div>


                                        <div className="col-md-6">

                                            <label
                                                htmlFor="perfil-telefono"
                                                className="form-label fw-semibold"
                                            >
                                                Teléfono
                                            </label>

                                            <input
                                                type="tel"
                                                id="perfil-telefono"
                                                name="telefono"
                                                className="form-control"
                                                placeholder="+56 9 XXXX XXXX"
                                                value={
                                                    formulario.telefono
                                                }
                                                onChange={
                                                    cambioFormulario
                                                }
                                            />

                                        </div>


                                        <div className="col-md-6">

                                            <label
                                                htmlFor="perfil-region"
                                                className="form-label fw-semibold"
                                            >
                                                Región
                                            </label>

                                            <select
                                                id="perfil-region"
                                                name="region"
                                                className="form-select"
                                                value={
                                                    formulario.region
                                                }
                                                onChange={
                                                    cambioFormulario
                                                }
                                                disabled
                                            >

                                                <option value="">
                                                    Selecciona una región
                                                </option>

                                            </select>

                                        </div>


                                        <div className="col-md-6">

                                            <label
                                                htmlFor="perfil-comuna"
                                                className="form-label fw-semibold"
                                            >
                                                Comuna
                                            </label>

                                            <select
                                                id="perfil-comuna"
                                                name="comuna"
                                                className="form-select"
                                                value={
                                                    formulario.comuna
                                                }
                                                onChange={
                                                    cambioFormulario
                                                }
                                                disabled
                                            >

                                                <option value="">
                                                    Selecciona una comuna
                                                </option>

                                            </select>

                                        </div>


                                        <div className="col-12">

                                            <label
                                                htmlFor="perfil-direccion"
                                                className="form-label fw-semibold"
                                            >
                                                Dirección
                                            </label>

                                            <input
                                                type="text"
                                                id="perfil-direccion"
                                                name="direccion"
                                                className="form-control"
                                                value={
                                                    formulario.direccion
                                                }
                                                onChange={
                                                    cambioFormulario
                                                }
                                            />

                                        </div>

                                    </div>


                                    <div className="mt-4">

                                        <button
                                            type="submit"
                                            className="btn btn-dark px-4"
                                        >
                                            Guardar cambios
                                        </button>

                                    </div>

                                </form>


                                {mensaje && (

                                    <div
                                        className={`alert alert-${mensaje.tipo} mt-4 mb-0`}
                                        role="alert"
                                    >
                                        {mensaje.texto}
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}


export default Perfil;