import { Link } from 'react-router-dom';
import SeccionRedes from '../components/SeccionRedes';
import useTitulo from '../hooks/useTitulo';

// Tarjetas de valores de la marca
const valores = [
    {
        titulo: 'Durabilidad',
        texto: 'Materiales seleccionados que resisten la fricción, la lluvia y el peso diario.',
    },
    {
        titulo: 'Diseño Funcional',
        texto: 'Sistemas de ajuste rápido adaptados a múltiples tipos de marcos y manubrios.',
    },
    {
        titulo: 'Hecho a Mano',
        texto: 'Proceso artesanal detallado en Santiago de Chile garantizando estándar técnico.',
    },
];

function QuienesSomos() {
    useTitulo('Quiénes Somos | Rectabags');

    return (
        // En el HTML original la clase bg-light estaba en el <body>; aquí va en este contenedor
        <div className="bg-light">

            {/* ENCABEZADO SECCIÓN */}
            <section className="py-5 bg-white border-bottom">
                <div className="container text-center">
                    <h1 className="display-5 fw-bold text-uppercase mb-3">Quiénes Somos</h1>
                    <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>
                        Diseñamos y confeccionamos equipamiento de alta resistencia pensado por y para la comunidad ciclista urbana.
                    </p>
                </div>
            </section>

            {/* HISTORIA Y VALORES */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-4 align-items-center mb-5">
                        <div className="col-md-6">
                            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border h-100">
                                <h2 className="h3 fw-bold text-uppercase mb-3">Nuestro Origen</h2>
                                <p className="text-secondary mb-3">
                                    Rectabags nace de la necesidad real en la ruta: contar con productos funcionales y capaces de resistir el uso diario en la ciudad y competitivo.
                                </p>
                                <p className="text-secondary m-0">
                                    Apostamos por la confección local y consciente, puliendo cada detalle de agarre, costura y materiales impermeables para acompañarte en cada viaje.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="row g-3">
                                {valores.map((valor) => (
                                    <div className="col-12" key={valor.titulo}>
                                        <div className="bg-white p-4 rounded-4 shadow-sm border">
                                            <h3 className="h5 fw-bold text-dark mb-1">{valor.titulo}</h3>
                                            <p className="text-secondary small mb-0">{valor.texto}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BANNER CATÁLOGO */}
                    <div className="bg-black text-white rounded-4 p-5 text-center shadow mb-5">
                        <h2 className="h3 fw-bold text-uppercase  mb-3">¿Buscas el bolso ideal para tu bicicleta?</h2>
                        <p className="text-secondary mb-4">Revisa nuestras líneas de Mochilas, cilindros accesorios y todo lo que necesitas.</p>
                        <Link to="/catalogo" className="btn btn-secondary px-4 py-2 text-white text-decoration-none fw-bold">
                            Explorar Catálogo ➔
                        </Link>
                    </div>
                </div>
            </section>

            {/* REDES SOCIALES */}
            <SeccionRedes />

        </div>
    );
}

export default QuienesSomos;
