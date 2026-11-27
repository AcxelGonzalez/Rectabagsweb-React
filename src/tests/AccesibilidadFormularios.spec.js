import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import CampoFormulario from "../components/admin/CampoFormulario";
import Home from "../pages/Home";

describe("encabezado y descripción accesible de campos", () => {
    let nodo, raiz;
    beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; });
    afterAll(() => { delete globalThis.IS_REACT_ACT_ENVIRONMENT; });
    beforeEach(() => { nodo = document.createElement("div"); document.body.appendChild(nodo); raiz = createRoot(nodo); });
    afterEach(async () => { await act(async () => raiz.unmount()); nodo.remove(); });
    async function campo(props = {}) {
        await act(async () => raiz.render(React.createElement(CampoFormulario, {
            nombre: "prueba", etiqueta: "Campo de prueba", valor: "", onChange: () => {}, ...props
        })));
        return nodo.querySelector("input, select, textarea");
    }
    function mensajes(control) {
        return (control.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean).map(id => document.getElementById(id));
    }
    it.each(["input", "select", "textarea"])("asocia el error al control %s y lo marca inválido", async como => {
        const control = await campo({ como, error: "Revisa este dato." });
        expect(nodo.querySelector("label").control).toBe(control);
        expect(control.getAttribute("aria-invalid")).toBe("true");
        expect(mensajes(control).map(x => x?.textContent)).toEqual(["Revisa este dato."]);
    });
    it("sustituye la ayuda por el error y elimina el estado inválido al corregir", async () => {
        const props = { ayuda: "Texto de ayuda." };
        let control = await campo(props);
        expect(mensajes(control).map(x => x?.textContent)).toEqual(["Texto de ayuda."]);
        control = await campo({ ...props, error: "Dato inválido." });
        expect(mensajes(control).map(x => x?.textContent)).toEqual(["Dato inválido."]);
        expect(nodo.textContent).not.toContain("Texto de ayuda.");
        control = await campo(props);
        expect(control.hasAttribute("aria-invalid")).toBe(false);
        expect(mensajes(control).map(x => x?.textContent)).toEqual(["Texto de ayuda."]);
    });
    it("un campo sin mensajes no apunta a descripciones inexistentes", async () => {
        const control = await campo();
        expect(control.hasAttribute("aria-describedby")).toBe(false);
        expect(control.hasAttribute("aria-invalid")).toBe(false);
    });
    it("conserva descripciones externas y el id proporcionado por quien usa el campo", async () => {
        const externo = document.createElement("p"); externo.id = "nota-externa"; externo.textContent = "Nota externa."; nodo.appendChild(externo);
        // La nota pertenece al contenido que rodea al campo, fuera de su raíz React.
        document.body.appendChild(externo);
        try {
            const control = await campo({ id: "id-personalizado", "aria-describedby": "nota-externa", error: "Dato inválido." });
            expect(nodo.querySelector("label").control).toBe(control);
            expect(mensajes(control).map(x => x?.textContent)).toEqual(["Nota externa.", "Dato inválido."]);
        } finally { externo.remove(); }
    });
    it("Home tiene un único encabezado principal antes de sus secciones", async () => {
        await act(async () => raiz.render(React.createElement(MemoryRouter, null, React.createElement(Home))));
        expect(Array.from(nodo.querySelectorAll("h1")).map(x => x.textContent)).toEqual(["La mochila perfecta"]);
        expect(nodo.querySelector("h1, h2, h3").tagName).toBe("H1");
        expect(Array.from(nodo.querySelectorAll("h2")).map(x => x.textContent.trim())).toContain("Explora nuestros productos");
    });
});
