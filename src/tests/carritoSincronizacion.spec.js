import { precioVigente, sincronizarCarrito } from "../utils/carrito";


/*
 * Pruebas de la sincronización del carrito con el catálogo
 */

function catalogoDePrueba(cambios = {}) {

    return [
        {
            id: 1,
            nombre: "RC-30",
            precio: 45000,
            imagen: "/img/rc30.png",
            stock: 10,
            ...cambios
        },
        {
            id: 2,
            nombre: "Cilindro CL-10",
            precio: 25000,
            imagen: "/img/cl10.png",
            stock: 4
        }
    ];

}


function carritoDePrueba() {

    return [
        {
            id: 1,
            nombre: "RC-30",
            precio: 45000,
            imagen: "/img/rc30.png",
            cantidad: 2,
            stock: 10
        }
    ];

}


describe("Sincronización del carrito con el catálogo", () => {

    describe("precioVigente", () => {

        it("debe usar el precio normal cuando no hay oferta", () => {
            expect(precioVigente({ precio: 45000 })).toBe(45000);
        });

        it("debe usar el precio de oferta cuando es menor", () => {
            expect(precioVigente({ precio: 18000, precioOferta: 14990 })).toBe(14990);
        });

        it("debe ignorar una oferta mayor que el precio normal", () => {
            expect(precioVigente({ precio: 18000, precioOferta: 20000 })).toBe(18000);
        });

    });


    describe("sin cambios en el catálogo", () => {

        it("no debe informar cambios", () => {

            const r = sincronizarCarrito(carritoDePrueba(), catalogoDePrueba());

            expect(r.huboCambios).toBeFalse();
            expect(r.cambios.length).toBe(0);

        });

        it("debe devolver el mismo arreglo para no provocar renderizados", () => {

            const carrito = carritoDePrueba();
            const r = sincronizarCarrito(carrito, catalogoDePrueba());

            expect(r.carrito).toBe(carrito);

        });

    });


    describe("cambio de precio", () => {

        it("debe actualizar el precio del ítem", () => {

            const r = sincronizarCarrito(
                carritoDePrueba(),
                catalogoDePrueba({ precio: 55000 })
            );

            expect(r.huboCambios).toBeTrue();
            expect(r.carrito[0].precio).toBe(55000);

        });

        it("debe informar el precio anterior y el nuevo", () => {

            const r = sincronizarCarrito(
                carritoDePrueba(),
                catalogoDePrueba({ precio: 55000 })
            );

            const aviso = r.cambios.find((c) => c.tipo === "precio");

            expect(aviso.anterior).toBe(45000);
            expect(aviso.nuevo).toBe(55000);

        });

        it("no debe modificar el carrito original (función pura)", () => {

            const carrito = carritoDePrueba();

            sincronizarCarrito(carrito, catalogoDePrueba({ precio: 55000 }));

            expect(carrito[0].precio).toBe(45000);

        });

        it("debe tomar el precio de oferta cuando el administrador la agrega", () => {

            const r = sincronizarCarrito(
                carritoDePrueba(),
                catalogoDePrueba({ precioOferta: 39990 })
            );

            expect(r.carrito[0].precio).toBe(39990);

        });

    });


    describe("cambios de stock", () => {

        it("debe recortar la cantidad cuando el stock bajó", () => {

            const r = sincronizarCarrito(
                carritoDePrueba(),
                catalogoDePrueba({ stock: 1 })
            );

            expect(r.carrito[0].cantidad).toBe(1);
            expect(r.cambios.some((c) => c.tipo === "stock")).toBeTrue();

        });

        it("debe quitar el producto cuando quedó sin stock", () => {

            const r = sincronizarCarrito(
                carritoDePrueba(),
                catalogoDePrueba({ stock: 0 })
            );

            expect(r.carrito.length).toBe(0);
            expect(r.cambios[0].tipo).toBe("agotado");

        });

        it("debe actualizar el stock guardado en el ítem", () => {

            const r = sincronizarCarrito(
                carritoDePrueba(),
                catalogoDePrueba({ stock: 7 })
            );

            expect(r.carrito[0].stock).toBe(7);

        });

    });


    describe("producto eliminado del catálogo", () => {

        it("debe quitarlo del carrito", () => {

            const soloElSegundo = catalogoDePrueba().filter((p) => p.id === 2);

            const r = sincronizarCarrito(carritoDePrueba(), soloElSegundo);

            expect(r.carrito.length).toBe(0);
            expect(r.cambios[0].tipo).toBe("eliminado");

        });

    });


    describe("otros datos del producto", () => {

        it("debe actualizar el nombre y la imagen sin avisar al cliente", () => {

            const r = sincronizarCarrito(
                carritoDePrueba(),
                catalogoDePrueba({ nombre: "RC-30 Pro", imagen: "/img/nueva.png" })
            );

            expect(r.carrito[0].nombre).toBe("RC-30 Pro");
            expect(r.carrito[0].imagen).toBe("/img/nueva.png");
            expect(r.cambios.length).toBe(0);

        });

    });


    describe("casos límite", () => {

        it("debe tolerar un carrito vacío", () => {
            expect(sincronizarCarrito([], catalogoDePrueba()).carrito.length).toBe(0);
        });

        it("debe tolerar valores que no son arreglos", () => {
            expect(sincronizarCarrito(null, null).carrito.length).toBe(0);
        });

    });

});