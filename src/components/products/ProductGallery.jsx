import {
    useState
} from "react";


function ProductGallery({
    imagenes,
    nombre
}) {

    const [
        imagenPrincipal,
        setImagenPrincipal
    ] = useState(
        imagenes[0]
    );

    return (

        <div
            className="
                producto-galeria
                d-flex
                flex-column-reverse
                flex-lg-row
                gap-3
            "
        >

            <div
                className="
                    producto-miniaturas
                    d-flex
                    flex-row
                    flex-lg-column
                    gap-2
                    overflow-auto
                    flex-shrink-0
                "
            >

                {
                    imagenes.map(
                        (imagen, indice) => (

                            <button
                                key={imagen}
                                type="button"
                                className={
                                    `
                                    producto-miniatura
                                    btn
                                    p-0
                                    rounded-4
                                    overflow-hidden
                                    flex-shrink-0
                                    ${
                                        imagenPrincipal === imagen
                                            ? "active"
                                            : ""
                                    }
                                    `
                                }
                                onClick={
                                    () =>
                                        setImagenPrincipal(
                                            imagen
                                        )
                                }
                                aria-label={
                                    `Ver imagen ${indice + 1} de ${nombre}`
                                }
                            >

                                <img
                                    src={imagen}
                                    alt={
                                        `${nombre} - vista ${indice + 1}`
                                    }
                                />

                            </button>

                        )
                    )
                }

            </div>


            <div
                className="
                    producto-imagen-principal
                    bg-white
                    rounded-4
                    overflow-hidden
                    flex-grow-1
                "
            >

                <img
                    src={imagenPrincipal}
                    alt={nombre}
                />

            </div>

        </div>

    );

}


export default ProductGallery;