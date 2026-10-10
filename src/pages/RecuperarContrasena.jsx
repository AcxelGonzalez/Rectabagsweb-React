
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useTitulo from '../hooks/useTitulo';
import '../css/style_login.css';

function RecuperarContrasena() {
    // Lógica
    useTitulo('Recuperar Contraseña | Rectabags');

    const [formulario, setFormulario] = useState({
        correo: '',
        rut: '',
        nuevaContrasena: '',
        confirmarContrasena: ''
    });

    function cambioFormulario(e) {
        const name = e.target.name;
        const value = e.target.value;

        setFormulario(values => ({...values, [name]: value}));
    }

    function envio(e) {
        e.preventDefault();

        if (formulario.nuevaContrasena !== formulario.confirmarContrasena) {
            alert('Las contraseñas no coinciden');
            return;
        }

        alert('ESTO ES UNA PRUEBA.');
    }

    // Render
    return (
        <section className="login-section d-flex align-items-center py-5">
            <div className="container">

                {/* Encabezado */}
                <div className="row mb-5 text-center">
                    <div className="col-12">
                        <h1 className="display-5 titulo-mono mb-2">Restablece tu acceso</h1>
                        <p className="fs-5 text-dark fw-light">
                            Ingresa tus datos de verificación para actualizar tu contraseña
                        </p>
                    </div>
                </div>

                {/* Formulario de recuperación */}
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
                            <div className="card-body p-0">

                                <h2 className="titulo-mono h4 mb-3 text-start">RECUPERAR CONTRASEÑA</h2>
                                <p className="small text-secondary mb-4">
                                    Para verificar tu identidad, ingresa el correo registrado y tu RUT asociado a la cuenta.
                                </p>

                                <form id="form-recuperar" onSubmit={envio}>

                                    {/* Correo */}
                                    <div className="mb-3">
                                        <label htmlFor="recuperar-email" className="form-label small fw-semibold">
                                            Correo registrado(*)
                                        </label>
                                        <input type="email" className="form-control rounded-3 border-secondary-subtle py-2"
                                            id="recuperar-email" name="correo" autoComplete="email"
                                            value={formulario.correo} onChange={cambioFormulario} required />
                                    </div>

                                    {/* RUT */}
                                    <div className="mb-4">
                                        <label htmlFor="recuperar-rut" className="form-label small fw-semibold">
                                            RUT registrado(*)
                                        </label>
                                        <input type="text" className="form-control rounded-3 border-secondary-subtle py-2"
                                            id="recuperar-rut" name="rut" placeholder="Ej: 12345678-9"
                                            value={formulario.rut} onChange={cambioFormulario} required />
                                    </div>

                                    {/* Nuevas contraseñas */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label htmlFor="nueva-pass" className="form-label small fw-semibold">
                                                Nueva contraseña(*)
                                            </label>
                                            <input type="password" className="form-control rounded-3 border-secondary-subtle py-2"
                                                id="nueva-pass" name="nuevaContrasena" autoComplete="new-password"
                                                value={formulario.nuevaContrasena} onChange={cambioFormulario} required />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="confirm-nueva-pass" className="form-label small fw-semibold">
                                                Repita nueva contraseña(*)
                                            </label>
                                            <input type="password" className="form-control rounded-3 border-secondary-subtle py-2"
                                                id="confirm-nueva-pass" name="confirmarContrasena" autoComplete="new-password"
                                                value={formulario.confirmarContrasena} onChange={cambioFormulario} required />
                                        </div>
                                    </div>

                                    {/* Botón */}
                                    <div className="text-center mt-4">
                                        <button type="submit" className="btn btn-dark rounded-3 px-4 py-2 titulo-mono fs-6 w-100">
                                            Actualizar Contraseña
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enlace al login */}
                <div className="text-center mt-4">
                    <p className="fw-bold text-secondary">
                        ¿Recordaste tu contraseña? |{' '}
                        <Link to="/login" className="text-secondary text-decoration-none fw-normal">
                            Inicia sesión aquí.
                        </Link>
                    </p>
                </div>

            </div>
        </section>
    );
}

export default RecuperarContrasena;
