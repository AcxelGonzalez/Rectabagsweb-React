import {
    Link,
    Navigate,
    useLocation
} from "react-router-dom";

import useTitulo
    from "../hooks/useTitulo";

import {
    leerCompraPorId
} from "../services/compraService";


function CompraExitosa() {

    useTitulo(
        "Compra exitosa | Rectabags"
    );


    const location =
        useLocation();


    const compraId =
        location.state?.compraId;


    const compra =
        leerCompraPorId(
            compraId
        );


    if (!compraId || !compra) {

        return (
            <Navigate
                to="/catalogo"
                replace
            />
        );

    }


    function formatearPrecio(
        valor
    ) {

        return Number(
            valor
        ).toLocaleString(
            "es-CL",
            {
                style:
                    "currency",
                currency:
                    "CLP",
                maximumFractionDigits:
                    0
            }
        );

    }


    return (

        <section className="py-5">

            <div className="container">

                <div className="row justify-content-center text-center">

                    <div className="col-lg-7">

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-5">

                                <div className="display-4 mb-3">
                                    ✓
                                </div>


                                <h1 className="fw-bold mb-3">
                                    Compra realizada correctamente
                                </h1>


                                <p className="text-secondary">
                                    Tu pedido fue registrado correctamente en nuestra tienda.
                                </p>


                                <div className="bg-light rounded-4 p-4 my-4 text-start">

                                    <p className="mb-2">

                                        <strong>
                                            Número de compra:
                                        </strong>{" "}

                                        {compra.id}

                                    </p>


                                    <p className="mb-2">

                                        <strong>
                                            Productos:
                                        </strong>{" "}

                                        {
                                            compra.cantidadProductos
                                        }

                                    </p>


                                    <p className="mb-0">

                                        <strong>
                                            Total productos:
                                        </strong>{" "}

                                        {
                                            formatearPrecio(
                                                compra.subtotal
                                            )
                                        }

                                    </p>


                                    <p className="small text-secondary mt-3 mb-0">

                                        El despacho se coordinará posteriormente según los datos ingresados en la compra.

                                    </p>

                                </div>


                                <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">

                                    <Link
                                        to="/"
                                        className="btn btn-outline-dark"
                                    >
                                        Volver al inicio
                                    </Link>


                                    <Link
                                        to="/catalogo"
                                        className="btn btn-dark"
                                    >
                                        Seguir comprando
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


export default CompraExitosa;