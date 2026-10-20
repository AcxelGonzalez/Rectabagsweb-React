import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productos } from "../data/productos";
import ProductGallery from "../components/products/ProductGallery";
import CantidadSelector from "../components/products/CantidadSelector";
import ProductReviews from "../components/products/ProductReviews";
import useCart from "../hooks/useCart";
import useTitulo from "../hooks/useTitulo";
import "../css/style_producto_detalle.css";
import { obtenerStockValido } from "../utils/stock";

function ProductoDetalle() {

    const { id } = useParams();

    const [ cantidad, setCantidad ] = useState(1);

    const {
        agregarProducto
    } = useCart();

    const producto = productos.find( (item) => item.id === Number(id));

    useTitulo(
        producto
            ? `${producto.nombre} | Rectabags`
            : "Producto no encontrado | Rectabags"
    );

    if (!producto) {

        return (
            <section className="container text-center py-5">
                <h1 className="fw-bold">
                    Producto no encontrado
                </h1>

                <p className="text-secondary">
                    El producto solicitado no existe.
                </p>

                <Link to="/catalogo" className="btn btn-dark"          >
                    Volver al catálogo
                </Link>
            </section>
        );
    }

    const precioFormateado =
        producto.precio.toLocaleString("es-CL",
            {
                style: "currency",
                currency: "CLP"
            }
        );


    const imagenes =producto.imagenes?.length? producto.imagenes: [producto.imagen];

    const maximoCantidad =
        obtenerStockValido(
            producto.stock
        );


    const sinStock =
        maximoCantidad === 0;

function manejarAgregarCarrito() {

    const agregado =
        agregarProducto(
            producto,
            cantidad
        );


    if (!agregado) {

        alert(
            "Este producto no tiene stock disponible."
        );

        return;

    }


    alert(
        "Producto añadido al carrito"
    );

}

    const tieneInformacionAdicional =
        producto.imagenDetalle ||
        producto.medidas?.length ||
        producto.rating !== undefined;

    return (

        <main className="producto-detalle-page py-5">

            <div className="container">

                {/* PRODUCTO PRINCIPAL */}

                <section className="producto-panel rounded-5 p-3 p-md-4 shadow-sm mb-5">
                    <div className="row g-4 align-items-start">

                        {/* GALERÍA */}

                        <div className="col-12 col-lg-7">
                            <ProductGallery key={producto.id} imagenes={imagenes} nombre={producto.nombre}/>
                        </div>


                        {/* INFORMACIÓN */}

                        <div className="col-12 col-lg-5">

                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 mb-2">
                                {producto.categoria}
                            </span>


                            <h1 className="h2 fw-bold text-dark mb-1">
                                {producto.nombre}
                            </h1>

                            <p className="display-6 fw-bold text-dark mb-4">
                                {precioFormateado}
                            </p>

                            {/* DESCRIPCIÓN */}

                            <div className="bg-white rounded-4 p-3 mb-3 shadow-sm">

                                <h2 className="h6 fw-bold mb-2">
                                    Descripción
                                </h2>

                                <p className="small text-secondary m-0">
                                    {producto.descripcionCompleta}
                                </p>

                            </div>

                            {/* CANTIDAD */}

                            {
                                sinStock ? (

                                    <div
                                        className="alert alert-warning mb-3"
                                        role="alert"
                                    >
                                        Producto actualmente sin stock.
                                    </div>

                                ) : (

                                    <div className="d-flex flex-column flex-sm-row gap-2 mb-3">

                                        <CantidadSelector
                                            cantidad={cantidad}
                                            onCambiar={setCantidad}
                                            maximo={maximoCantidad}
                                        />


                                        <button
                                            type="button"
                                            className="
                                                btn
                                                btn-dark
                                                flex-grow-1
                                                rounded-4
                                                fw-bold
                                            "
                                            onClick={
                                                manejarAgregarCarrito
                                            }
                                        >
                                            Añadir al carrito
                                        </button>

                                    </div>

                                )
                            }

                            {
                                producto.stock !== undefined && (

                                    <p
                                        className={
                                            sinStock
                                                ? "small text-danger fw-bold"
                                                : "small"
                                        }
                                    >

                                        <strong>
                                            Stock disponible:
                                        </strong>{" "}

                                        {maximoCantidad}

                                    </p>

                                )
                            }

                            {/* MEDIDAS */}

                            {
                                producto.medidas?.length > 0 && (

                                    <div className="bg-white rounded-4 p-3 shadow-sm">
                                        <h2 className="h6 fw-bold mb-2">
                                            Medidas
                                        </h2>

                                        <ul className="list-unstyled small text-secondary m-0">

                                            {
                                                producto.medidas.map((medida) => (
                                                        <li key={medida}>{medida}</li>
                                                    )
                                                )
                                            }

                                        </ul>
                                    </div>

                                )
                            }

                            <div className="mt-4">
                                <Link to="/catalogo" className="text-dark">
                                    ← Volver al catálogo
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* INFORMACIÓN COMPLEMENTARIA */}

                {
                    tieneInformacionAdicional && (

                        <section className="producto-panel rounded-5 p-3 p-md-4 shadow-sm">

                            <div className="row g-4">

                                {
                                    (
                                        producto.imagenDetalle ||
                                        producto.medidas?.length > 0
                                    ) && (

                                        <div className="col-12 col-md-5 col-lg-4">
                                            <div className="bg-white rounded-4 p-3 h-100 shadow-sm">
                                                <h2 className="h5 fw-bold">
                                                    {producto.nombre}
                                                </h2>

                                                {
                                                    producto.imagenDetalle && (
                                                        <img src={producto.imagenDetalle}
                                                            alt={`${producto.nombre} - detalle`}
                                                            className="producto-resumen-imagen rounded-3 my-3"/>
                                                    )
                                                }

                                                {
                                                    producto.medidas?.length > 0 && (

                                                        <div className="small text-secondary border-top pt-3">

                                                            <p className="fw-bold text-dark mb-1">
                                                                Medidas:
                                                            </p>

                                                            {
                                                                producto.medidas.map((medida) => (

                                                                        <p key={medida} className="mb-1">
                                                                            {medida}
                                                                        </p>
                                                                    )
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }

                                {
                                    producto.rating !== undefined &&
                                    producto.opiniones?.length > 0 && (

                                        <div className="col-12 col-md-7 col-lg-8">

                                            <div className="bg-white rounded-4 p-3 p-md-4 h-100 shadow-sm">

                                                <ProductReviews
                                                    nombre={producto.nombre}
                                                    rating={producto.rating}
                                                    opiniones={producto.opiniones}
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </section>
                    )
                }
            </div>
        </main>
    );

}

export default ProductoDetalle;