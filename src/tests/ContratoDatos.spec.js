import { formatearPrecio } from "../utils/moneda";
import { validarNombreProducto, validarPrecioProducto, validarDescripcionProducto } from "../utils/validaciones";

describe("contrato de productos del instructivo", () => {
    it("acepta nombre corto, precio FREE y descripción opcional", () => {
        expect(validarNombreProducto("AB")).toBeNull();
        expect(validarPrecioProducto(0)).toBeNull();
        expect(validarDescripcionProducto(null)).toBeNull();
        expect(validarDescripcionProducto("")).toBeNull();
    });
    it("acepta los máximos y rechaza el carácter siguiente", () => {
        expect(validarNombreProducto("a".repeat(100))).toBeNull();
        expect(validarNombreProducto("a".repeat(101))).not.toBeNull();
        expect(validarDescripcionProducto("a".repeat(500))).toBeNull();
        expect(validarDescripcionProducto("a".repeat(501))).not.toBeNull();
        expect(validarNombreProducto("   ")).not.toBeNull();
        expect(validarPrecioProducto(-1)).not.toBeNull();
    });
});

describe("importes consistentes con el backend", () => {
    it.each([[1000, "$1.000"], [1000.5, "$1.000,50"], [1000.25, "$1.000,25"], [0, "$0"], ["15980.50", "$15.980,50"]])(
        "muestra %s como %s sin perder centavos", (importe, esperado) => {
            expect(formatearPrecio(importe).replace(/\s/g, "")).toBe(esperado);
        }
    );
});
