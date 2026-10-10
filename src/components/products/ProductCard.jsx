import { Link } from "react-router-dom";

function ProductCard({producto}) {

    const precioFormateado = producto.precio.toLocaleString("es-CL",
            {
                style: "currency",
                currency: "CLP"
            }
        );

    return (

        <article className="card product-card h-100 border-0 shadow-sm">

            <img src={producto.imagen}className="card-img-top product-card__image"alt={producto.nombre}/>

            <div className="card-body d-flex flex-column">

                <h3 className="h5 fw-bold">{producto.nombre}</h3>

                <p className="fw-bold">{precioFormateado}</p>

                <p className="card-text flex-grow-1">{producto.descripcion}</p>

                <Link to={`/producto/${producto.id}`} className="btn btn-dark mt-auto">
                    Ver producto
                </Link>

            </div>

        </article>

    );

}

export default ProductCard;