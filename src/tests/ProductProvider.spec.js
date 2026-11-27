import React, { act } from "react";

import { createRoot } from "react-dom/client";

import { vi } from "vitest";

import ProductProvider from "../context/ProductProvider";

import useProducts from "../hooks/useProducts";

import api from "../services/api";

/* Se reemplaza axios por un "backend falso": ninguna prueba toca el servidor real */
vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
}));


/* El catálogo compartido, sus operaciones con el backend y el manejo del stock */
describe("ProductProvider", () => {

    let contenedor;
    let raiz;
    let productosApi;

    // "Base de datos" del backend falso (formato real de Spring Boot)
    let productosServidor;

    const categoriasServidor = [
        { idCategoria: 1, nombre: "Mochilas" },
        { idCategoria: 2, nombre: "Cilindros" },
        { idCategoria: 3, nombre: "Musette" }
    ];

    function crearCatalogoServidor() {

        return [
            {
                idProducto: 1,
                codigo: "RC-30",
                nombre: "RC-30",
                categoria: categoriasServidor[0],
                precio: "45000.00",
                precioOferta: null,
                stock: 10,
                stockCritico: 3,
                descripcion: "Mochila rolltop para uso urbano.",
                imagen: "/img/test.png"
            },
            {
                idProducto: 2,
                codigo: "CL-10",
                nombre: "Cilindro CL-10",
                categoria: categoriasServidor[1],
                precio: "25000.00",
                precioOferta: "20000.00",
                stock: 4,
                stockCritico: null,
                descripcion: "Bolso cilindro resistente al agua.",
                imagen: "/img/test.png"
            }
        ];

    }


    function datosValidos(cambios) {

        return {
            codigo: "MU-05",
            nombre: "Musette MU-05",
            idCategoria: 3,
            precio: 18000,
            precioOferta: "",
            stock: 7,
            stockCritico: "",
            descripcion: "Bolso musette liviano para el día a día.",
            imagen: "",
            ...cambios
        };

    }


    function errorDelBackend(mensaje) {

        return { response: { data: { mensaje } } };

    }


    function ConsumidorPrueba() {

        productosApi = useProducts();

        return React.createElement(
            "div",
            { id: "total-productos" },
            String(productosApi.totalProductos)
        );

    }


    async function renderizarProductos() {

        await act(async () => {

            raiz.render(
                React.createElement(
                    ProductProvider,
                    null,
                    React.createElement(ConsumidorPrueba)
                )
            );

        });

    }


    beforeAll(() => {
        globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    });


    beforeEach(() => {

        productosServidor = crearCatalogoServidor();

        productosApi = null;

        vi.clearAllMocks();

        // GET: devuelve lo que haya en el "servidor"
        api.get.mockImplementation(async (ruta) => {

            if (ruta === "/categorias") {
                return { data: categoriasServidor };
            }

            return { data: productosServidor };

        });

        // POST: agrega un producto
        api.post.mockImplementation(async (ruta, cuerpo) => {

            const nuevo = {
                idProducto: 100,
                ...cuerpo,
                categoria: categoriasServidor.find(
                    (c) => c.idCategoria === cuerpo.idCategoria
                )
            };

            productosServidor.push(nuevo);

            return { data: nuevo };

        });

        // PUT: modifica un producto
        api.put.mockImplementation(async (ruta, cuerpo) => {

            const id = Number(ruta.split("/").pop());

            const actual = productosServidor.find(
                (p) => p.idProducto === id
            );

            const editado = { ...actual, ...cuerpo };

            productosServidor = productosServidor.map(
                (p) => (p.idProducto === id ? editado : p)
            );

            return { data: editado };

        });

        // DELETE: quita el producto de la lista pública
        api.delete.mockImplementation(async (ruta) => {

            const id = Number(ruta.split("/").pop());

            productosServidor = productosServidor.filter(
                (p) => p.idProducto !== id
            );

            return { data: null };

        });

        contenedor = document.createElement("div");

        document.body.appendChild(contenedor);

        raiz = createRoot(contenedor);

    });


    afterEach(() => {

        act(() => {
            raiz.unmount();
        });

        contenedor.remove();

    });


    afterAll(() => {
        delete globalThis.IS_REACT_ACT_ENVIRONMENT;
    });


    describe("carga desde el backend", () => {

        it("debe pedir los productos y las categorías al backend", async () => {

            await renderizarProductos();

            expect(api.get).toHaveBeenCalledWith("/productos");
            expect(api.get).toHaveBeenCalledWith("/categorias");

        });

        it("debe cargar los productos que responde el backend", async () => {

            await renderizarProductos();

            expect(productosApi.totalProductos).toBe(2);

        });

        it("debe cargar las categorías", async () => {

            await renderizarProductos();

            expect(productosApi.categorias.length).toBe(3);

        });

        it("debe convertir el producto al formato que usa la tienda", async () => {

            await renderizarProductos();

            const producto = productosApi.obtenerProducto(2);

            expect(producto.id).toBe(2);
            expect(producto.categoria).toBe("cilindros");
            expect(producto.idCategoria).toBe(2);
            expect(producto.precio).toBe(25000);
            expect(producto.precioOferta).toBe(20000);

        });

        it("debe mostrar el total de productos en el componente", async () => {

            await renderizarProductos();

            expect(contenedor.textContent).toBe("2");

        });

        it("debe terminar de cargar al recibir los datos", async () => {

            await renderizarProductos();

            expect(productosApi.cargando).toBe(false);
            expect(productosApi.errorCarga).toBeNull();

        });

        it("debe avisar cuando no hay conexión con el servidor", async () => {

            api.get.mockRejectedValue(new Error("Network Error"));

            await renderizarProductos();

            expect(productosApi.totalProductos).toBe(0);
            expect(productosApi.cargando).toBe(false);
            expect(productosApi.errorCarga).toContain("No se pudo conectar");

        });

    });


    it("permite recuperar categorías tras un error sin confundirlo con una lista vacía", async () => {
        api.get.mockRejectedValue(new Error("Network Error"));
        await renderizarProductos();
        expect(productosApi.cargandoCategorias).toBe(false);
        expect(productosApi.errorCategorias).toContain("No se pudo conectar");
        api.get.mockResolvedValue({ data: categoriasServidor });
        await act(async () => productosApi.cargarCategorias());
        expect(productosApi.errorCategorias).toBeNull();
        expect(productosApi.categorias).toEqual(categoriasServidor);
    });

    describe("lectura", () => {

        beforeEach(async () => {
            await renderizarProductos();
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

        beforeEach(async () => {
            await renderizarProductos();
        });

        it("debe enviar el producto al backend con POST /productos", async () => {

            await act(async () => {
                await productosApi.crearProducto(datosValidos());
            });

            expect(api.post).toHaveBeenCalledTimes(1);

            const [ruta, cuerpo] = api.post.mock.calls[0];

            expect(ruta).toBe("/productos");
            expect(cuerpo.codigo).toBe("MU-05");
            expect(cuerpo.idCategoria).toBe(3);
            expect(cuerpo.precioOferta).toBeNull();

        });

        it("debe agregar el producto al estado", async () => {

            let resultado;

            await act(async () => {
                resultado = await productosApi.crearProducto(datosValidos());
            });

            expect(resultado.ok).toBe(true);
            expect(productosApi.totalProductos).toBe(3);

        });

        it("debe actualizar el total que muestra el componente", async () => {

            await act(async () => {
                await productosApi.crearProducto(datosValidos());
            });

            expect(contenedor.textContent).toBe("3");

        });

        it("debe mostrar el mensaje del backend cuando los datos son inválidos", async () => {

            api.post.mockRejectedValueOnce(
                errorDelBackend("El código ya existe")
            );

            let resultado;

            await act(async () => {
                resultado = await productosApi.crearProducto(datosValidos());
            });

            expect(resultado.ok).toBe(false);
            expect(resultado.mensaje).toBe("El código ya existe");
            expect(productosApi.totalProductos).toBe(2);

        });

    });


    describe("UPDATE - actualizarProducto", () => {

        beforeEach(async () => {
            await renderizarProductos();
        });

        it("debe enviar el cambio al backend con PUT /productos/{id}", async () => {

            await act(async () => {
                await productosApi.actualizarProducto(1, datosValidos());
            });

            expect(api.put).toHaveBeenCalledTimes(1);
            expect(api.put.mock.calls[0][0]).toBe("/productos/1");

        });

        it("debe cambiar los datos del producto indicado", async () => {

            let resultado;

            await act(async () => {
                resultado = await productosApi.actualizarProducto(
                    1,
                    datosValidos({ precio: 49990 })
                );
            });

            expect(resultado.ok).toBe(true);
            expect(productosApi.obtenerProducto(1).precio).toBe(49990);

        });

        it("debe avisar cuando el backend no encuentra el producto", async () => {

            api.put.mockRejectedValueOnce(
                errorDelBackend("Producto no encontrado")
            );

            let resultado;

            await act(async () => {
                resultado = await productosApi.actualizarProducto(
                    99,
                    datosValidos()
                );
            });

            expect(resultado.ok).toBe(false);
            expect(resultado.mensaje).toContain("no encontrado");

        });

    });


    describe("DELETE - eliminarProducto", () => {

        beforeEach(async () => {
            await renderizarProductos();
        });

        it("debe pedir el borrado al backend con DELETE /productos/{id}", async () => {

            await act(async () => {
                await productosApi.eliminarProducto(1);
            });

            expect(api.delete).toHaveBeenCalledWith("/productos/1");

        });

        it("debe quitar el producto del estado", async () => {

            let resultado;

            await act(async () => {
                resultado = await productosApi.eliminarProducto(1);
            });

            expect(resultado.ok).toBe(true);
            expect(productosApi.totalProductos).toBe(1);

        });

        it("no debe borrar nada cuando el backend responde error", async () => {

            api.delete.mockRejectedValueOnce(
                errorDelBackend("Producto no encontrado")
            );

            let resultado;

            await act(async () => {
                resultado = await productosApi.eliminarProducto(99);
            });

            expect(resultado.ok).toBe(false);
            expect(productosApi.totalProductos).toBe(2);

        });

    });


    describe("stock de productos", () => {

        beforeEach(async () => {
            await renderizarProductos();
        });


        it("debe verificar stock sin modificar el catálogo", () => {

            const resultado = productosApi.verificarDisponibilidad([
                { id: 1, cantidad: 3 }
            ]);

            expect(resultado.ok).toBe(true);
            expect(productosApi.obtenerProducto(1).stock).toBe(10);

        });


        it("debe detectar cuando no existe stock suficiente sin modificarlo", () => {

            const resultado = productosApi.verificarDisponibilidad([
                { id: 2, cantidad: 10 }
            ]);

            expect(resultado.ok).toBe(false);
            expect(productosApi.obtenerProducto(2).stock).toBe(4);

        });


        it("debe descontar el stock cuando existe disponibilidad", () => {

            let resultado;

            act(() => {
                resultado = productosApi.descontarStock([
                    { id: 1, cantidad: 3 }
                ]);
            });

            expect(resultado.ok).toBe(true);
            expect(productosApi.obtenerProducto(1).stock).toBe(7);

        });


        it("no debe modificar el stock cuando la cantidad solicitada supera la disponible", () => {

            let resultado;

            act(() => {
                resultado = productosApi.descontarStock([
                    { id: 2, cantidad: 10 }
                ]);
            });

            expect(resultado.ok).toBe(false);
            expect(productosApi.obtenerProducto(2).stock).toBe(4);

        });


        it("debe reponer el stock de una compra cancelada", () => {

            act(() => {
                productosApi.reponerStock([
                    { id: 1, cantidad: 3 }
                ]);
            });

            expect(productosApi.obtenerProducto(1).stock).toBe(13);

        });

    });


    describe("restaurarProductos", () => {

        it("debe volver a pedir los productos al backend", async () => {

            await renderizarProductos();

            api.get.mockClear();

            let resultado;

            await act(async () => {
                resultado = await productosApi.restaurarProductos();
            });

            expect(resultado.ok).toBe(true);
            expect(api.get).toHaveBeenCalledWith("/productos");
            expect(productosApi.totalProductos).toBe(2);

        });

    });

});
