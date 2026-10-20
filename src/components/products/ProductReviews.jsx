function ProductReviews({
    nombre,
    rating,
    opiniones
}) {

    if (
        rating === undefined ||
        !opiniones?.length
    ) {

        return null;

    }


    return (

        <div>

            <h2 className="h5 fw-bold mb-3">
                Opiniones de {nombre}
            </h2>


            <div className="d-flex align-items-center gap-2 mb-3">

                <span className="display-6 fw-bold">

                    {
                        rating.toLocaleString(
                            "es-CL",
                            {
                                minimumFractionDigits: 1,
                                maximumFractionDigits: 1
                            }
                        )
                    }

                </span>


                <span
                    className="text-warning fs-4"
                    aria-label={`${rating} de 5 estrellas`}
                >
                    ★★★★★
                </span>

            </div>


            <div className="d-flex flex-column gap-2">

                {
                    opiniones.map(
                        (opinion) => (

                            <div
                                key={
                                    opinion.estrellas
                                }
                                className="d-flex align-items-center gap-2 small"
                            >

                                <div
                                    className="progress flex-grow-1"
                                    role="progressbar"
                                    aria-label={`${opinion.estrellas} estrellas`}
                                    aria-valuenow={
                                        opinion.porcentaje
                                    }
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >

                                    <div
                                        className="progress-bar bg-secondary"
                                        style={{
                                            width:
                                                `${opinion.porcentaje}%`
                                        }}
                                    />

                                </div>


                                <span className="producto-opinion-label">
                                    {opinion.estrellas} ★
                                </span>

                            </div>

                        )
                    )
                }

            </div>

        </div>

    );

}


export default ProductReviews;