import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminUsuarioForm from "../pages/admin/AdminUsuarioForm";
import useAuth from "../hooks/useAuth";
vi.mock("../hooks/useAuth", () => ({ default: vi.fn() }));

describe("creación administrativa de usuarios", () => {
    let nodo, raiz, crear;
    beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; });
    afterAll(() => { delete globalThis.IS_REACT_ACT_ENVIRONMENT; });
    beforeEach(async () => {
        crear = vi.fn().mockResolvedValue({ ok: true, mensaje: "Usuario creado correctamente." });
        useAuth.mockReturnValue({ usuarios: [], usuarioActual: { id: 1 }, crearUsuario: crear });
        nodo = document.createElement("div"); document.body.appendChild(nodo); raiz = createRoot(nodo);
        await act(async () => raiz.render(React.createElement(MemoryRouter, { initialEntries: ["/admin/usuarios/nuevo"] },
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/admin/usuarios/nuevo", element: React.createElement(AdminUsuarioForm) }),
                React.createElement(Route, { path: "/admin/usuarios", element: React.createElement("p", null, "LISTADO") })))));
    });
    afterEach(async () => { await act(async () => raiz.unmount()); nodo.remove(); });
    async function cambiar(nombre, valor) {
        const control = nodo.querySelector(`[name="${nombre}"]`);
        const prototipo = control.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(prototipo, "value").set.call(control, valor);
        await act(async () => control.dispatchEvent(new Event(control.tagName === "SELECT" ? "change" : "input", { bubbles: true })));
    }
    async function completar() {
        for (const [campo, valor] of Object.entries({ run: "123456785", nombre: "Prueba", apellido: "Temporal", correo: "prueba@gmail.com", contrasena: "Clave123!" })) await cambiar(campo, valor);
    }
    async function enviar() { await act(async () => nodo.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))); }
    it("ofrece los tres roles y mantiene los límites del contrato", () => {
        expect(Array.from(nodo.querySelector('[name="rol"]').options).map(x => x.value)).toEqual(["CLIENTE", "VENDEDOR", "ADMIN"]);
        expect(nodo.querySelector('[name="apellido"]').maxLength).toBe(100);
        expect(nodo.querySelector('[name="direccion"]').maxLength).toBe(300);
        expect(nodo.querySelector('[name="contrasena"]').type).toBe("password");
    });
    it("crea con el rol elegido y vuelve al listado sin exigir ubicación", async () => {
        await completar(); await cambiar("rol", "VENDEDOR"); await enviar();
        expect(crear).toHaveBeenCalledWith(expect.objectContaining({ run: "123456785", rol: "VENDEDOR", region: "", comuna: "", direccion: "" }));
        expect(nodo.textContent).toBe("LISTADO");
    });
    it("rechaza un RUN inválido antes de llamar al backend", async () => {
        await completar(); await cambiar("run", "123456789"); await enviar();
        expect(crear).not.toHaveBeenCalled(); expect(nodo.querySelector('[role="alert"]').textContent).toContain("RUT ingresado no es válido");
    });
    it("rechaza un dominio de correo ajeno al instructivo", async () => {
        await completar(); await cambiar("correo", "prueba@example.com"); await enviar();
        expect(crear).not.toHaveBeenCalled(); expect(nodo.querySelector('[role="alert"]').textContent).toContain("Solo se permiten correos");
    });
    it("mantiene el formulario y permite corregir un rechazo del servidor", async () => {
        crear.mockResolvedValue({ ok: false, mensaje: "Ya existe un usuario con ese correo." });
        await completar(); await enviar();
        expect(nodo.querySelector('[role="alert"]').textContent).toBe("Ya existe un usuario con ese correo.");
        expect(nodo.querySelector('[name="nombre"]').value).toBe("Prueba");
        expect(nodo.querySelector('[type="submit"]').disabled).toBe(false);
    });
    it("cambiar región borra la comuna anterior y ofrece las comunas correspondientes", async () => {
        await cambiar("region", "Región Metropolitana"); await cambiar("comuna", "Santiago");
        await cambiar("region", "Región de Valparaíso");
        const comuna = nodo.querySelector('[name="comuna"]');
        expect(comuna.value).toBe("");
        expect(Array.from(comuna.options).map(x => x.value)).toContain("Valparaíso");
        expect(Array.from(comuna.options).map(x => x.value)).not.toContain("Santiago");
    });
    it("bloquea envíos duplicados mientras espera la respuesta", async () => {
        let resolver;
        crear.mockReturnValue(new Promise(resolve => { resolver = resolve; }));
        await completar(); await enviar(); await enviar();
        expect(crear).toHaveBeenCalledTimes(1);
        expect(nodo.querySelector('[type="submit"]').disabled).toBe(true);
        await act(async () => resolver({ ok: true }));
    });
});
