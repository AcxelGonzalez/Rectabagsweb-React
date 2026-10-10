
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useTitulo from '../hooks/useTitulo';
import '../css/style_login.css';

function Registro() {
    // Lógica
    useTitulo('Registra tu cuenta | Rectabags');

    const [formulario, setFormulario] = useState({
        correo: '',
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        rut: '',
        telefono: '',
        contrasena: '',
        confirmarContrasena: '',
        region: '',
        comuna: '',
        direccion: '',
        terminos: false
    });

    function cambioFormulario(e) {
        const name = e.target.name;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormulario(values => ({...values, [name]: value}));
    }

    function envio(e) {
        e.preventDefault();

        if (formulario.contrasena !== formulario.confirmarContrasena) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (!formulario.terminos) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        alert('TODAVIA ES UNA DEMOSTRACIOOOOOOOON.');
    }

    // Render
    return (
        <section className="login-section d-flex align-items-center py-5">
            <div className="container">

                <div className="row mb-5 text-center">
                    <div className="col-12">
                        <h1 className="display-5 titulo-mono mb-2">El primer paso</h1>
                        <p className="fs-5 text-dark fw-light">Crea tu cuenta para poder comprar</p>
                    </div>
                </div>

                {/* formulario*/}
                <div className="row justify-content-center">
                    <div className="col-lg-7 col-md-9">
                        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
                            <div className="card-body p-0">
                                <h2 className="titulo-mono h3 mb-4 text-start">REGÍSTRATE</h2>

                                <form id="form-registro" onSubmit={envio}>

                                    {/* Correo */}
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label small fw-semibold">Correo(*)</label>
                                        <input type="email" className="form-control rounded-3 border-secondary-subtle py-2"
                                            id="email" name="correo" value={formulario.correo}
                                            onChange={cambioFormulario} required />
                                    </div>

                                    {/* Nombre y apellido */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="nombre" className="form-label small fw-semibold">Nombre(*)</label>
                                            <input type="text" className="form-control rounded-3 border-secondary-subtle py-2"
                                                id="nombre" name="nombre" value={formulario.nombre}
                                                onChange={cambioFormulario} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="apellido" className="form-label small fw-semibold">Apellido(*)</label>
                                            <input type="text" className="form-control rounded-3 border-secondary-subtle py-2"
                                                id="apellido" name="apellido" value={formulario.apellido}
                                                onChange={cambioFormulario} required />
                                        </div>
                                    </div>

                                    {/* Fecha de nacimiento */}
                                    <div className="mb-3">
                                        <label htmlFor="fecha-nacimiento" className="form-label small fw-semibold">
                                            Fecha de nacimiento(*)
                                        </label>
                                        <input type="date" className="form-control rounded-3 border-secondary-subtle py-2"
                                            id="fecha-nacimiento" name="fechaNacimiento" lang="es-CL"
                                            autoComplete="bday" value={formulario.fechaNacimiento}
                                            onChange={cambioFormulario} required />
                                    </div>

                                    {/* RUT y teléfono */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="rut" className="form-label small fw-semibold">RUT(*)</label>
                                            <input type="text" className="form-control rounded-3 border-secondary-subtle py-2"
                                                id="rut" name="rut" placeholder="Ej: 12345678-9"
                                                value={formulario.rut} onChange={cambioFormulario} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="telefono" className="form-label small fw-semibold">Teléfono(*)</label>
                                            <input type="tel" className="form-control rounded-3 border-secondary-subtle py-2"
                                                id="telefono" name="telefono" placeholder="+56 9 XXXX XXXX"
                                                value={formulario.telefono} onChange={cambioFormulario} required />
                                        </div>
                                    </div>

                                    {/* contraseñas */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label htmlFor="password" className="form-label small fw-semibold">Contraseña(*)</label>
                                            <input type="password" className="form-control rounded-3 border-secondary-subtle py-2"
                                                id="password" name="contrasena" autoComplete="new-password"
                                                value={formulario.contrasena} onChange={cambioFormulario} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="confirm-password" className="form-label small fw-semibold">
                                                Repita contraseña(*)
                                            </label>
                                            <input type="password" className="form-control rounded-3 border-secondary-subtle py-2"
                                                id="confirm-password" name="confirmarContrasena" autoComplete="new-password"
                                                value={formulario.confirmarContrasena} onChange={cambioFormulario} required />
                                        </div>
                                    </div>

                                    {/* Información opcional */}
                                    <div className="text-center border-top border-bottom border-warning-subtle py-2 mb-4">
                                        <span className="small text-decoration-underline"
                                            style={{ color: '#D9825B', fontSize: '0.82rem' }}>
                                            La información a continuación no es obligatoria. Al registrarla ahora
                                            no será necesario hacerlo en el Checkout.
                                        </span>
                                    </div>

                                    {/* Región y comuna */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="region" className="form-label small fw-semibold">Región</label>
                                            <select className="form-select rounded-3 border-secondary-subtle py-2"
                                                id="region" name="region" value={formulario.region}
                                                onChange={cambioFormulario} disabled>
                                                <option value="">Selecciona una región</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="comuna" className="form-label small fw-semibold">Comuna</label>
                                            <select className="form-select rounded-3 border-secondary-subtle py-2"
                                                id="comuna" name="comuna" value={formulario.comuna}
                                                onChange={cambioFormulario} disabled>
                                                <option value="">Selecciona una comuna</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Dirección */}
                                    <div className="mb-4">
                                        <label htmlFor="direccion" className="form-label small fw-semibold">Dirección</label>
                                        <input type="text" className="form-control rounded-3 border-secondary-subtle py-2"
                                            id="direccion" name="direccion" value={formulario.direccion}
                                            onChange={cambioFormulario} />
                                    </div>

                                    {/* Términos y condiciones */}
                                    <div className="form-check mb-4">
                                        <input type="checkbox" className="form-check-input border-dark rounded-1"
                                            id="terminos" name="terminos" checked={formulario.terminos}
                                            onChange={cambioFormulario} required />
                                        <label className="form-check-label small" htmlFor="terminos">
                                            Acepto los{' '}
                                            <Link to="/terminos-registro" target="_blank" rel="noopener noreferrer"
                                                className="text-dark text-decoration-underline">
                                                términos y condiciones
                                            </Link> (*)
                                        </label>
                                    </div>

                                    {/* Botón de registro */}
                                    <div className="text-center mt-4">
                                        <button type="submit" className="btn btn-dark rounded-3 px-4 py-2 titulo-mono fs-6">
                                            Crear cuenta
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enlace para iniciar sesión */}
                <div className="text-center mt-4">
                    <p className="fw-bold text-secondary">
                        ¿Ya tienes una cuenta? |{' '}
                        <Link to="/login" className="text-secondary text-decoration-none fw-normal">
                            Inicia sesión aquí.
                        </Link>
                    </p>
                </div>

            </div>
        </section>
    );
}

export default Registro;
