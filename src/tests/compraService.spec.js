import api from "../services/api";
import { guardarCompra,
    listarOrdenes, obtenerBoleta, leerMisCompras, leerHistorialUsuario,
    cambiarEstadoBoleta, obtenerResumen, cerrarPeriodo } from "../services/compraService";

vi.mock("../services/api", () => ({ default: { post: vi.fn(), get: vi.fn(), patch: vi.fn() } }));

beforeEach(() => {
    localStorage.clear();
    api.post.mockReset();
    api.get.mockReset();
    api.patch.mockReset();
});

describe("consultas remotas de compras", () => {
    const dto = { idBoleta: 5, folio: "RB-2026-5", idUsuario: 3, fechaEmision: "2026-11-26T12:00:00",
        fechaCierre: null, estado: "PENDIENTE", total: "15980.00", nombreCliente: "Cliente", apellidoCliente: "Prueba",
        correoCliente: "cliente@gmail.com", metodoPago: "transferencia",
        detalles: [{ idProducto: 2, nombreProducto: "Musette", precioUnidad: "7990.00", cantidad: 2, subTotal: "15980.00" }] };
    it("envia solo el estado al PATCH y adapta la boleta confirmada por el servidor", async () => {
        api.patch.mockResolvedValue({ data: { ...dto, estado: "CANCELADA" } });
        const compra = await cambiarEstadoBoleta(5, "CANCELADA");
        expect(api.patch).toHaveBeenCalledWith("/boletas/5/estado", { estado: "CANCELADA" });
        expect(compra.estado).toBe("CANCELADA");
        expect(compra.folio).toBe(dto.folio);
    });
    it("lee el resumen y confirma el cierre sin modificar compras locales", async () => {
        api.get.mockResolvedValue({ data: { cantidadOrdenes: 2 } });
        api.post.mockResolvedValue({ data: { cantidadCerradas: 3 } });
        localStorage.setItem("recta_compras", "datos anteriores");
        expect(await obtenerResumen()).toEqual({ cantidadOrdenes: 2 });
        expect(await cerrarPeriodo()).toBe(3);
        expect(api.get).toHaveBeenCalledWith("/reportes/resumen");
        expect(api.post).toHaveBeenCalledWith("/reportes/cierre");
        expect(localStorage.getItem("recta_compras")).toBe("datos anteriores");
    });
    for (const [nombre, consultar, ruta] of [
        ["ordenes", () => listarOrdenes(), "/boletas"],
        ["mis compras", () => leerMisCompras(), "/boletas/mias"],
        ["historial de usuario", () => leerHistorialUsuario(3), "/boletas/usuario/3"]
    ]) {
        it(`consulta ${nombre} y adapta el DTO sin leer localStorage`, async () => {
            api.get.mockResolvedValue({ data: [dto] });
            localStorage.setItem("recta_compras", "contenido-invalido");
            const compras = await consultar();
            expect(api.get).toHaveBeenCalledWith(ruta);
            expect(compras[0]).toMatchObject({ id: 5, folio: dto.folio, usuarioId: 3, subtotal: 15980, cantidadProductos: 2 });
        });
    }
    it("detalle conserva los importes historicos recibidos", async () => {
        api.get.mockResolvedValue({ data: dto });
        const compra = await obtenerBoleta(5);
        expect(api.get).toHaveBeenCalledWith("/boletas/5");
        expect(compra.productos[0]).toEqual({ id: 2, nombre: "Musette", precio: 7990, cantidad: 2, subTotal: 15980 });
        expect(compra.cliente.correo).toBe(dto.correoCliente);
    });
    it("propaga el rechazo del servidor al consultar una boleta ajena", async () => {
        const error = { response: { status: 403, data: { mensaje: "Sin permiso." } } };
        api.get.mockRejectedValue(error);
        await expect(obtenerBoleta(5)).rejects.toBe(error);
    });
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
