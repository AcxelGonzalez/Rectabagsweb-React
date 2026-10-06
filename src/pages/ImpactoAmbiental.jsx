import { Link } from 'react-router-dom';
import useTitulo from '../hooks/useTitulo';

// Los 3 pilares de la marca
const pilares = [
    {
        titulo: 'Confección cero desperdicio',
        texto: 'Optimizamos los patrones de corte para reutilizar los sobrantes de tela impermeable en straps, estuches pequeños y accesorios secundarios.',
    },
    {
        titulo: 'Larga vida útil',
        texto: 'Nos alejamos del Retail y la producción masiva. Cada bolso está pensado para durar años, con materiales de alta resistencia y costuras reforzadas.',
    },
    {
        titulo: 'Producción local',
        texto: 'Fabricamos íntegramente en Santiago de Chile, minimizando la huella de carbono asociada al transporte masivo intercontinental.',
    },
];

// Métricas del recuadro negro
const metricas = [
    { valor: '0%', texto: 'Plásticos de un solo uso en empaques' },
    { valor: '100%', texto: 'Fabricación local y taller propio' },
    { valor: '+5 años', texto: 'Vida útil promediada por producto' },
    { valor: '-CO₂', texto: 'Impulso directo al pedal urbano' },
];

function ImpactoAmbiental() {
    useTitulo('Impacto Ambiental | Rectabags');

    return (
        // En el HTML original la clase bg-light estaba en el <body>; aquí va en este contenedor
        <div className="bg-light" style={{ paddingTop: '100px' }}>

            {/* ENCABEZADO */}
            <section className="py-5 bg-white border-bottom">
                <div className="container text-center">
                    <h1 className="display-5 fw-bold text-uppercase titulo-pesado mb-3">Compromiso y Huella Verde</h1>
                    <p className="lead text-secondary mx-auto" style={{ maxWidth: '750px' }}>
                        En Rectabags entendemos la bicicleta como una herramienta de transformación urbana y ambiental. Diseñamos equipamiento creado para durar y reducir el desperdicio.
                    </p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">

                    {/* Tarjetas principales */}
                    <div className="row g-4 mb-5">
                        {pilares.map((pilar) => (
                            <div className="col-md-4" key={pilar.titulo}>
                                <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
                                    <h3 className="h5 fw-bold text-dark mb-2">{pilar.titulo}</h3>
                                    <p className="text-secondary small mb-0">{pilar.texto}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recuadro negro con métricas */}
                    <div className="bg-black text-white rounded-4 p-5 shadow mb-5">
                        <div className="row text-center g-4">
                            {metricas.map((metrica) => (
                                <div className="col-6 col-md-3" key={metrica.valor}>
                                    <h2 className="display-6 fw-bold text-uppercase titulo-pesado mb-1">{metrica.valor}</h2>
                                    <p className="text-secondary-light small mb-0">{metrica.texto}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Banner inferior */}
                    <div className="bg-white rounded-4 p-4 p-md-5 border shadow-sm text-center">
                        <h3 className="fw-bold text-uppercase titulo-pesado mb-2">armarte es el primer paso</h3>
                        <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                            Equípate con accesorios diseñados para tus necesidades.
                        </p>
                        <Link to="/catalogo" className="btn btn-dark px-4 py-2 text-white text-decoration-none fw-bold">
                            Ver Catálogo
                        </Link>
                    </div>

                </div>
            </section>

        </div>
    );
}

export default ImpactoAmbiental;
