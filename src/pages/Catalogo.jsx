import {
    useState
} from "react";

import {
    useSearchParams
} from "react-router-dom";

import {
    productos
} from "../data/productos";

import ProductCard
    from "../components/products/ProductCard";

import ProductFilter
    from "../components/products/ProductFilter";

import useTitulo
    from "../hooks/useTitulo";

import "../css/style_catalogo.css";


function Catalogo() {

    useTitulo(
        "Explora nuestro catálogo | Rectabags"
    );


    const [
        categoria,
        setCategoria
    ] = useState("todos");


    const [
        searchParams,
        setSearchParams
    ] = useSearchParams();


    const busqueda =
        searchParams.get(
            "buscar"
        ) || "";


    const textoBusqueda =
        busqueda
            .toLowerCase()
            .trim();


    function cambiarBusqueda(
        evento
    ) {

        const valor =
            evento.target.value;


        if (!valor.trim()) {

            setSearchParams({});

            return;

        }


        setSearchParams({
            buscar:
                valor
        });

    }


    const productosFiltrados =
        productos.filter(
            (producto) => {

                const coincideCategoria =
                    categoria === "todos" ||
                    producto.categoria ===
                        categoria;


                const coincideBusqueda =
                    producto.nombre
                        .toLowerCase()
                        .includes(
                            textoBusqueda
                        );


                return (
                    coincideCategoria &&
                    coincideBusqueda
                );

            }
        );


    return (

        <section className="catalogo-page py-5">

            <div className="container">

                <h1 className="fw-bold text-center mb-5">
                    Catálogo
                </h1>


                <div className="catalogo-search mb-4">

                    <input
                        type="search"
                        className="form-control"
                        placeholder="Buscar productos..."
                        aria-label="Buscar productos"
                        value={busqueda}
                        onChange={
                            cambiarBusqueda
                        }
                    />

                </div>


                <ProductFilter
                    categoria={categoria}
                    onCategoriaChange={
                        setCategoria
                    }
                />


                <div className="row g-4">

                    {
                        productosFiltrados.length === 0 && (

                            <div className="col-12">

                                <p className="text-center text-secondary py-5">

                                    No se encontraron productos.

                                </p>

                            </div>

                        )
                    }


                    {
                        productosFiltrados.map(
                            (producto) => (

                                <div
                                    className="col-12 col-md-6 col-lg-4"
                                    key={
                                        producto.id
                                    }
                                >

                                    <ProductCard
                                        producto={
                                            producto
                                        }
                                    />

                                </div>

                            )
                        )
                    }

                </div>

            </div>

        </section>

    );

}


export default Catalogo;