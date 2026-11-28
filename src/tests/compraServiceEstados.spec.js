import { colorEstado } from "../services/compraService";

describe("colores de los estados de boleta", () => {
    it.each([
        ["PENDIENTE", "bg-secondary"],
        ["PAGADA", "bg-warning text-dark"],
        ["ENVIADA", "bg-info text-dark"],
        ["ENTREGADA", "bg-success"],
        ["CANCELADA", "bg-danger"]
    ])("presenta %s con las clases correspondientes", (estado, clases) => {
        expect(colorEstado(estado)).toBe(clases);
    });

    it("usa un color neutro para un estado desconocido", () => {
        expect(colorEstado("DESCONOCIDO")).toBe("bg-secondary");
    });
});
