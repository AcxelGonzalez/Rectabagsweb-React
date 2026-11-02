import { Link } from "react-router-dom";

function formatearPrecio(valor) {
    return valor.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}

function ProductCard({ producto }) {

    const tieneOferta =
        producto.precioOferta &&
        producto.precioOferta < producto.precio;

    return (

        <article className="card product-card h-100 border-0 shadow-sm">

            {tieneOferta && (
                <span className="badge badge-oferta position-absolute top-0 start-0 m-2">
                    Oferta
                </span>
            )}

            {/* Contenedor para que el zoom de la foto no se salga de la tarjeta */}
            <div className="product-card__imagen-contenedor">
                <img src={producto.imagen} className="card-img-top product-card__image" alt={producto.nombre} />
            </div>

            <div className="card-body d-flex flex-column">

                <span className="product-card__categoria">
                    {producto.categoria}
                </span>

                <h3 className="h5 fw-bold mb-1">{producto.nombre}</h3>

                {tieneOferta ? (
                    <p className="product-card__precio">
                        <span className="text-decoration-line-through text-secondary fw-normal fs-6 me-2">
                            {formatearPrecio(producto.precio)}
                        </span>
                        <span className="precio-oferta">
                            {formatearPrecio(producto.precioOferta)}
                        </span>
                    </p>
                ) : (
                    <p className="product-card__precio">{formatearPrecio(producto.precio)}</p>
                )}

                <p className="card-text text-secondary flex-grow-1">{producto.descripcion}</p>

                <Link to={`/producto/${producto.id}`} className="btn btn-dark mt-auto">
                    Ver producto
                </Link>

            </div>

        </article>

    );

}

export default ProductCard;