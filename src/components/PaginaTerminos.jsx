import { Link } from 'react-router-dom';

// Estructura común de "Términos de compra" y "Términos y condiciones".
// Lo que cambia entre una y otra llega por props.
function PaginaTerminos({
    titulo,          // h1 de la parte superior
    subtitulo,       // texto bajo el h1
    tituloCaja,      // h2 dentro de la tarjeta
    intro,           // párrafo de introducción (puede incluir etiquetas, por eso es JSX)
    secciones,       // arreglo de { titulo, texto }
    rutaVolver,      // a dónde lleva el botón negro
    textoVolver,     // texto del botón negro
    preguntaAyuda,   // frase antes del enlace de contacto
    textoEnlaceAyuda // texto del enlace de contacto
}) {
    return (
        <section className="login-section d-flex align-items-center py-5">
            <div className="container">

                {/* Títulos superiores */}
                <div className="row mb-5 text-center">
                    <div className="col-12">
                        <h1 className="display-5 titulo-mono mb-2">{titulo}</h1>
                        <p className="fs-5 text-dark fw-light">{subtitulo}</p>
                    </div>
                </div>

                {/* Contenedor de los términos */}
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
                            <div className="card-body p-0">

                                <h2 className="titulo-mono h3 mb-4 text-start">{tituloCaja}</h2>

                                <div className="contenido-terminos text-secondary lh-base" style={{ fontSize: '0.95rem' }}>

                                    <p className="mb-4">{intro}</p>

                                    <hr className="my-4 border-secondary-subtle" />

                                    {secciones.map((seccion) => (
                                        <div key={seccion.titulo}>
                                            <h3 className="h6 fw-bold text-dark text-uppercase mb-2">{seccion.titulo}</h3>
                                            <p className="mb-4">{seccion.texto}</p>
                                        </div>
                                    ))}

                                </div>

                                {/* Botón volver centrado */}
                                <div className="text-center mt-5">
                                    <Link to={rutaVolver} className="btn btn-dark rounded-3 px-4 py-2 titulo-mono fs-6 text-decoration-none">
                                        {textoVolver}
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer de navegación */}
                <div className="text-center mt-4">
                    <p className="fw-bold text-secondary">
                        {preguntaAyuda} | <Link to="/contacto" className="text-secondary text-decoration-none fw-normal">{textoEnlaceAyuda}</Link>
                    </p>
                </div>

            </div>
        </section>
    );
}

export default PaginaTerminos;
