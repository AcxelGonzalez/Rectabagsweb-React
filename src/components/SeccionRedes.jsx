// Fotos de Instagram que se muestran en la sección
const fotos = ['image 5.png', 'image 11.png', 'image 12.png', 'image 4.png'];

function SeccionRedes() {
    return (
        <section className="redes-section bg-black text-white py-5">
            <div className="container">
                <div className="row align-items-center">

                    <div className="col-md-4 mb-4 mb-md-0">
                        <h2 className="fw-bold text-uppercase titulo-pesado">Síguenos en redes</h2>

                        <div className="d-flex align-items-center gap-3 mb-3 mt-4">
                            <a href="https://www.instagram.com/rectabags" target="_blank" rel="noopener noreferrer">
                                <img src="/img/RRSS/icons8-instagram-50.png" alt="Instagram" className="icono-nav"/>
                            </a>
                            <p className="fs-5 m-0">@rectabags</p>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <a href="https://www.tiktok.com/@rectabags" target="_blank" rel="noopener noreferrer">
                                <img src="/img/RRSS/icons8-tiktok-50.png" alt="TikTok" className="icono-nav"/>
                            </a>
                            <p className="fs-5 m-0">@rectabags</p>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="row g-2">
                            {fotos.map((foto, i) => (
                                <div className="col-6 col-md-3" key={foto}>
                                    <img src={`/img/RRSS/${foto}`} alt={`Instagram ${i + 1}`} className="img-fluid" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default SeccionRedes;
