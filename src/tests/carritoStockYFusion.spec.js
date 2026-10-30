import { fusionarCarritos, verificarStock } from "../utils/carrito";


/*
 * Pruebas de las dos funciones puras que protegen la compra:
 - verificarStock: revisa que el catálogo alcance para el carrito, justo antes de registrar la compra
 - fusionarCarritos: une el carrito de invitado con el del usuario cuando alguien inicia sesión.
 */

function catalogoDePrueba(cambios = {}) {

    return [
        { id: 1, nombre: "RC-30", precio: 45000, stock: 10, ...cambios },
        { id: 2, nombre: "Cilindro CL-10", precio: 25000, stock: 4 }
    ];

}

function itemCarrito(cambios = {}) {

    return {
        id: 1,
        nombre: "RC-30",
        precio: 45000,
        cantidad: 2,
        stock: 10,
        ...cambios
    };

}


describe("verificarStock", () => {

    describe("cuando el stock alcanza", () => {

        it("debe aprobar la compra", () => {

            const r = verificarStock([itemCarrito()], catalogoDePrueba());

            expect(r.ok).toBe(true);

        });

        it("no debe informar faltantes ni mensaje", () => {

            const r = verificarStock([itemCarrito()], catalogoDePrueba());

            expect(r.faltantes.length).toBe(0);
            expect(r.mensaje).toBe("");

        });

        it("debe aprobar cuando se pide exactamente el stock disponible", () => {

            const r = verificarStock(
                [itemCarrito({ cantidad: 10 })],
                catalogoDePrueba()
            );

            expect(r.ok).toBe(true);

        });

    });


    describe("cuando el stock no alcanza", () => {

        it("debe rechazar la compra", () => {

            const r = verificarStock(
                [itemCarrito({ cantidad: 5 })],
                catalogoDePrueba({ stock: 2 })
            );

            expect(r.ok).toBe(false);

        });

        it("debe informar cuánto se pidió y cuánto queda", () => {

            const r = verificarStock(
                [itemCarrito({ cantidad: 5 })],
                catalogoDePrueba({ stock: 2 })
            );

            expect(r.faltantes[0].pedido).toBe(5);
            expect(r.faltantes[0].disponible).toBe(2);

        });

        it("debe armar un mensaje con el nombre y las cantidades", () => {

            const r = verificarStock(
                [itemCarrito({ cantidad: 5 })],
                catalogoDePrueba({ stock: 2 })
            );

            expect(r.mensaje).toContain("RC-30");
            expect(r.mensaje).toContain("2");
            expect(r.mensaje).toContain("5");

        });

        it("debe avisar de forma distinta cuando el producto quedó agotado", () => {

            const r = verificarStock(
                [itemCarrito()],
                catalogoDePrueba({ stock: 0 })
            );

            expect(r.ok).toBe(false);
            expect(r.faltantes[0].texto).toContain("sin stock");

        });

        it("debe rechazar cuando el producto ya no está en el catálogo", () => {

            const soloElSegundo = catalogoDePrueba().filter((p) => p.id === 2);

            const r = verificarStock([itemCarrito()], soloElSegundo);

            expect(r.ok).toBe(false);
            expect(r.faltantes[0].texto).toContain("ya no está disponible");

        });

        it("debe reunir todos los productos que fallan, no solo el primero", () => {

            const carrito = [
                itemCarrito({ cantidad: 5 }),
                itemCarrito({ id: 2, nombre: "Cilindro CL-10", cantidad: 9 })
            ];

            const r = verificarStock(carrito, catalogoDePrueba({ stock: 2 }));

            expect(r.faltantes.length).toBe(2);

        });

    });


    describe("casos límite", () => {

        it("debe aprobar un carrito vacío", () => {

            expect(verificarStock([], catalogoDePrueba()).ok).toBe(true);

        });

        it("debe tolerar valores que no son arreglos", () => {

            expect(verificarStock(null, null).ok).toBe(true);

        });

    });

});


describe("fusionarCarritos", () => {

    it("debe devolver el del usuario cuando el de invitado está vacío", () => {

        const resultado = fusionarCarritos([], [itemCarrito()]);

        expect(resultado.length).toBe(1);
        expect(resultado[0].cantidad).toBe(2);

    });


    it("debe devolver el del invitado cuando el del usuario está vacío", () => {

        const resultado = fusionarCarritos([itemCarrito()], []);

        expect(resultado.length).toBe(1);
        expect(resultado[0].nombre).toBe("RC-30");

    });


    it("debe agregar los productos que el usuario no tenía", () => {

        const invitado = [itemCarrito({ id: 2, nombre: "Cilindro CL-10" })];
        const resultado = fusionarCarritos(invitado, [itemCarrito()]);

        expect(resultado.length).toBe(2);

    });


    it("debe sumar las cantidades cuando el producto está en los dos", () => {

        const resultado = fusionarCarritos(
            [itemCarrito({ cantidad: 3 })],
            [itemCarrito({ cantidad: 2 })]
        );

        expect(resultado.length).toBe(1);
        expect(resultado[0].cantidad).toBe(5);

    });


    it("no debe superar el stock al sumar las cantidades", () => {

        const resultado = fusionarCarritos(
            [itemCarrito({ cantidad: 8, stock: 10 })],
            [itemCarrito({ cantidad: 7, stock: 10 })]
        );

        expect(resultado[0].cantidad).toBe(10);

    });


    it("no debe modificar los carritos originales (función pura)", () => {

        const invitado = [itemCarrito({ cantidad: 3 })];
        const usuario = [itemCarrito({ cantidad: 2 })];

        fusionarCarritos(invitado, usuario);

        expect(invitado[0].cantidad).toBe(3);
        expect(usuario[0].cantidad).toBe(2);

    });


    it("debe tolerar valores que no son arreglos", () => {

        expect(fusionarCarritos(null, null).length).toBe(0);

    });

});