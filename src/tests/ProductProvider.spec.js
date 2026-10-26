import React, {
    act
} from "react";

import {
    createRoot
} from "react-dom/client";

import ProductProvider
    from "../context/ProductProvider";

import useProducts
    from "../hooks/useProducts";


/*
 * Pruebas del ProductProvider: estado, persistencia en localStorage
 * y las operaciones CRUD que usa el panel de administración.
 */

describe("ProductProvider", () => {

    const CLAVE_PRODUCTOS = "recta_productos";

    let contenedor;
    let raiz;
    let productosApi;


    // Catálogo reducido para no depender de los 9 productos reales.
    const catalogoPrueba = [
        {
            id: 1,
            nombre: "RC-30",
            categoria: "mochilas",
            precio: 45000,
            descripcion: "Mochila rolltop para uso urbano.",
            descripcionCompleta: "Mochila rolltop de 30 litros.",
            imagen: "/img/test.png",
            stock: 10
        },
        {
            id: 2,
            nombre: "Cilindro CL-10",
            categoria: "cilindros",
            precio: 25000,
            descripcion: "Bolso cilindro resistente al agua.",
            descripcionCompleta: "Bolso cilindro de 10 litros.",
            imagen: "/img/test.png",
            stock: 4
        }
    ];


    function datosValidos(cambios) {

        return {
            nombre: "Musette MU-05",
            categoria: "musette",
            precio: 18000,
            descripcion: "Bolso musette liviano para el día a día.",
            stock: 7,
            ...cambios
        };

    }


    function ConsumidorPrueba() {

        productosApi = useProducts();

        return React.createElement(
            "div",
            { id: "total-productos" },
            String(productosApi.totalProductos)
        );

    }


    function renderizarProductos() {

        act(() => {

            raiz.render(
                React.createElement(
                    ProductProvider,
                    null,
                    React.createElement(ConsumidorPrueba)
                )
            );

        });

    }


    // Deja el catálogo de prueba en localStorage antes de montar.
    function guardarCatalogoPrueba() {

        localStorage.setItem(
            CLAVE_PRODUCTOS,
            JSON.stringify(catalogoPrueba)
        );

    }


    function leerCatalogoGuardado() {

        return JSON.parse(
            localStorage.getItem(CLAVE_PRODUCTOS)
        );

    }


    beforeAll(() => {
        globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    });


    beforeEach(() => {

        localStorage.clear();

        productosApi = null;

        contenedor = document.createElement("div");

        document.body.appendChild(contenedor);

        raiz = createRoot(contenedor);

    });


    afterEach(() => {

        act(() => {
            raiz.unmount();
        });

        contenedor.remove();

        localStorage.clear();

    });


    afterAll(() => {
        delete globalThis.IS_REACT_ACT_ENVIRONMENT;
    });


    describe("estado inicial y persistencia", () => {

        it("debe cargar el catálogo inicial cuando no hay nada guardado", () => {

            renderizarProductos();

            expect(productosApi.productos.length).toBeGreaterThan(0);

        });

        it("debe cargar los productos guardados en localStorage", () => {

            guardarCatalogoPrueba();
            renderizarProductos();

            expect(productosApi.totalProductos).toBe(2);

        });

        it("debe usar el catálogo inicial si los datos guardados están dañados", () => {

            localStorage.setItem(CLAVE_PRODUCTOS, "{dato-roto");
            renderizarProductos();

            expect(productosApi.productos.length).toBeGreaterThan(0);

        });

        it("debe mostrar el total de productos en el componente", () => {

            guardarCatalogoPrueba();
            renderizarProductos();

            expect(contenedor.textContent).toBe("2");

        });

    });


    describe("lectura", () => {

        beforeEach(() => {
            guardarCatalogoPrueba();
            renderizarProductos();
        });

        it("debe encontrar un producto por su id en formato texto", () => {
            expect(productosApi.obtenerProducto("1").nombre).toBe("RC-30");
        });

        it("debe devolver null cuando el producto no existe", () => {
            expect(productosApi.obtenerProducto(99)).toBeNull();
        });

        it("debe filtrar los productos por categoría", () => {
            expect(productosApi.obtenerPorCategoria("cilindros").length).toBe(1);
        });

    });


    describe("CREATE - crearProducto", () => {

        beforeEach(() => {
            guardarCatalogoPrueba();
            renderizarProductos();
        });

        it("debe agregar el producto al estado", () => {

            let resultado;

            act(() => {
                resultado = productosApi.crearProducto(datosValidos());
            });

            expect(resultado.ok).toBeTrue();
            expect(productosApi.totalProductos).toBe(3);

        });

        it("debe guardar el producto nuevo en localStorage", () => {

            act(() => {
                productosApi.crearProducto(datosValidos());
            });

            expect(leerCatalogoGuardado().length).toBe(3);

        });

        it("debe actualizar el total que muestra el componente", () => {

            act(() => {
                productosApi.crearProducto(datosValidos());
            });

            expect(contenedor.textContent).toBe("3");

        });

        it("no debe agregar nada cuando los datos son inválidos", () => {

            let resultado;

            act(() => {
                resultado = productosApi.crearProducto(
                    datosValidos({ precio: -100 })
                );
            });

            expect(resultado.ok).toBeFalse();
            expect(productosApi.totalProductos).toBe(2);

        });

    });


    describe("UPDATE - actualizarProducto", () => {

        beforeEach(() => {
            guardarCatalogoPrueba();
            renderizarProductos();
        });

        it("debe cambiar los datos del producto indicado", () => {

            let resultado;

            act(() => {
                resultado = productosApi.actualizarProducto(1, { precio: 49990 });
            });

            expect(resultado.ok).toBeTrue();
            expect(productosApi.obtenerProducto(1).precio).toBe(49990);

        });

        it("debe guardar el cambio en localStorage", () => {

            act(() => {
                productosApi.actualizarProducto(1, { stock: 2 });
            });

            expect(leerCatalogoGuardado()[0].stock).toBe(2);

        });

        it("debe avisar cuando el producto no existe", () => {

            let resultado;

            act(() => {
                resultado = productosApi.actualizarProducto(99, { precio: 1000 });
            });

            expect(resultado.ok).toBeFalse();
            expect(resultado.mensaje).toContain("No se encontró");

        });

    });


    describe("DELETE - eliminarProducto", () => {

        beforeEach(() => {
            guardarCatalogoPrueba();
            renderizarProductos();
        });

        it("debe quitar el producto del estado", () => {

            let resultado;

            act(() => {
                resultado = productosApi.eliminarProducto(1);
            });

            expect(resultado.ok).toBeTrue();
            expect(productosApi.totalProductos).toBe(1);

        });

        it("debe guardar la lista sin el producto en localStorage", () => {

            act(() => {
                productosApi.eliminarProducto(1);
            });

            expect(leerCatalogoGuardado().length).toBe(1);

        });

        it("no debe borrar nada cuando el producto no existe", () => {

            let resultado;

            act(() => {
                resultado = productosApi.eliminarProducto(99);
            });

            expect(resultado.ok).toBeFalse();
            expect(productosApi.totalProductos).toBe(2);

        });

    });


    describe("restaurarProductos", () => {

        it("debe volver al catálogo original", () => {

            guardarCatalogoPrueba();
            renderizarProductos();

            act(() => {
                productosApi.restaurarProductos();
            });

            expect(productosApi.totalProductos).toBeGreaterThan(2);

        });

    });

});