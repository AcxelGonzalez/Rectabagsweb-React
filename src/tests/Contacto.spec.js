import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Contacto from "../pages/Contacto";

describe("validaciones de Contacto exigidas por el instructivo", () => {
    let contenedor, raiz;
    beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; });
    afterAll(() => { delete globalThis.IS_REACT_ACT_ENVIRONMENT; });
    beforeEach(async () => {
        contenedor = document.createElement("div"); document.body.appendChild(contenedor);
        raiz = createRoot(contenedor);
        await act(async () => raiz.render(React.createElement(Contacto)));
    });
    afterEach(async () => { await act(async () => raiz.unmount()); contenedor.remove(); });
    async function completar(datos) {
        for (const [campo, valor] of Object.entries(datos)) {
            const elemento = contenedor.querySelector(`[name="${campo}"]`);
            const prototipo = campo === "mensaje" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            await act(async () => {
                Object.getOwnPropertyDescriptor(prototipo, "value").set.call(elemento, valor);
                elemento.dispatchEvent(new Event("input", { bubbles: true }));
            });
        }
        await act(async () => contenedor.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    }
    it.each(["gmail.com", "duoc.cl", "profesor.duoc.cl"])("acepta el dominio %s y los limites de nombre y comentario", async dominio => {
        await completar({ nombre: "a".repeat(100), correo: `prueba@${dominio}`, mensaje: "a".repeat(500) });
        expect(contenedor.querySelector('[role="status"]').textContent).toContain("demostración");
        expect(contenedor.querySelector('[name="nombre"]').value).toBe("");
    });
    it.each([
        [{ nombre: "   " }, "Ingresa tu nombre"],
        [{ nombre: "a".repeat(101) }, "nombre admite máximo 100"],
        [{ correo: "a".repeat(91) + "@gmail.com" }, "correo admite máximo 100"],
        [{ correo: "prueba@example.com" }, "Solo se permiten correos"],
        [{ mensaje: "   " }, "Ingresa tu comentario"],
        [{ mensaje: "a".repeat(501) }, "comentario admite máximo 500"]
    ])("rechaza entradas fuera del instructivo sin vaciar el formulario %j", async (cambios, texto) => {
        await completar({ nombre: "Cliente", correo: "prueba@gmail.com", mensaje: "Consulta", ...cambios });
        expect(contenedor.querySelector('[role="alert"]').textContent).toContain(texto);
        expect(contenedor.querySelector('[role="status"]')).toBeNull();
        expect(contenedor.querySelector('[name="mensaje"]').value).not.toBe("");
    });
});
