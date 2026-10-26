import {
    siguienteId,
    obtenerProductoPorId,
    obtenerProductosPorCategoria,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from "../data/productos";


/*
 * Pruebas del CRUD de productos (capa de datos).
 *
 * Se trabaja sobre una lista de prueba pequeña y controlada, que se
 * vuelve a crear antes de cada prueba para que ninguna dependa de lo
 * que hizo la anterior.
 */

function crearListaDePrueba() {

    return [
        {
            id: 1,
            nombre: "RC-30",
            categoria: "mochilas",
            precio: 45000,
            descripcion: "Mochila rolltop para uso urbano.",
            descripcionCompleta: "Mochila rolltop de 30 litros para viajes cortos.",
            imagen: "/img/Mochila RC-30/MOCHILA_MAIN.png",
            stock: 10
        },
        {
            id: 2,
            nombre: "Cilindro CL-10",
            categoria: "cilindros",
            precio: 25000,
            descripcion: "Bolso cilindro resistente al agua.",
            descripcionCompleta: "Bolso cilindro de 10 litros resistente al agua.",
            imagen: "/img/cilindro.png",
            stock: 4
        }
    ];

}


// Datos válidos de un producto nuevo, usados como punto de partida.
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


describe("CRUD de productos (capa de datos)", () => {

    let lista;

    beforeEach(() => {
        lista = crearListaDePrueba();
    });


    describe("siguienteId", () => {

        it("debe partir en 1 cuando la lista está vacía", () => {
            expect(siguienteId([])).toBe(1);
        });

        it("debe devolver el id mayor más uno", () => {
            expect(siguienteId(lista)).toBe(3);
        });

    });


    describe("READ - obtenerProductoPorId", () => {

        it("debe encontrar el producto aunque el id llegue como texto", () => {

            const producto = obtenerProductoPorId(lista, "2");

            expect(producto.nombre).toBe("Cilindro CL-10");

        });

        it("debe devolver null cuando el producto no existe", () => {
            expect(obtenerProductoPorId(lista, 99)).toBeNull();
        });

    });


    describe("READ - obtenerProductosPorCategoria", () => {

        it("debe devolver todos los productos con la categoría 'todos'", () => {
            expect(obtenerProductosPorCategoria(lista, "todos").length).toBe(2);
        });

        it("debe filtrar solamente los productos de la categoría pedida", () => {

            const resultado = obtenerProductosPorCategoria(lista, "mochilas");

            expect(resultado.length).toBe(1);
            expect(resultado[0].nombre).toBe("RC-30");

        });

    });


    describe("CREATE - crearProducto", () => {

        it("debe agregar el producto y asignarle el id siguiente", () => {

            const resultado = crearProducto(lista, datosValidos());

            expect(resultado.ok).toBeTrue();
            expect(resultado.productos.length).toBe(3);
            expect(resultado.producto.id).toBe(3);

        });

        it("no debe modificar la lista original (función pura)", () => {

            crearProducto(lista, datosValidos());

            expect(lista.length).toBe(2);

        });

        it("debe usar la descripción corta cuando no se envía la completa", () => {

            const resultado = crearProducto(lista, datosValidos());

            expect(resultado.producto.descripcionCompleta)
                .toBe(datosValidos().descripcion);

        });

        it("debe rechazar un producto sin nombre", () => {

            const resultado = crearProducto(
                lista,
                datosValidos({ nombre: "" })
            );

            expect(resultado.ok).toBeFalse();
            expect(resultado.productos.length).toBe(2);

        });

        it("debe rechazar un precio menor o igual a cero", () => {

            const resultado = crearProducto(
                lista,
                datosValidos({ precio: 0 })
            );

            expect(resultado.ok).toBeFalse();
            expect(resultado.mensaje).toContain("precio");

        });

        it("debe rechazar una categoría que no existe", () => {

            const resultado = crearProducto(
                lista,
                datosValidos({ categoria: "zapatos" })
            );

            expect(resultado.ok).toBeFalse();

        });

        it("debe rechazar un nombre que ya está en uso", () => {

            const resultado = crearProducto(
                lista,
                datosValidos({ nombre: "rc-30" })
            );

            expect(resultado.ok).toBeFalse();
            expect(resultado.mensaje).toBe("Ya existe un producto con ese nombre.");

        });

    });


    describe("UPDATE - actualizarProducto", () => {

        it("debe actualizar solamente el producto indicado", () => {

            const resultado = actualizarProducto(lista, 1, { precio: 49990 });

            expect(resultado.ok).toBeTrue();
            expect(resultado.productos[0].precio).toBe(49990);
            expect(resultado.productos[1].precio).toBe(25000);

        });

        it("debe mantener los campos que no se envían en los cambios", () => {

            const resultado = actualizarProducto(lista, 1, { stock: 3 });

            expect(resultado.producto.nombre).toBe("RC-30");
            expect(resultado.producto.stock).toBe(3);

        });

        it("no debe modificar la lista original (función pura)", () => {

            actualizarProducto(lista, 1, { precio: 1 });

            expect(lista[0].precio).toBe(45000);

        });

        it("debe avisar cuando el producto no existe", () => {

            const resultado = actualizarProducto(lista, 99, { precio: 1000 });

            expect(resultado.ok).toBeFalse();
            expect(resultado.mensaje).toContain("No se encontró");

        });

        it("debe rechazar el cambio si deja datos inválidos", () => {

            const resultado = actualizarProducto(lista, 1, { stock: -4 });

            expect(resultado.ok).toBeFalse();

        });

        it("debe rechazar el nombre de otro producto existente", () => {

            const resultado = actualizarProducto(
                lista,
                1,
                { nombre: "Cilindro CL-10" }
            );

            expect(resultado.ok).toBeFalse();

        });

        it("debe permitir guardar el producto con su mismo nombre", () => {

            const resultado = actualizarProducto(
                lista,
                1,
                { nombre: "RC-30", precio: 46000 }
            );

            expect(resultado.ok).toBeTrue();

        });

    });


    describe("DELETE - eliminarProducto", () => {

        it("debe quitar el producto de la lista", () => {

            const resultado = eliminarProducto(lista, 1);

            expect(resultado.ok).toBeTrue();
            expect(resultado.productos.length).toBe(1);
            expect(resultado.productos[0].id).toBe(2);

        });

        it("no debe modificar la lista original (función pura)", () => {

            eliminarProducto(lista, 1);

            expect(lista.length).toBe(2);

        });

        it("debe avisar cuando el producto no existe", () => {

            const resultado = eliminarProducto(lista, 99);

            expect(resultado.ok).toBeFalse();
            expect(resultado.productos.length).toBe(2);

        });

    });

});