import {
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import useTitulo
    from "../hooks/useTitulo";

import useAuth
    from "../hooks/useAuth";

import "../css/style_login.css";


const FORMULARIO_INICIAL = {
    correo: "",
    rut: "",
    nuevaContrasena: "",
    confirmarContrasena: ""
};


function RecuperarContrasena() {

    useTitulo(
        "Recuperar contraseña | Rectabags"
    );


    const {
        recuperarContrasena
    } = useAuth();


    const [
        formulario,
        setFormulario
    ] = useState(
        FORMULARIO_INICIAL
    );


    const [
        mensaje,
        setMensaje
    ] = useState(null);


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


        if (
            formulario.nuevaContrasena !==
            formulario.confirmarContrasena
        ) {

            setMensaje({
                tipo: "danger",
                texto:
                    "Las contraseñas no coinciden."
            });

            return;

        }


        const resultado =
            recuperarContrasena(
                formulario.correo,
                formulario.rut,
                formulario.nuevaContrasena
            );


        if (!resultado.ok) {

            setMensaje({
                tipo: "danger",
                texto:
                    resultado.mensaje
            });

            return;

        }


        setMensaje({
            tipo: "success",
            texto:
                resultado.mensaje +
                " Ya puedes iniciar sesión con tu nueva contraseña."
        });


        setFormulario(
            FORMULARIO_INICIAL
        );

    }


    return (

        <section className="login-section d-flex align-items-center py-5">

            <div className="container">

                <div className="row mb-5 text-center">

                    <div className="col-12">

                        <h1 className="display-5 titulo-mono mb-2">
                            Recuperar contraseña
                        </h1>

                        <p className="fs-5 text-dark fw-light">
                            Ingresa los datos asociados a tu cuenta
                        </p>

                    </div>

                </div>


                <div className="row justify-content-center">

                    <div className="col-lg-6 col-md-8">

                        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">

                            <div className="card-body p-0">

                                <h2 className="titulo-mono h3 mb-4">
                                    Nueva contraseña
                                </h2>


                                <form
                                    id="form-recuperar-contrasena"
                                    onSubmit={envio}
                                >

                                    <div className="mb-3">

                                        <label
                                            htmlFor="correo-recuperacion"
                                            className="form-label small fw-semibold"
                                        >
                                            Correo electrónico
                                        </label>

                                        <input
                                            type="email"
                                            id="correo-recuperacion"
                                            name="correo"
                                            className="form-control rounded-3 border-secondary-subtle py-2"
                                            value={formulario.correo}
                                            onChange={cambioFormulario}
                                            autoComplete="email"
                                            required
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label
                                            htmlFor="rut-recuperacion"
                                            className="form-label small fw-semibold"
                                        >
                                            RUT
                                        </label>

                                        <input
                                            type="text"
                                            id="rut-recuperacion"
                                            name="rut"
                                            className="form-control rounded-3 border-secondary-subtle py-2"
                                            placeholder="Ej: 12345678-9"
                                            value={formulario.rut}
                                            onChange={cambioFormulario}
                                            required
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label
                                            htmlFor="nueva-contrasena"
                                            className="form-label small fw-semibold"
                                        >
                                            Nueva contraseña
                                        </label>

                                        <input
                                            type="password"
                                            id="nueva-contrasena"
                                            name="nuevaContrasena"
                                            className="form-control rounded-3 border-secondary-subtle py-2"
                                            value={formulario.nuevaContrasena}
                                            onChange={cambioFormulario}
                                            autoComplete="new-password"
                                            required
                                        />

                                    </div>


                                    <div className="mb-4">

                                        <label
                                            htmlFor="confirmar-contrasena"
                                            className="form-label small fw-semibold"
                                        >
                                            Repetir nueva contraseña
                                        </label>

                                        <input
                                            type="password"
                                            id="confirmar-contrasena"
                                            name="confirmarContrasena"
                                            className="form-control rounded-3 border-secondary-subtle py-2"
                                            value={formulario.confirmarContrasena}
                                            onChange={cambioFormulario}
                                            autoComplete="new-password"
                                            required
                                        />

                                    </div>


                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100 rounded-3 py-2"
                                    >
                                        Actualizar contraseña
                                    </button>

                                </form>


                                {mensaje && (

                                    <div
                                        className={`alert alert-${mensaje.tipo} mt-4 mb-0`}
                                        role="alert"
                                    >
                                        {mensaje.texto}
                                    </div>

                                )}


                                <div className="text-center mt-4">

                                    <Link
                                        to="/login"
                                        className="text-secondary text-decoration-underline"
                                    >
                                        Volver a iniciar sesión
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}


export default RecuperarContrasena;