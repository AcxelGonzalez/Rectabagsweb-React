import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Checkout from "../pages/Checkout";
import CompraExitosa from "../pages/CompraExitosa";
import CompraError from "../pages/CompraError";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";

vi.mock("../services/api", () => ({ default: { post: vi.fn() } }));
vi.mock("../hooks/useAuth", () => ({ default: vi.fn() }));
vi.mock("../hooks/useCart", () => ({ default: vi.fn() }));

describe("checkout conectado a la API", () => {
    let contenedor;
    let raiz;
    let vaciarCarrito;
    const usuario = {
        id: "usuario-local", nombre: "Marco", apellido: "Carrasco", correo: "cliente@gmail.com",
        telefono: "912345678", direccion: "Av. Principal 123", region: "Región Metropolitana", comuna: "Santiago"
    };
    const boleta = {
        idBoleta: 10, folio: "RB-2026-SERVIDOR", total: 15980,
        detalles: [{ idProducto: 1, cantidad: 2, precioUnidad: 7990, subTotal: 15980 }]
    };

    beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; });
    afterAll(() => { delete globalThis.IS_REACT_ACT_ENVIRONMENT; });
    beforeEach(() => {
        localStorage.clear();
        api.post.mockReset();
        vaciarCarrito = vi.fn();
        useAuth.mockReturnValue({ usuarioActual: usuario });
        useCart.mockReturnValue({
            carrito: [{ id: 1, nombre: "Mochila", precio: 10000, cantidad: 2 }],
            cantidadProductos: 2, subtotal: 20000, vaciarCarrito
        });
        contenedor = document.createElement("div");
        document.body.appendChild(contenedor);
        raiz = createRoot(contenedor);
    });
    afterEach(async () => {
        await act(async () => raiz.unmount());
        contenedor.remove();
        localStorage.clear();
    });

    async function renderizar(ruta = "/checkout") {
        await act(async () => raiz.render(
            React.createElement(MemoryRouter, { initialEntries: [ruta] },
                React.createElement(Routes, null,
                    React.createElement(Route, { path: "/checkout", element: React.createElement(Checkout) }),
                    React.createElement(Route, { path: "/compra-exitosa", element: React.createElement(CompraExitosa) }),
                    React.createElement(Route, { path: "/compra-error", element: React.createElement(CompraError) }),
                    React.createElement(Route, { path: "/catalogo", element: React.createElement("p", null, "Catálogo") }),
                    React.createElement(Route, { path: "/carrito", element: React.createElement("p", null, "Carrito") })
                )
            )
        ));
    }
    async function abrirConfirmacion() {
        await renderizar();
        await act(async () => {
            const pago = contenedor.querySelector("#checkout-pago");
            pago.value = "transferencia";
            pago.dispatchEvent(new Event("change", { bubbles: true }));
        });
        await act(async () => contenedor.querySelector("form").dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true })
        ));
    }
    function boton(texto) {
        return [...contenedor.querySelectorAll("button")].find(b => b.textContent.trim() === texto);
    }
    async function confirmar() {
        await act(async () => boton("Sí, confirmar").click());
    }

    it("espera la confirmación y no registra nada si el comprador cancela", async () => {
        await abrirConfirmacion();
        expect(api.post).not.toHaveBeenCalled();
        await act(async () => boton("No").click());
        expect(contenedor.querySelector('[role="dialog"]')).toBeNull();
        expect(api.post).not.toHaveBeenCalled();
        expect(vaciarCarrito).not.toHaveBeenCalled();
    });

    it("envía datos y cantidades sin precios, estado ni usuario elegido desde React", async () => {
        api.post.mockResolvedValue({ data: boleta });
        await abrirConfirmacion();
        await confirmar();
        expect(api.post).toHaveBeenCalledExactlyOnceWith("/boletas", {
            nombreCliente: "Marco", apellidoCliente: "Carrasco", correoCliente: "cliente@gmail.com",
            telefonoCliente: "912345678", direccionCliente: "Av. Principal 123",
            region: "Región Metropolitana", comuna: "Santiago", metodoPago: "transferencia",
            items: [{ idProducto: 1, cantidad: 2 }]
        });
        expect(vaciarCarrito).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem("recta_compras")).toBeNull();
    });

    it("muestra el folio y total del servidor aunque difieran del resumen local", async () => {
        api.post.mockResolvedValue({ data: boleta });
        await abrirConfirmacion();
        await confirmar();
        expect(contenedor.textContent).toContain("Compra realizada correctamente");
        expect(contenedor.textContent).toContain(boleta.folio);
        expect(contenedor.textContent).toContain("15.980");
        expect(contenedor.textContent).not.toContain("20.000");
    });

    it("no vacía el carrito antes de la respuesta y evita confirmaciones repetidas", async () => {
        let resolver;
        api.post.mockImplementation(() => new Promise(resolve => { resolver = resolve; }));
        await abrirConfirmacion();
        const confirmarBoton = boton("Sí, confirmar");
        await act(async () => {
            confirmarBoton.click();
            confirmarBoton.click();
        });
        expect(api.post).toHaveBeenCalledTimes(1);
        expect(vaciarCarrito).not.toHaveBeenCalled();
        expect(boton("Procesando compra…").disabled).toBe(true);
        await act(async () => resolver({ data: boleta }));
        expect(vaciarCarrito).toHaveBeenCalledTimes(1);
    });

    it("muestra el mensaje de falta de stock del backend y conserva el carrito", async () => {
        api.post.mockRejectedValue({ response: { status: 400, data: { mensaje: "Stock insuficiente para Mochila." } } });
        await abrirConfirmacion();
        await confirmar();
        expect(contenedor.textContent).toContain("No pudimos completar la compra");
        expect(contenedor.textContent).toContain("Stock insuficiente para Mochila.");
        expect(vaciarCarrito).not.toHaveBeenCalled();
    });

    it("muestra un error de conexión sin borrar el carrito", async () => {
        api.post.mockRejectedValue(new Error("Network Error"));
        await abrirConfirmacion();
        await confirmar();
        expect(contenedor.textContent).toContain("No fue posible registrar la compra.");
        expect(vaciarCarrito).not.toHaveBeenCalled();
    });

    it("no permite abrir la pantalla de éxito sin una boleta", async () => {
        await renderizar("/compra-exitosa");
        expect(contenedor.textContent).toBe("Catálogo");
    });

    it("valida datos incompletos antes de abrir la confirmación", async () => {
        useAuth.mockReturnValue({ usuarioActual: null });
        await renderizar();
        await act(async () => contenedor.querySelector("form").dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true })
        ));
        expect(contenedor.querySelector('[role="alert"]').textContent).toContain("Debes completar");
        expect(api.post).not.toHaveBeenCalled();
    });
});
