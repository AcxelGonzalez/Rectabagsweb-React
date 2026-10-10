
import { useState } from "react";
import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo";
import "../css/style_login.css";

function Login() {
    // Lógica
    useTitulo("Ingresa a tu cuenta | Rectabags");

    const [datos, setDatos] = useState({
        usuario: "",
        contrasena: "",
        recordarme: false
    });

    const [enviado, setEnviado] = useState(false);

    // Actualiza los datos del formulario
    function cambio(evento) {
        const { name, value, type, checked } = evento.target;

        setDatos((anteriores) => ({
            ...anteriores,
            [name]: type === "checkbox" ? checked : value
        }));

        setEnviado(false);
    }

    function envio(evento) {
        evento.preventDefault();
        setEnviado(true);
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
                                            Correo electrónico o Usuario
                                        </label>
                                        <input type="text" className="form-control rounded-0 border-dark"
                                            id="email-login" name="usuario" autoComplete="username"
                                            value={datos.usuario} onChange={cambio} required />
                                    </div>

                                    {/* contraseña */}
                                    <div className="mb-3">
                                        <label htmlFor="pass-login" className="form-label small text-secondary">
                                            Contraseña
                                        </label>
                                        <input type="password" className="form-control rounded-0 border-dark"
                                            id="pass-login" name="contrasena" autoComplete="current-password"
                                            value={datos.contrasena} onChange={cambio} required />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input border-dark rounded-0"
                                                id="recordarme" name="recordarme"
                                                checked={datos.recordarme} onChange={cambio} />
                                            <label className="form-check-label small" htmlFor="recordarme">
                                                Recuérdame
                                            </label>
                                        </div>

                                        <Link to="/recuperar-contrasena" className="small text-secondary text-decoration-underline">
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </div>

                                    <button type="submit" className="btn btn-dark w-100 rounded-0 py-2">
                                        Ingresar
                                    </button>
                                </form>

                                {enviado && (
                                    <div className="alert alert-info mt-4" role="status">
                                        Formulario completado correctamente. El inicio de sesión
                                        estará disponible cuando incorporemos la autenticación.
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
