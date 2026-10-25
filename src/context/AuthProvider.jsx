import {
    useEffect,
    useState
} from "react";

import AuthContext
    from "./AuthContext";

import {
    usuariosIniciales
} from "../data/usuariosIniciales";

import {
    validarCorreo,
    validarRut,
    validarContrasena,
    validarFechaNacimiento,
    validarTelefono
} from "../utils/validaciones";


const CLAVE_USUARIOS =
    "recta_usuarios";

const CLAVE_SESION =
    "recta_usuario_actual";


function normalizarCorreo(
    correo
) {

    return String(
        correo || ""
    )
        .trim()
        .toLowerCase();

}


function normalizarRut(
    rut
) {

    return String(
        rut || ""
    )
        .replace(
            /[.\-\s]/g,
            ""
        )
        .toUpperCase();

}

function agregarUsuariosIniciales(
    usuariosGuardados
) {

    const usuarios =
        Array.isArray(
            usuariosGuardados
        )
            ? usuariosGuardados
            : [];


    const usuariosFaltantes =
        usuariosIniciales.filter(
            (usuarioInicial) =>
                !usuarios.some(
                    (usuarioGuardado) =>
                        normalizarCorreo(
                            usuarioGuardado.correo
                        ) ===
                        normalizarCorreo(
                            usuarioInicial.correo
                        )
                )
        );


    return [
        ...usuarios,
        ...usuariosFaltantes
    ];

}

function leerUsuariosGuardados() {

    try {

        const usuarios =
            JSON.parse(
                localStorage.getItem(
                    CLAVE_USUARIOS
                )
            );


        return agregarUsuariosIniciales(
            usuarios
        );

    } catch {

        return agregarUsuariosIniciales(
            []
        );

    }

}


function leerSesionGuardada() {

    try {

        const usuario =
            JSON.parse(
                localStorage.getItem(
                    CLAVE_SESION
                )
            );


        return usuario &&
            typeof usuario === "object"
            ? usuario
            : null;

    } catch {

        return null;

    }

}


function AuthProvider({
    children
}) {

    const [
        usuarios,
        setUsuarios
    ] = useState(
        leerUsuariosGuardados
    );


    const [
        usuarioActual,
        setUsuarioActual
    ] = useState(
        leerSesionGuardada
    );


    useEffect(() => {

        localStorage.setItem(
            CLAVE_USUARIOS,
            JSON.stringify(
                usuarios
            )
        );

    }, [usuarios]);


    useEffect(() => {

        if (usuarioActual) {

            localStorage.setItem(
                CLAVE_SESION,
                JSON.stringify(
                    usuarioActual
                )
            );

        } else {

            localStorage.removeItem(
                CLAVE_SESION
            );

        }

    }, [usuarioActual]);


    function registrarUsuario(
        datos
    ) {

        const correo =
            normalizarCorreo(
                datos.correo
            );

        const rut =
            normalizarRut(
                datos.rut
            );

        const nombre =
            String(
                datos.nombre || ""
            ).trim();

        const apellido =
            String(
                datos.apellido || ""
            ).trim();

        const telefono =
            String(
                datos.telefono || ""
            ).trim();


        if (
            !correo ||
            !rut ||
            !nombre ||
            !apellido ||
            !datos.fechaNacimiento ||
            !telefono ||
            !datos.contrasena
        ) {

            return {
                ok: false,
                mensaje:
                    "Debes completar todos los campos obligatorios."
            };

        }
          
        const errores = [
            validarCorreo(correo),
            validarRut(datos.rut),
            validarFechaNacimiento(datos.fechaNacimiento),
            validarTelefono(telefono),
            validarContrasena(datos.contrasena)
        ];

        const primerError =
            errores.find(
                (error) => error !== null
            );

        if (primerError) {

            return {
                ok: false,
                mensaje: primerError
            };

        }

        const correoExiste =
            usuarios.some(
                (usuario) =>
                    normalizarCorreo(
                        usuario.correo
                    ) === correo
            );


        if (correoExiste) {

            return {
                ok: false,
                mensaje:
                    "El correo ya se encuentra registrado."
            };

        }


        const rutExiste =
            usuarios.some(
                (usuario) =>
                    normalizarRut(
                        usuario.rut
                    ) === rut
            );


        if (rutExiste) {

            return {
                ok: false,
                mensaje:
                    "El RUT ya se encuentra registrado."
            };

        }


        const nuevoUsuario = {

            id:
                crypto.randomUUID(),

            nombre,

            apellido,

            fechaNacimiento:
                datos.fechaNacimiento,

            rut:
                datos.rut.trim(),

            telefono,

            correo,

            contrasena:
                datos.contrasena,

            region:
                datos.region || "",

            comuna:
                datos.comuna || "",

            direccion:
                String(
                    datos.direccion || ""
                ).trim(),

            rol:
                "cliente"

        };


        setUsuarios(
            (usuariosActuales) => [
                ...usuariosActuales,
                nuevoUsuario
            ]
        );


        return {
            ok: true,
            mensaje:
                "Usuario registrado correctamente.",
            usuario:
                nuevoUsuario
        };

    }


    function iniciarSesion(
        correo,
        contrasena
    ) {

        const correoNormalizado =
            normalizarCorreo(
                correo
            );

        const errorLogin =
            validarCorreo(correoNormalizado) ||
            validarContrasena(contrasena);

        if (errorLogin) {

            return {
                ok: false,
                mensaje: errorLogin
            };

        }

        const usuario =
            usuarios.find(
                (item) =>
                    normalizarCorreo(
                        item.correo
                    ) ===
                        correoNormalizado &&
                    item.contrasena ===
                        contrasena
            );


        if (!usuario) {

            return {
                ok: false,
                mensaje:
                    "Correo o contraseña incorrectos."
            };

        }


        const sesion = {

            id:
                usuario.id,

            nombre:
                usuario.nombre,

            apellido:
                usuario.apellido,

            fechaNacimiento:
                usuario.fechaNacimiento || "",

            rut:
                usuario.rut,

            telefono:
                usuario.telefono || "",

            correo:
                usuario.correo,

            region:
                usuario.region || "",

            comuna:
                usuario.comuna || "",

            direccion:
                usuario.direccion || "",

            rol:
                usuario.rol

        };


        setUsuarioActual(
            sesion
        );


        return {
            ok: true,
            mensaje:
                "Sesión iniciada correctamente.",
            usuario:
                sesion
        };

    }


    function cerrarSesion() {

        setUsuarioActual(
            null
        );

    }


    function recuperarContrasena(
        correo,
        rut,
        nuevaContrasena
    ) {

        const correoNormalizado =
            normalizarCorreo(
                correo
            );

        const rutNormalizado =
            normalizarRut(
                rut
            );


        const usuarioExiste =
            usuarios.some(
                (usuario) =>
                    normalizarCorreo(
                        usuario.correo
                    ) ===
                        correoNormalizado &&
                    normalizarRut(
                        usuario.rut
                    ) ===
                        rutNormalizado
            );


        if (!usuarioExiste) {

            return {
                ok: false,
                mensaje:
                    "No se encontró un usuario con los datos ingresados."
            };

        }


        setUsuarios(
            (usuariosActuales) =>
                usuariosActuales.map(
                    (usuario) => {

                        const mismoUsuario =
                            normalizarCorreo(
                                usuario.correo
                            ) ===
                                correoNormalizado &&
                            normalizarRut(
                                usuario.rut
                            ) ===
                                rutNormalizado;


                        if (
                            !mismoUsuario
                        ) {

                            return usuario;

                        }


                        return {
                            ...usuario,
                            contrasena:
                                nuevaContrasena
                        };

                    }
                )
        );


        return {
            ok: true,
            mensaje:
                "Contraseña actualizada correctamente."
        };

    }

    function actualizarPerfil(
        datos
    ) {

        if (!usuarioActual) {

            return {
                ok: false,
                mensaje:
                    "Debes iniciar sesión para actualizar tu perfil."
            };

        }


        const nombre =
            String(
                datos.nombre || ""
            ).trim();

        const apellido =
            String(
                datos.apellido || ""
            ).trim();


        if (
            !nombre ||
            !apellido
        ) {

            return {
                ok: false,
                mensaje:
                    "Nombre y apellido son obligatorios."
            };

        }


        const cambios = {

            nombre,

            apellido,

            fechaNacimiento:
                String(
                    datos.fechaNacimiento || ""
                ),

            telefono:
                String(
                    datos.telefono || ""
                ).trim(),

            region:
                String(
                    datos.region || ""
                ),

            comuna:
                String(
                    datos.comuna || ""
                ),

            direccion:
                String(
                    datos.direccion || ""
                ).trim()

        };


        setUsuarios(
            (usuariosActuales) =>
                usuariosActuales.map(
                    (usuario) => {

                        if (
                            usuario.id !==
                            usuarioActual.id
                        ) {

                            return usuario;

                        }


                        return {
                            ...usuario,
                            ...cambios
                        };

                    }
                )
        );


        const sesionActualizada = {
            ...usuarioActual,
            ...cambios
        };


        setUsuarioActual(
            sesionActualizada
        );


        return {
            ok: true,
            mensaje:
                "Perfil actualizado correctamente.",
            usuario:
                sesionActualizada
        };

    }

    return (

        <AuthContext.Provider
            value={{
                usuarios,
                usuarioActual,
                estaAutenticado:
                    Boolean(
                        usuarioActual
                    ),
                esAdmin:
                    usuarioActual?.rol === 
                    "admin",
                registrarUsuario,
                iniciarSesion,
                cerrarSesion,
                recuperarContrasena,
                actualizarPerfil
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export default AuthProvider;