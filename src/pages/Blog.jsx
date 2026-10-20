import useTitulo from '../hooks/useTitulo';

// Artículo destacado de la parte superior
const destacado = {
    imagen: 'carretera_austral.jpg',
    alt: 'Carretera Austral Bikepacking',
    categoria: 'Rutas Épicas',
    titulo: 'Carretera Austral: Guía de equipaje para 1.200 km',
    resumen:
        'Descubre los secretos, el equipo estrictamente necesario y cómo distribuir el peso en tus bolsos de manillar y sillín para enfrentarte a la ruta más emblemática del sur de Chile sin morir en el intento.',
};

// Artículos de la rejilla: para agregar uno nuevo basta con sumar un objeto aquí
const articulos = [
    {
        id: 1,
        imagen: 'como-lavar-mochilha.jpg',
        alt: 'Tutorial empaque',
        categoria: 'Tutoriales',
        titulo: '¿Cómo lavar y cuidar tu mochila rolltop?',
        resumen:
            'Prolonga la vida útil de la cordura y mantén la impermeabilidad de tu Rectabags con estos sencillos pasos de limpieza en casa.',
    },
    {
        id: 2,
        imagen: 'descargar.jpg',
        alt: 'Comunidad',
        categoria: 'Comunidad',
        titulo: 'Entrevista: 5.000 km pedaleando por Sudamérica',
        resumen:
            "Conversamos con Caro y Felipe sobre su travesía cruzando fronteras y cómo nuestra 'Mochila RC-30' aguantó el clima tropical.",
    },
    {
        id: 3,
        imagen: 'chest-bag-vs-sling-bag.webp',
        alt: 'Equipamiento',
        categoria: 'Equipamiento',
        titulo: 'Musette vs Bandolera: ¿Cuál elegir para la ciudad?',
        resumen:
            'Si tu ruta es del trabajo a la casa, analizamos las ventajas de ambos formatos para que pedalees cómodo y con estilo.',
    },
];

function Blog() {
    useTitulo('Noticias | Rectabags');

    return (
        <div className="py-5">
            <div className="container py-4">

                {/* Título principal de la sección */}
                <div className="row mb-5 text-center text-md-start">
                    <div className="col-12">
                        <h1 className="display-4 fw-bold titulo-mono text-dark mb-2">Bitácora Ciclista</h1>
                        <p className="fs-5 text-secondary">Rutas, tutoriales de bikepacking y noticias de la comunidad.</p>
                    </div>
                </div>

                {/* ================= ARTÍCULO DESTACADO ================= */}
                <div className="card border-0 rounded-4 shadow-sm mb-5 overflow-hidden" style={{ backgroundColor: '#E8DED8' }}>
                    <div className="row g-0 align-items-center">
                        <div className="col-lg-7">
                            <img
                                src={`/img/BLOG/${destacado.imagen}`}
                                alt={destacado.alt}
                                className="img-fluid w-100 h-100 object-fit-cover"
                                style={{ minHeight: '350px' }}
                            />
                        </div>
                        <div className="col-lg-5 p-4 p-md-5">
                            <span className="badge bg-dark text-white rounded-pill px-3 py-2 mb-3 fw-bold">{destacado.categoria}</span>
                            <h2 className="h1 fw-bold text-dark mb-3 titulo-mono">{destacado.titulo}</h2>
                            <p className="text-secondary mb-4 lh-lg">{destacado.resumen}</p>
                            <button
                                type="button"
                                className="btn btn-dark px-4 py-2 rounded-0 fw-bold"
                                disabled
                            >
                                Artículo próximamente
                            </button>
                        </div>
                    </div>
                </div>

                {/* ================= REJILLA DE ARTÍCULOS ================= */}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {articulos.map((articulo) => (
                        <div className="col" key={articulo.id}>
                            <div className="card border-0 rounded-4 shadow-sm h-100 d-flex flex-column">
                                <img
                                    src={`/img/BLOG/${articulo.imagen}`}
                                    alt={articulo.alt}
                                    className="card-img-top rounded-top-4 object-fit-cover"
                                    style={{ height: '220px' }}
                                />
                                <div className="card-body d-flex flex-column flex-grow-1 p-4">
                                    <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-3 py-2 mb-3 align-self-start">
                                        {articulo.categoria}
                                    </span>
                                    <h3 className="h5 fw-bold text-dark mb-2">{articulo.titulo}</h3>
                                    <p className="small text-secondary flex-grow-1 mb-4">{articulo.resumen}</p>
                                    <button
                                        type="button"
                                        className="btn btn-link text-dark fw-bold text-decoration-underline p-0 text-start mt-auto"
                                        disabled
                                    >
                                        Artículo próximamente
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Blog;
