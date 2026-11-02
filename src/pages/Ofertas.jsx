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

        <section className="catalogo-page pb-5">

            {/* Banda negra con el título (mismo estilo que el Catálogo) */}
            <div className="catalogo-banda text-white text-center py-5 mb-5">
                <h1 className="mb-2">
                    Ofertas
                </h1>
                <p className="mb-0">
                    {productosEnOferta.length} {productosEnOferta.length === 1 ? "producto rebajado" : "productos rebajados"} por tiempo limitado
                </p>
            </div>

            <div className="container">

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