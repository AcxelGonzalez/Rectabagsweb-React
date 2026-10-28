import { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import useTitulo from "../hooks/useTitulo";

import useAuth from "../hooks/useAuth";

import "../css/style_login.css";

const FORMULARIO_INICIAL = {
    correo: "",
    contrasena: "" };

function Login() {

    useTitulo(
        "Iniciar sesión | Rectabags");


    const navigate = useNavigate();
    
    const location = useLocation();

    /*
     * Si el usuario llegó aquí porque intentó entrar a una página
     * protegida, se le devuelve a esa página después de iniciar sesión.
     * Si entró al login por su cuenta, se le lleva al inicio.
     */
    const destino =
        location.state?.from?.pathname || "/";

    const { iniciarSesion } = useAuth();


    const [
        formulario,
        setFormulario
    ] = useState(
        FORMULARIO_INICIAL
    );


    const [
        mensaje,
        setMensaje ] = useState(null);

    function cambioFormulario(evento)
     {

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

    function envio(evento) 
    {

        evento.preventDefault();


        const resultado =
            iniciarSesion(
                formulario.correo,
                formulario.contrasena
            );


        if (!resultado.ok) {

            setMensaje({
                tipo: "danger",
                texto:
                    resultado.mensaje
            });

            return;

        }


        setFormulario(
            FORMULARIO_INICIAL
        );


        navigate(destino, { replace: true });

    }

    return (
        <section className="login-section d-flex align-items-center py-5">
            <div className="container">

                {/* head */}
                <div className="row mb-5 text-center">
                    <div className="col-12">
                        <h1 className="display-5 titulo-mono mb-2">Bienvenido a Rectabags</h1>
                        <p className="fs-5 text-dark fw-light">
                            Ingresa o crea tu cuenta para poder comprar
                        </p>
                    </div>
                </div>

                <div className="row justify-content-center g-4">

                    <div className="col-md-5">
                        <div className="card border-0 shadow-sm h-100 p-4 rounded-0">
                            <div className="card-body">
                                <h2 className="text-center mb-4 titulo-mono">Ingresar</h2>

                                <form id="form-login" onSubmit={envio}>

                                    {/* usuario */}
                                    <div className="mb-3">
                                        <label htmlFor="email-login" className="form-label small text-secondary">
                                            Correo electrónico
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control rounded-0 border-dark"
                                            id="email-login"
                                            name="correo"
                                            autoComplete="email"
                                            value={formulario.correo}
                                            onChange={cambioFormulario}
                                            required
                                        />
                                    </div>

                                    {/* contraseña */}
                                    <div className="mb-3">
                                        <label htmlFor="pass-login" className="form-label small text-secondary">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control rounded-0 border-dark"
                                            id="pass-login"
                                            name="contrasena"
                                            autoComplete="current-password"
                                            value={formulario.contrasena}
                                            onChange={cambioFormulario}
                                            required
                                        />
                                    </div>

                                    <div className="d-flex justify-content-end align-items-center mb-4 mt-2">
                                        

                                        <Link to="/recuperar-contrasena" className="small text-secondary text-decoration-underline">
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </div>

                                    <button type="submit" className="btn btn-dark w-100 rounded-0 py-2">
                                        Ingresar
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

                            </div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="card border-0 shadow-sm h-100 p-4 rounded-0">
                            <div className="card-body d-flex flex-column">
                                <h2 className="text-center mb-4 titulo-mono">Crear cuenta</h2>

                                <p className="texto-mono small flex-grow-1 text-secondary lh-lg">
                                    Al registrarte podrás comenzar a realizar tus compras,
                                    acceder al estado e historial de tus pedidos.
                                    Solo te pediremos lo esencial.
                                </p>

                                <div className="mb-4">
                                    <Link to="/terminos-registro" className="small text-secondary text-decoration-underline">
                                        Términos y condiciones.
                                    </Link>
                                </div>

                                <Link to="/registro" className="btn btn-dark w-100 rounded-0 py-2 mt-auto">
                                    Crear cuenta
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Login;