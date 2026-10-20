import {
    Link,
    useLocation
} from "react-router-dom";

import useTitulo
    from "../hooks/useTitulo";


function CompraError() {

    useTitulo(
        "Error en la compra | Rectabags"
    );


    const location =
        useLocation();


    const mensaje =
        location.state?.mensaje ||
        "Ocurrió un problema al procesar la compra.";


    return (

        <section className="py-5">

            <div className="container">

                <div className="row justify-content-center text-center">

                    <div className="col-lg-7">

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-5">

                                <div className="display-4 mb-3">
                                    !
                                </div>


                                <h1 className="fw-bold mb-3">
                                    No pudimos completar la compra
                                </h1>


                                <p className="text-secondary">
                                    {mensaje}
                                </p>


                                <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">

                                    <Link
                                        to="/carrito"
                                        className="btn btn-outline-dark"
                                    >
                                        Volver al carrito
                                    </Link>


                                    <Link
                                        to="/checkout"
                                        className="btn btn-dark"
                                    >
                                        Intentar nuevamente
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}


export default CompraError;