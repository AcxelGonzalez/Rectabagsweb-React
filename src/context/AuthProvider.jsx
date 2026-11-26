import { useCallback, useEffect, useState } from "react";

import AuthContext from "./AuthContext";

import api from "../services/api";


const CLAVE_TOKEN = "recta_token";

const CLAVE_SESION = "recta_usuario_actual";


// Lee la sesión guardada para mostrar algo mientras el backend responde
function leerSesionGuardada() {

    try {
        const texto = localStorage.getItem(CLAVE_SESION);
        return texto ? JSON.parse(texto) : null;

    } catch {
        return null;
    }

}


// El backend envía los errores como { "mensaje": "..." }
function mensajeDeError(error, porDefecto) {

    return error?.response?.data?.mensaje || porDefecto;

}


// El RUN viaja al backend sin puntos ni guion: "12.345.678-5" → "123456785"
function normalizarRun(valor) {

    return String(valor || "")
        .replace(/[.\-\s]/g, "")
        .toUpperCase();

}


function AuthProvider({ children }) {

    const [usuarioActual, setUsuarioActual] = useState(leerSesionGuardada);

    const [usuarios, setUsuarios] = useState([]);

    const [cargandoSesion, setCargandoSesion] = useState(true);


    function guardarSesion(usuario) {

        setUsuarioActual(usuario);
        localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));

    }


    function borrarSesion() {

        setUsuarioActual(null);
        setUsuarios([]);
        localStorage.removeItem(CLAVE_TOKEN);
        localStorage.removeItem(CLAVE_SESION);

    }


    /*
     * Al abrir la aplicación: si hay token guardado, se le pregunta al
     * backend quién es. Así, si el token venció, la sesión se cierra sola.
     */
    useEffect(() => {

        const token = localStorage.getItem(CLAVE_TOKEN);

        if (!token) {
            setCargandoSesion(false);
            return;
        }

        api.get("/usuarios/me")
            .then(({ data }) => {
                setUsuarioActual(data);
                localStorage.setItem(CLAVE_SESION, JSON.stringify(data));
            })
            .catch(() => {
                localStorage.removeItem(CLAVE_TOKEN);
                localStorage.removeItem(CLAVE_SESION);
                setUsuarioActual(null);
            })
            .finally(() => {
                setCargandoSesion(false);
            });

    }, []);


    const esAdmin = usuarioActual?.rol === "ADMIN";

    const esVendedor = usuarioActual?.rol === "VENDEDOR";


    /*
     * La lista completa de usuarios es solo para el administrador:
     * a los demás el backend les responde 403.
     */
    const cargarUsuarios = useCallback(async () => {

        if (usuarioActual?.rol !== "ADMIN") {
            setUsuarios([]);
            return;
        }

        try {
            const { data } = await api.get("/usuarios");
            setUsuarios(data);

        } catch {
            setUsuarios([]);
        }

    }, [usuarioActual]);


    useEffect(() => {

        cargarUsuarios();

    }, [cargarUsuarios]);


    // ------------------------------------------------------------------
    // Sesión
    // ------------------------------------------------------------------

    async function iniciarSesion(correo, contrasena) {

        try {
            const { data } = await api.post("/auth/login", {
                correo,
                contrasena
            });

            localStorage.setItem(CLAVE_TOKEN, data.token);
            guardarSesion(data.usuario);

            return {
                ok: true,
                mensaje: "Sesión iniciada correctamente.",
                usuario: data.usuario
            };

        } catch (error) {

            return {
                ok: false,
                mensaje: mensajeDeError(error, "No fue posible iniciar sesión.")
            };

        }

    }


    function cerrarSesion() {

        borrarSesion();

    }


    // ------------------------------------------------------------------
    // Registro de clientes
    // ------------------------------------------------------------------

    async function registrarUsuario(datos) {

        try {
            await api.post("/auth/registro", {
                run: normalizarRun(datos.rut ?? datos.run),
                nombre: datos.nombre,
                apellido: datos.apellido,
                correo: datos.correo,
                contrasena: datos.contrasena,
                telefono: datos.telefono,
                region: datos.region,
                comuna: datos.comuna,
                direccion: datos.direccion
            });

            return {
                ok: true,
                mensaje: "Usuario registrado correctamente."
            };

        } catch (error) {

            return {
                ok: false,
                mensaje: mensajeDeError(error, "No fue posible registrar el usuario.")
            };

        }

    }


    // ------------------------------------------------------------------
    // Mi perfil
    // ------------------------------------------------------------------

    async function actualizarPerfil(datos) {

        try {
            const { data } = await api.put("/usuarios/me", {
                nombre: datos.nombre,
                apellido: datos.apellido,
                contrasena: datos.contrasena || null,
                telefono: datos.telefono,
                region: datos.region,
                comuna: datos.comuna,
                direccion: datos.direccion
            });

            guardarSesion(data);

            return {
                ok: true,
                mensaje: "Datos actualizados correctamente.",
                usuario: data
            };

        } catch (error) {

            return {
                ok: false,
                mensaje: mensajeDeError(error, "No fue posible actualizar tus datos.")
            };

        }

    }


    // ------------------------------------------------------------------
    // Administración de usuarios (solo ADMIN)
    // ------------------------------------------------------------------

    async function crearUsuario(datos) {

        try {
            await api.post("/usuarios", {
                run: normalizarRun(datos.rut ?? datos.run),
                nombre: datos.nombre,
                apellido: datos.apellido,
                correo: datos.correo,
                contrasena: datos.contrasena,
                telefono: datos.telefono,
                region: datos.region,
                comuna: datos.comuna,
                direccion: datos.direccion,
                rol: datos.rol
            });

            await cargarUsuarios();

            return { ok: true, mensaje: "Usuario creado correctamente." };

        } catch (error) {

            return {
                ok: false,
                mensaje: mensajeDeError(error, "No fue posible crear el usuario.")
            };

        }

    }


    async function actualizarUsuario(id, datos) {

        try {
            await api.put(`/usuarios/${id}`, {
                run: normalizarRun(datos.rut ?? datos.run),
                nombre: datos.nombre,
                apellido: datos.apellido,
                correo: datos.correo,
                contrasena: datos.contrasena || null,
                telefono: datos.telefono,
                region: datos.region,
                comuna: datos.comuna,
                direccion: datos.direccion,
                rol: datos.rol
            });

            await cargarUsuarios();

            return { ok: true, mensaje: "Usuario actualizado correctamente." };

        } catch (error) {

            return {
                ok: false,
                mensaje: mensajeDeError(error, "No fue posible actualizar el usuario.")
            };

        }

    }


    async function eliminarUsuario(id) {

        try {
            await api.delete(`/usuarios/${id}`);

            await cargarUsuarios();

            return { ok: true, mensaje: "Usuario eliminado correctamente." };

        } catch (error) {

            return {
                ok: false,
                mensaje: mensajeDeError(error, "No fue posible eliminar el usuario.")
            };

        }

    }


    /*
     * La recuperación de contraseña no tiene endpoint en el backend.
     * Se deja avisando, para no simular algo que no ocurre.
     */
    async function recuperarContrasena() {

        return {
            ok: false,
            mensaje: "La recuperación de contraseña no está disponible. Contacta al administrador."
        };

    }


    return (

        <AuthContext.Provider
            value={{
                usuarios,
                usuarioActual,
                cargandoSesion,
                estaAutenticado: Boolean(usuarioActual),
                esAdmin,
                esVendedor,
                puedeEntrarAlPanel: esAdmin || esVendedor,
                cargarUsuarios,
                registrarUsuario,
                iniciarSesion,
                cerrarSesion,
                recuperarContrasena,
                actualizarPerfil,
                crearUsuario,
                actualizarUsuario,
                eliminarUsuario
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export default AuthProvider;