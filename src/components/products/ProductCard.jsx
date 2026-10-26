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
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                    Oferta
                </span>
            )}

            <img src={producto.imagen} className="card-img-top product-card__image" alt={producto.nombre} />

            <div className="card-body d-flex flex-column">

                <h3 className="h5 fw-bold">{producto.nombre}</h3>

                {tieneOferta ? (
                    <p className="fw-bold">
                        <span className="text-decoration-line-through text-secondary fw-normal me-2">
                            {formatearPrecio(producto.precio)}
                        </span>
                        <span className="text-danger">
                            {formatearPrecio(producto.precioOferta)}
                        </span>
                    </p>
                ) : (
                    <p className="fw-bold">{formatearPrecio(producto.precio)}</p>
                )}

                <p className="card-text flex-grow-1">{producto.descripcion}</p>

                <Link to={`/producto/${producto.id}`} className="btn btn-dark mt-auto">
                    Ver producto
                </Link>

            </div>

        </article>

    );

}

export default ProductCard;