import useTitulo from '../hooks/useTitulo';
import { useState } from 'react';
import { validarCorreo } from '../utils/validaciones';

function Contacto() {
    // Lógica
    useTitulo("Contacto | Rectabags");

    const [datos, setDatos] = useState({
        nombre: "",
        correo: "",
        asunto: "",
        mensaje: ""
    });

    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState(null);

    // Actualiza los datos del formulario
    function cambio(evento) {
        const { name, value } = evento.target;
        setError(null);

        setDatos((anteriores) => ({
            ...anteriores,
            [name]: value
        }));

        if (enviado) {

            setEnviado(
                false
            );

        }
    }

    // Captura los datos del formulario
    function envio(
        evento
    ) {

        evento.preventDefault();
        const errorValidacion = !datos.nombre.trim() ? "Ingresa tu nombre."
            : datos.nombre.length > 100 ? "El nombre admite máximo 100 caracteres."
            : datos.correo.length > 100 ? "El correo admite máximo 100 caracteres."
            : validarCorreo(datos.correo)
                || (!datos.mensaje.trim() ? "Ingresa tu comentario."
                    : datos.mensaje.length > 500 ? "El comentario admite máximo 500 caracteres." : null);
        if (errorValidacion) {
            setError(errorValidacion);
            setEnviado(false);
            return;
        }
        setError(null);
        setEnviado(
            true
        );


        setDatos({
            nombre: "",
            correo: "",
            asunto: "",
            mensaje: ""
        });

    }

    return (
        <main className="py-5 mt-5">
            <div className="container py-4">

                {/* Encabezado */}
                <div className="row mb-5 text-center">
                    <div className="col-md-8 mx-auto">
                        <h1 className="display-4 fw-bold titulo-mono text-dark mb-3">
                            Hablemos
                        </h1>
                        <p className="fs-5 text-secondary">
                            ¿Tienes alguna consulta sobre envíos, pedidos o cualquier otra duda? ¡Escríbenos!
                        </p>
                    </div>
                </div>

                <div className="row g-5 align-items-stretch">

                    {/* Información de contacto */}
                    <div className="col-lg-5">
                        <div
                            className="card border-0 rounded-4 shadow-sm h-100 p-4 p-md-5"
                            style={{ backgroundColor: "#E8DED8" }}
                        >
                            <div className="card-body d-flex flex-column justify-content-center">

                                <h2 className="h3 fw-bold mb-4 titulo-mono">
                                    Datos de contacto
                                </h2>

                                <div className="mb-4">
                                    <h3 className="h6 fw-bold text-dark mb-1">
                                        📍 Retiro en Tienda
                                    </h3>
                                    <p className="text-secondary m-0">
                                        Monseñor Miller 22-B
                                        <br />
                                        Providencia, Región Metropolitana
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="h6 fw-bold text-dark mb-1">
                                        ✉️ Correo Electrónico
                                    </h3>
                                    <p className="text-secondary m-0">
                                        contacto@rectabags.cl
                                        <br />
                                        soporte@rectabags.cl
                                    </p>
                                </div>

                                <div className="mb-5">
                                    <h3 className="h6 fw-bold text-dark mb-1">
                                        ⏱️ Horario de Atención
                                    </h3>
                                    <p className="text-secondary m-0">
                                        Lunes a Viernes: 10:00 - 18:30
                                        <br />
                                        Sábados: 10:00 - 14:00
                                    </p>
                                </div>

                                <hr className="border-secondary mb-4" />

                                <h3 className="h6 fw-bold text-dark mb-3">
                                    Síguenos
                                </h3>

                                <div className="d-flex gap-3">
                                    <a
                                        href="https://www.instagram.com/rectabags"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: "45px", height: "45px" }}
                                        aria-label="Instagram"
                                    >
                                        <img
                                            src="/img/RRSS/icons8-instagram-50.png"
                                            alt="Instagram"
                                            style={{ width: "20px", filter: "invert(1)" }}
                                        />
                                    </a>

                                    <a
                                        href="https://www.tiktok.com/@rectabags"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: "45px", height: "45px" }}
                                        aria-label="TikTok"
                                    >
                                        <img
                                            src="/img/RRSS/icons8-tiktok-50.png"
                                            alt="TikTok"
                                            style={{ width: "20px", filter: "invert(1)" }}
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de contacto */}
                    <div className="col-lg-7">
                        <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 bg-white">
                            <div className="card-body">

                                <h2 className="h4 fw-bold mb-4">
                                    Envíanos un mensaje
                                </h2>

                                <form id="form-contacto" onSubmit={envio}>
                                    <div className="row g-4">

                                        {/* Nombre */}
                                        <div className="col-md-6">
                                            <label htmlFor="nombre" className="form-label fw-semibold">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control  py-2"
                                                id="nombre"
                                                name="nombre"
                                                maxLength={100}
                                                placeholder="Tu nombre"
                                                value={datos.nombre}
                                                onChange={cambio}
                                                required
                                            />
                                        </div>

                                        {/* Correo */}
                                        <div className="col-md-6">
                                            <label htmlFor="correo" className="form-label fw-semibold">
                                                Correo Electrónico
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control  py-2"
                                                id="correo"
                                                name="correo"
                                                maxLength={100}
                                                placeholder="ejemplo@gmail.com"
                                                value={datos.correo}
                                                onChange={cambio}
                                                required
                                            />
                                        </div>

                                        {/* cuadro mensaje*/}
                                        <div className="col-12">
                                            <label htmlFor="asunto" className="form-label fw-semibold">
                                                Asunto
                                            </label>
                                            <select
                                                className="form-select  py-2"
                                                id="asunto"
                                                name="asunto"
                                                value={datos.asunto}
                                                onChange={cambio}
                                                required
                                            >
                                                <option value="" disabled>
                                                    Selecciona un motivo...
                                                </option>
                                                <option value="dudas">Dudas sobre un producto</option>
                                                <option value="envios">Información de envíos</option>
                                                <option value="garantia">Garantías y devoluciones</option>
                                                <option value="otro">Otro</option>
                                            </select>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="mensaje" className="form-label fw-semibold">
                                                Mensaje
                                            </label>
                                            <textarea
                                                className="form-control  py-2"
                                                id="mensaje"
                                                name="mensaje"
                                                rows={5}
                                                maxLength={500}
                                                placeholder="¿En qué te podemos ayudar?"
                                                value={datos.mensaje}
                                                onChange={cambio}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-dark w-100 py-3 rounded-4 fw-bold"
                                            >
                                                Enviar Mensaje
                                            </button>
                                        </div>

                                    </div>
                                </form>

                                {error && <div className="alert alert-danger mt-4" role="alert">{error}</div>}

                                {enviado && (

                                    <div
                                        className="alert alert-success mt-4"
                                        role="status"
                                    >
                                        Tu mensaje fue registrado correctamente en esta demostración.
                                    </div>

                                )}

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

export default Contacto;
