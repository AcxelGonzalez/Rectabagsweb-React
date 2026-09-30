import React from 'react';
import { Link } from 'react-router-dom';

function QuienesSomos() {
    return (

        <main className="py-4">
        
            <section className="py-5 bg-white border-bottom">
                <div className="container text-center">
                    <h1 className="display-5 fw-bold text-uppercase titulo-pesado mb-3">Quiénes Somos</h1>
                    <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>
                        Diseñamos y confeccionamos equipamiento de alta resistencia pensado por y para la comunidad ciclista urbana.
                    </p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="row g-4 align-items-center mb-5">
                        <div className="col-md-6">
                            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border h-100">
                                <h2 className="h3 fw-bold text-uppercase titulo-pesado mb-3">Nuestro Origen</h2>
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
                                <div className="col-12">
                                    <div className="bg-white p-4 rounded-4 shadow-sm border">
                                        <h3 className="h5 fw-bold text-dark mb-1">Durabilidad</h3>
                                        <p className="text-secondary small mb-0">Materiales seleccionados que resisten la fricción, la lluvia y el peso diario.</p>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="bg-white p-4 rounded-4 shadow-sm border">
                                        <h3 className="h5 fw-bold text-dark mb-1">Diseño Funcional</h3>
                                        <p className="text-secondary small mb-0">Sistemas de ajuste rápido adaptados a múltiples tipos de marcos y manubrios.</p>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="bg-white p-4 rounded-4 shadow-sm border">
                                        <h3 className="h5 fw-bold text-dark mb-1">Hecho a Mano</h3>
                                        <p className="text-secondary small mb-0">Proceso artesanal detallado en Santiago de Chile garantizando estándar técnico.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    <div className="bg-black text-white rounded-4 p-5 text-center shadow mb-5">
                        <h2 className="h3 fw-bold text-uppercase titulo-pesado mb-3">¿Buscas el bolso ideal para tu bicicleta?</h2>
                        <p className="text-secondary-light mb-4">Revisa nuestras líneas de Mochilas, cilindros accesorios y todo lo que necesitas.</p>
                        <Link to="/Catalogo" className="btn btn-secondary px-4 py-2 text-white text-decoration-none fw-bold">
                            Explorar Catálogo ➔
                        </Link>
                    </div>
                </div>
            </section>

            {/* RRSS*/}
            <section className="redes-section bg-black text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        
                        <div className="col-md-4 mb-4 mb-md-0">
                            <h2 className="fw-bold text-uppercase titulo-pesado">Síguenos en redes</h2>
                            
                            <div className="d-flex align-items-center gap-3 mb-3 mt-4">
                                <a href="https://www.instagram.com/rectabags" target="_blank" rel="noopener noreferrer">
                                    <img src="/img/RRSS/icons8-instagram-50.png" alt="Instagram" className="icono-nav" />
                                </a>
                                <p className="fs-5 m-0">@rectabags</p>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <a href="https://www.tiktok.com/@rectabags" target="_blank" rel="noopener noreferrer">
                                    <img src="/img/RRSS/icons8-tiktok-50.png" alt="TikTok" className="icono-nav" />
                                </a>
                                <p className="fs-5 m-0">@rectabags</p>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <div className="row g-2">
                                <div className="col-6 col-md-3">
                                    <img src="/img/RRSS/image 5.png" alt="Instagram 1" className="img-fluid" />
                                </div>
                                <div className="col-6 col-md-3">
                                    <img src="/img/RRSS/image 11.png" alt="Instagram 2" className="img-fluid" />
                                </div>
                                <div className="col-6 col-md-3">
                                    <img src="/img/RRSS/image 12.png" alt="Instagram 3" className="img-fluid" />
                                </div>
                                <div className="col-6 col-md-3">
                                    <img src="/img/RRSS/image 4.png" alt="Instagram 4" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>

        </main>
    );
}

export default QuienesSomos;