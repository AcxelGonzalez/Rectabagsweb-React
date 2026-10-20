import {
    useEffect,
    useState
} from "react";

import AuthContext
    from "./AuthContext";


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


function leerUsuariosGuardados() {

    try {

        const usuarios =
            JSON.parse(
                localStorage.getItem(
                    CLAVE_USUARIOS
                )
            );


        return Array.isArray(
            usuarios
        )
            ? usuarios
            : [];

    } catch {

        return [];

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
            id: usuario.id,
            nombre:
                usuario.nombre,
            apellido:
                usuario.apellido,
            rut:
                usuario.rut,
            correo:
                usuario.correo,
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


    return (

        <AuthContext.Provider
            value={{
                usuarios,
                usuarioActual,
                estaAutenticado:
                    Boolean(
                        usuarioActual
                    ),
                registrarUsuario,
                iniciarSesion,
                cerrarSesion,
                recuperarContrasena
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export default AuthProvider;