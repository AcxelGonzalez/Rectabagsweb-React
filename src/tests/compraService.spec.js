import api from "../services/api";
import { guardarCompra, leerCompraPorId, leerCompras, actualizarEstadoCompra } from "../services/compraService";

vi.mock("../services/api", () => ({ default: { post: vi.fn() } }));

beforeEach(() => {
    localStorage.clear();
    api.post.mockReset();
});
afterEach(() => localStorage.clear());

describe("guardarCompra con el backend", () => {
    const request = {
        nombreCliente: "Marco", apellidoCliente: "Carrasco", correoCliente: "cliente@gmail.com",
        telefonoCliente: "912345678", direccionCliente: "Av. Principal 123",
        region: "Región Metropolitana", comuna: "Santiago", metodoPago: "transferencia",
        items: [{ idProducto: 1, cantidad: 2 }]
    };

    it("envía la compra a /boletas y devuelve el comprobante del servidor", async () => {
        const boleta = { idBoleta: 10, folio: "RB-2026-prueba", total: 15980.50 };
        api.post.mockResolvedValue({ data: boleta });
        const respuesta = await guardarCompra(request);
        expect(api.post).toHaveBeenCalledExactlyOnceWith("/boletas", request);
        expect(respuesta).toBe(boleta);
        expect(localStorage.getItem("recta_compras")).toBeNull();
    });

    it("propaga el error de stock sin guardar una compra local", async () => {
        const error = { response: { status: 400, data: { mensaje: "Stock insuficiente para Mochila." } } };
        api.post.mockRejectedValue(error);
        await expect(guardarCompra(request)).rejects.toBe(error);
        expect(localStorage.getItem("recta_compras")).toBeNull();
    });

    it("propaga los errores de conexión para que el checkout conserve el carrito", async () => {
        const error = new Error("Network Error");
        api.post.mockRejectedValue(error);
        await expect(guardarCompra(request)).rejects.toBe(error);
    });
});

// Estas lecturas y transiciones conservan su alcance local hasta la migracion de ordenes.
describe("consulta y estados de compras locales existentes", () => {
    function crearCompraLocal(cambios = {}) {
        const compra = { id: "RB-LOCAL", usuarioId: "cliente-1", subtotal: 30000, estado: "confirmada", ...cambios };
        localStorage.setItem("recta_compras", JSON.stringify([compra]));
        return compra;
    }

    it("encuentra una compra existente por identificador", () => {
        const compra = crearCompraLocal();
        expect(leerCompraPorId(compra.id)).toEqual(compra);
    });

    it("devuelve null para una compra inexistente", () => {
        expect(leerCompraPorId("RB-INEXISTENTE")).toBeNull();
    });

    it("devuelve null si no se entrega un identificador", () => {
        expect(leerCompraPorId()).toBeNull();
        expect(leerCompraPorId("")).toBeNull();
    });

    it("tolera compras locales dañadas sin afectar el servicio remoto", () => {
        localStorage.setItem("recta_compras", "contenido-no-valido");
        expect(leerCompras()).toEqual([]);
        expect(leerCompraPorId("RB-LOCAL")).toBeNull();
    });

    for (const [anterior, siguiente] of [
        ["confirmada", "en preparación"], ["en preparación", "enviada"],
        ["enviada", "entregada"], ["cancelada", "confirmada"]
    ]) {
        it(`permite la transición local de ${anterior} a ${siguiente}`, () => {
            const compra = crearCompraLocal({ estado: anterior });
            expect(actualizarEstadoCompra(compra.id, siguiente).estado).toBe(siguiente);
            expect(leerCompraPorId(compra.id).estado).toBe(siguiente);
        });
    }

    for (const [anterior, siguiente] of [
        ["confirmada", "enviada"], ["entregada", "cancelada"], ["cancelada", "enviada"]
    ]) {
        it(`rechaza la transición local de ${anterior} a ${siguiente}`, () => {
            const compra = crearCompraLocal({ estado: anterior });
            expect(actualizarEstadoCompra(compra.id, siguiente)).toBeNull();
            expect(leerCompraPorId(compra.id).estado).toBe(anterior);
        });
    }

    it("no modifica una orden local archivada", () => {
        const compra = crearCompraLocal({ archivada: true });
        expect(actualizarEstadoCompra(compra.id, "en preparación")).toBeNull();
        expect(leerCompraPorId(compra.id).estado).toBe("confirmada");
    });
});
