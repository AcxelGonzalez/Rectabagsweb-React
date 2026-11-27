import React, { act } from "react";
import { createRoot } from "react-dom/client";
import AuthProvider from "../context/AuthProvider";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

vi.mock("../services/api", () => ({ default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() } }));

describe("AuthProvider conectado al backend", () => {
    let contenedor, raiz, auth;
    const cliente = { id: 1, nombre: "Cliente", apellido: "Prueba", run: "123456785", correo: "cliente@gmail.com", rol: "CLIENTE" };
    function Consumidor() { auth = useAuth(); return null; }
    async function renderizar() {
        await act(async () => raiz.render(React.createElement(AuthProvider, null, React.createElement(Consumidor))));
    }
    async function login(usuario = cliente) {
        api.post.mockResolvedValue({ data: { token: "token-prueba", usuario } });
        let resultado;
        await act(async () => { resultado = await auth.iniciarSesion(usuario.correo, "Clave123!"); });
        return resultado;
    }
    beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; });
    afterAll(() => { delete globalThis.IS_REACT_ACT_ENVIRONMENT; });
    beforeEach(() => {
        localStorage.clear();
        for (const method of ["get", "post", "put", "delete"]) api[method].mockReset();
        api.get.mockImplementation(url => Promise.resolve({ data: url === "/usuarios/me" ? cliente : [] }));
        contenedor = document.createElement("div"); document.body.appendChild(contenedor); raiz = createRoot(contenedor);
    });
    afterEach(async () => { await act(async () => raiz.unmount()); contenedor.remove(); localStorage.clear(); });

    it("sin token inicia como visitante e ignora sesiones locales anteriores", async () => {
        localStorage.setItem("recta_usuario_actual", JSON.stringify({ ...cliente, rol: "ADMIN" }));
        await renderizar();
        expect(auth.estaAutenticado).toBe(false); expect(api.get).not.toHaveBeenCalled();
    });
    it("comprueba el token guardado consultando el perfil", async () => {
        localStorage.setItem("recta_token", "token-prueba");
        await renderizar();
        expect(api.get).toHaveBeenCalledWith("/usuarios/me"); expect(auth.usuarioActual).toEqual(cliente);
        expect(auth.cargandoSesion).toBe(false);
    });
    it("descarta un token rechazado y su sesion", async () => {
        localStorage.setItem("recta_token", "token-vencido"); api.get.mockRejectedValue({ response: { status: 401 } });
        await renderizar();
        expect(auth.estaAutenticado).toBe(false); expect(localStorage.getItem("recta_token")).toBeNull();
    });
    it("login guarda el token y el usuario enviados por la API", async () => {
        await renderizar(); const resultado = await login();
        expect(resultado.ok).toBe(true); expect(api.post).toHaveBeenCalledWith("/auth/login", { correo: cliente.correo, contrasena: "Clave123!" });
        expect(localStorage.getItem("recta_token")).toBe("token-prueba"); expect(auth.usuarioActual.id).toBe(1);
        expect(localStorage.getItem("recta_usuarios")).toBeNull();
    });
    it("login muestra el error del servidor", async () => {
        await renderizar(); api.post.mockRejectedValue({ response: { data: { mensaje: "Credenciales incorrectas." } } });
        let resultado; await act(async () => { resultado = await auth.iniciarSesion("cliente@gmail.com", "mala"); });
        expect(resultado).toEqual({ ok: false, mensaje: "Credenciales incorrectas." });
    });
    it("cerrar sesion elimina token y usuario", async () => {
        await renderizar(); await login(); await act(async () => auth.cerrarSesion());
        expect(auth.estaAutenticado).toBe(false); expect(localStorage.getItem("recta_token")).toBeNull();
        expect(localStorage.getItem("recta_usuario_actual")).toBeNull();
    });
    it("registro normaliza el RUN y no permite elegir rol", async () => {
        await renderizar(); api.post.mockResolvedValue({ data: cliente });
        let resultado; await act(async () => { resultado = await auth.registrarUsuario({ rut: "12.345.678-5", rol: "ADMIN", correo: cliente.correo }); });
        expect(resultado.ok).toBe(true); const datos = api.post.mock.calls[0][1];
        expect(datos.run).toBe("123456785"); expect(datos).not.toHaveProperty("rol");
    });
    it("registro muestra validaciones del backend", async () => {
        await renderizar(); api.post.mockRejectedValue({ response: { data: { mensaje: "RUN invalido." } } });
        expect((await auth.registrarUsuario({})).mensaje).toBe("RUN invalido.");
    });
    it("perfil espera PUT y actualiza la sesion con la respuesta", async () => {
        await renderizar(); await login(); const editado = { ...cliente, nombre: "Nuevo" }; api.put.mockResolvedValue({ data: editado });
        await act(async () => { expect((await auth.actualizarPerfil({ nombre: "Nuevo", apellido: "Prueba" })).ok).toBe(true); });
        expect(auth.usuarioActual.nombre).toBe("Nuevo"); expect(api.put.mock.calls[0][0]).toBe("/usuarios/me");
    });
    it("cliente no solicita la lista administrativa de usuarios", async () => {
        await renderizar(); await login(); expect(api.get).not.toHaveBeenCalledWith("/usuarios"); expect(auth.puedeEntrarAlPanel).toBe(false);
    });
    it("administrador carga usuarios y habilita el panel", async () => {
        await renderizar(); await login({ ...cliente, rol: "ADMIN" });
        expect(api.get).toHaveBeenCalledWith("/usuarios"); expect(auth.esAdmin).toBe(true); expect(auth.puedeEntrarAlPanel).toBe(true);
    });
    it("vendedor entra al panel pero no es administrador", async () => {
        await renderizar(); await login({ ...cliente, rol: "VENDEDOR" });
        expect(auth.esVendedor).toBe(true); expect(auth.esAdmin).toBe(false); expect(auth.puedeEntrarAlPanel).toBe(true);
    });
    it("actualizar usuario envia RUN y rol al endpoint correcto", async () => {
        await renderizar(); await login({ ...cliente, rol: "ADMIN" }); api.put.mockResolvedValue({ data: cliente });
        await act(async () => auth.actualizarUsuario(1, cliente));
        expect(api.put).toHaveBeenCalledWith("/usuarios/1", expect.objectContaining({ run: cliente.run, rol: "CLIENTE" }));
    });
    it("eliminar usuario espera la API y recarga la lista", async () => {
        await renderizar(); await login({ ...cliente, rol: "ADMIN" }); api.delete.mockResolvedValue({});
        await act(async () => { expect((await auth.eliminarUsuario(2)).ok).toBe(true); });
        expect(api.delete).toHaveBeenCalledWith("/usuarios/2");
    });
    it("recuperacion informa que no existe endpoint sin modificar datos locales", async () => {
        await renderizar(); expect((await auth.recuperarContrasena()).ok).toBe(false); expect(api.post).not.toHaveBeenCalled();
    });
});
