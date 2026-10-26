import useProducts from "../hooks/useProducts";
import useTitulo from "../hooks/useTitulo";
import ProductCard from "../components/products/ProductCard";
import "../css/style_catalogo.css";

function Ofertas() {

    useTitulo("Ofertas | Rectabags");

    const { productos } = useProducts();

    // Solo productos con un precio de oferta menor al precio normal
    const productosEnOferta = productos.filter(
        (producto) =>
            producto.precioOferta &&
            producto.precioOferta < producto.precio
    );

    return (

        <section className="catalogo-page py-5">

            <div className="container">

                <h1 className="fw-bold text-center mb-2">
                    Ofertas
                </h1>

                <p className="text-center text-secondary mb-5">
                    Productos con precio rebajado.
                </p>

                <div className="row g-4">

                    {productosEnOferta.length === 0 && (
                        <div className="col-12">
                            <p className="text-center text-secondary py-5">
                                Por ahora no hay productos en oferta.
                            </p>
                        </div>
                    )}

                    {productosEnOferta.map((producto) => (
                        <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                            <ProductCard producto={producto} />
                        </div>
                    ))}

                </div>

            </div>

        </section>

    );

}

export default Ofertas;