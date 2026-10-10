import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo";
import SeccionRedes
    from "../components/SeccionRedes";

import "../css/style_home.css";

function Home() {
    useTitulo("Bienvenido a RectaBags");
    return (
        <>
            <section className="hero-section d-flex align-items-end">
                
                <div className="container mb-5">
                    <div className="hero-content text-white">
                    
                        <h2 className="display-4 fw-bold mb-1">La mochila perfecta</h2>
                        <p className="fs-5">para viajar, trabajar y explorar</p>
                    </div>
                </div>
            </section>

        
            <section className="productos-section py-5">
                <div className="container">
                <h2 className="text-center fw-bold mb-5 text-uppercase ">
                    Explora nuestros productos
                </h2>


                    <div className="row align-items-center text-center text-md-start">
                        <div className="col-md-3 mb-4 mb-md-0">

                            <h3 className="fw-bold text-uppercase  lh-sm">
                                Selecciona el que mejor se ajuste a tus necesidades
                            </h3>
                        </div>
                        
                        <div className="col-md-7 mb-4 mb-md-0">
                        
                            <div className="row g-2">
                            
                                <div className="col-3">
                                    
                                    <img src="/img/HOME/image 7.png" alt="Explora 1" className="img-fluid w-100 h-100 object-fit-cover rounded-3"/>
                                </div>
                                <div className="col-3">
                                    <img src="/img/HOME/image 9.png" alt="Explora 2" className="img-fluid w-100 h-100 object-fit-cover rounded-3"/>
                                </div>
                                <div className="col-3">
                                    <img src="/img/HOME/image 8.png" alt="Explora 3" className="img-fluid w-100 h-100 object-fit-cover rounded-3"/>
                                </div>
                                <div className="col-3">
                                    <img src="/img/HOME/image 10.png" alt="Explora 4" className="img-fluid w-100 h-100 object-fit-cover rounded-3"/>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2 text-center text-md-end">
                        <Link
                            to="/catalogo"
                            className="btn btn-secondary px-4 py-2"
                        >
                            Ver más ➔
                        </Link>
                        </div>
                    </div>
                </div>
            </section>  

            <SeccionRedes />
            
        </>
    );
}

export default Home;