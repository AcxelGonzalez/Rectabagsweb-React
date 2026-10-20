import React, {
    act
} from "react";

import {
    createRoot
} from "react-dom/client";

import AuthProvider
    from "../context/AuthProvider";

import useAuth
    from "../hooks/useAuth";


describe(
    "AuthProvider",
    () => {

        const CLAVE_USUARIOS =
            "recta_usuarios";

        const CLAVE_SESION =
            "recta_usuario_actual";


        let contenedor;
        let raiz;
        let authApi;


        const datosCliente = {

            nombre:
                "Marco",

            apellido:
                "Prueba",

            fechaNacimiento:
                "2000-05-10",

            rut:
                "12.345.678-5",

            telefono:
                "912345678",

            correo:
                "cliente@test.cl",

            contrasena:
                "Clave123!",

            region:
                "",

            comuna:
                "",

            direccion:
                "Dirección de prueba"

        };


        function ConsumidorPrueba() {

            authApi =
                useAuth();


            return React.createElement(
                "div",
                {
                    id:
                        "estado-auth"
                },

                authApi.estaAutenticado
                    ? "autenticado"
                    : "invitado"
            );

        }


        function renderizarAuth() {

            act(
                () => {

                    raiz.render(
                        React.createElement(
                            AuthProvider,
                            null,

                            React.createElement(
                                ConsumidorPrueba
                            )
                        )
                    );

                }
            );

        }


        function registrarCliente() {

            let resultado;


            act(
                () => {

                    resultado =
                        authApi
                            .registrarUsuario(
                                datosCliente
                            );

                }
            );


            return resultado;

        }


        beforeAll(
            () => {

                globalThis
                    .IS_REACT_ACT_ENVIRONMENT =
                    true;

            }
        );


        beforeEach(
            () => {

                localStorage.clear();


                authApi =
                    null;


                contenedor =
                    document.createElement(
                        "div"
                    );


                document.body.appendChild(
                    contenedor
                );


                raiz =
                    createRoot(
                        contenedor
                    );

            }
        );


        afterEach(
            () => {

                act(
                    () => {

                        raiz.unmount();

                    }
                );


                contenedor.remove();


                localStorage.clear();

            }
        );


        afterAll(
            () => {

                delete globalThis
                    .IS_REACT_ACT_ENVIRONMENT;

            }
        );


        it(
            "debe cargar el usuario administrador inicial",
            () => {

                renderizarAuth();


                const administrador =
                    authApi.usuarios.find(
                        (usuario) =>
                            usuario.correo ===
                            "admin@rectabags.cl"
                    );


                expect(
                    administrador
                ).toBeDefined();


                expect(
                    administrador.rol
                ).toBe(
                    "admin"
                );


                expect(
                    authApi.estaAutenticado
                ).toBe(false);

            }
        );


        it(
            "debe registrar correctamente un usuario cliente",
            () => {

                renderizarAuth();


                const resultado =
                    registrarCliente();


                expect(
                    resultado.ok
                ).toBe(true);


                expect(
                    resultado.usuario.correo
                ).toBe(
                    "cliente@test.cl"
                );


                expect(
                    resultado.usuario.rol
                ).toBe(
                    "cliente"
                );


                expect(
                    authApi.usuarios.length
                ).toBe(2);

            }
        );


        it(
            "debe normalizar el correo al registrar un usuario",
            () => {

                renderizarAuth();


                let resultado;


                act(
                    () => {

                        resultado =
                            authApi
                                .registrarUsuario({
                                    ...datosCliente,

                                    correo:
                                        "  CLIENTE@TEST.CL  "
                                });

                    }
                );


                expect(
                    resultado.ok
                ).toBe(true);


                expect(
                    resultado.usuario.correo
                ).toBe(
                    "cliente@test.cl"
                );

            }
        );


        it(
            "debe rechazar un correo duplicado aunque cambien mayúsculas y espacios",
            () => {

                renderizarAuth();


                registrarCliente();


                let resultadoDuplicado;


                act(
                    () => {

                        resultadoDuplicado =
                            authApi
                                .registrarUsuario({
                                    ...datosCliente,

                                    rut:
                                        "99.999.999-9",

                                    correo:
                                        "  CLIENTE@TEST.CL "
                                });

                    }
                );


                expect(
                    resultadoDuplicado.ok
                ).toBe(false);


                expect(
                    resultadoDuplicado.mensaje
                ).toBe(
                    "El correo ya se encuentra registrado."
                );

            }
        );


        it(
            "debe rechazar un RUT duplicado aunque tenga otro formato",
            () => {

                renderizarAuth();


                registrarCliente();


                let resultadoDuplicado;


                act(
                    () => {

                        resultadoDuplicado =
                            authApi
                                .registrarUsuario({
                                    ...datosCliente,

                                    correo:
                                        "otro@test.cl",

                                    rut:
                                        "12345678-5"
                                });

                    }
                );


                expect(
                    resultadoDuplicado.ok
                ).toBe(false);


                expect(
                    resultadoDuplicado.mensaje
                ).toBe(
                    "El RUT ya se encuentra registrado."
                );

            }
        );


        it(
            "debe rechazar credenciales incorrectas",
            () => {

                renderizarAuth();


                const resultado =
                    authApi.iniciarSesion(
                        "usuario@inexistente.cl",
                        "incorrecta"
                    );


                expect(
                    resultado.ok
                ).toBe(false);


                expect(
                    authApi.usuarioActual
                ).toBeNull();


                expect(
                    authApi.estaAutenticado
                ).toBe(false);

            }
        );


        it(
            "debe iniciar sesión correctamente con un cliente registrado",
            () => {

                renderizarAuth();


                registrarCliente();


                let resultadoLogin;


                act(
                    () => {

                        resultadoLogin =
                            authApi
                                .iniciarSesion(
                                    "CLIENTE@TEST.CL",
                                    "Clave123!"
                                );

                    }
                );


                expect(
                    resultadoLogin.ok
                ).toBe(true);


                expect(
                    authApi.estaAutenticado
                ).toBe(true);


                expect(
                    authApi.usuarioActual.correo
                ).toBe(
                    "cliente@test.cl"
                );


                expect(
                    authApi.usuarioActual.rol
                ).toBe(
                    "cliente"
                );


                expect(
                    authApi.usuarioActual
                        .contrasena
                ).toBeUndefined();

            }
        );


        it(
            "debe identificar correctamente una sesión de administrador",
            () => {

                renderizarAuth();


                let resultado;


                act(
                    () => {

                        resultado =
                            authApi
                                .iniciarSesion(
                                    "admin@rectabags.cl",
                                    "Admin123!"
                                );

                    }
                );


                expect(
                    resultado.ok
                ).toBe(true);


                expect(
                    authApi.estaAutenticado
                ).toBe(true);


                expect(
                    authApi.esAdmin
                ).toBe(true);


                expect(
                    authApi.usuarioActual.rol
                ).toBe(
                    "admin"
                );

            }
        );


        it(
            "debe cerrar la sesión y eliminarla de LocalStorage",
            () => {

                renderizarAuth();


                act(
                    () => {

                        authApi
                            .iniciarSesion(
                                "admin@rectabags.cl",
                                "Admin123!"
                            );

                    }
                );


                expect(
                    localStorage.getItem(
                        CLAVE_SESION
                    )
                ).not.toBeNull();


                act(
                    () => {

                        authApi
                            .cerrarSesion();

                    }
                );


                expect(
                    authApi.usuarioActual
                ).toBeNull();


                expect(
                    authApi.estaAutenticado
                ).toBe(false);


                expect(
                    localStorage.getItem(
                        CLAVE_SESION
                    )
                ).toBeNull();

            }
        );


        it(
            "debe rechazar la recuperación de contraseña con datos incorrectos",
            () => {

                renderizarAuth();


                registrarCliente();


                let resultado;


                act(
                    () => {

                        resultado =
                            authApi
                                .recuperarContrasena(
                                    "cliente@test.cl",
                                    "99.999.999-9",
                                    "Nueva123!"
                                );

                    }
                );


                expect(
                    resultado.ok
                ).toBe(false);

            }
        );


        it(
            "debe actualizar la contraseña y permitir iniciar sesión con la nueva",
            () => {

                renderizarAuth();


                registrarCliente();


                let recuperacion;


                act(
                    () => {

                        recuperacion =
                            authApi
                                .recuperarContrasena(
                                    "CLIENTE@TEST.CL",
                                    "123456785",
                                    "NuevaClave123!"
                                );

                    }
                );


                expect(
                    recuperacion.ok
                ).toBe(true);


                const loginAnterior =
                    authApi.iniciarSesion(
                        "cliente@test.cl",
                        "Clave123!"
                    );


                expect(
                    loginAnterior.ok
                ).toBe(false);


                let loginNuevo;


                act(
                    () => {

                        loginNuevo =
                            authApi
                                .iniciarSesion(
                                    "cliente@test.cl",
                                    "NuevaClave123!"
                                );

                    }
                );


                expect(
                    loginNuevo.ok
                ).toBe(true);


                expect(
                    authApi.estaAutenticado
                ).toBe(true);

            }
        );


        it(
            "debe impedir actualizar el perfil sin iniciar sesión",
            () => {

                renderizarAuth();


                const resultado =
                    authApi.actualizarPerfil({
                        nombre:
                            "Nuevo",

                        apellido:
                            "Nombre"
                    });


                expect(
                    resultado.ok
                ).toBe(false);


                expect(
                    resultado.mensaje
                ).toBe(
                    "Debes iniciar sesión para actualizar tu perfil."
                );

            }
        );


        it(
            "debe actualizar el perfil del usuario autenticado",
            () => {

                renderizarAuth();


                registrarCliente();


                act(
                    () => {

                        authApi
                            .iniciarSesion(
                                "cliente@test.cl",
                                "Clave123!"
                            );

                    }
                );


                let resultado;


                act(
                    () => {

                        resultado =
                            authApi
                                .actualizarPerfil({
                                    nombre:
                                        "Marco Actualizado",

                                    apellido:
                                        "Carrasco",

                                    fechaNacimiento:
                                        "2000-05-10",

                                    telefono:
                                        "987654321",

                                    region:
                                        "Metropolitana",

                                    comuna:
                                        "Santiago",

                                    direccion:
                                        "Nueva dirección 123"
                                });

                    }
                );


                expect(
                    resultado.ok
                ).toBe(true);


                expect(
                    authApi.usuarioActual.nombre
                ).toBe(
                    "Marco Actualizado"
                );


                expect(
                    authApi.usuarioActual.telefono
                ).toBe(
                    "987654321"
                );


                const usuarioGuardado =
                    authApi.usuarios.find(
                        (usuario) =>
                            usuario.id ===
                            authApi.usuarioActual.id
                    );


                expect(
                    usuarioGuardado.nombre
                ).toBe(
                    "Marco Actualizado"
                );


                expect(
                    usuarioGuardado.direccion
                ).toBe(
                    "Nueva dirección 123"
                );

            }
        );


        it(
            "debe persistir usuarios y sesión en LocalStorage",
            () => {

                renderizarAuth();


                registrarCliente();


                act(
                    () => {

                        authApi
                            .iniciarSesion(
                                "cliente@test.cl",
                                "Clave123!"
                            );

                    }
                );


                const usuariosGuardados =
                    JSON.parse(
                        localStorage.getItem(
                            CLAVE_USUARIOS
                        )
                    );


                const sesionGuardada =
                    JSON.parse(
                        localStorage.getItem(
                            CLAVE_SESION
                        )
                    );


                expect(
                    usuariosGuardados.some(
                        (usuario) =>
                            usuario.correo ===
                            "cliente@test.cl"
                    )
                ).toBe(true);


                expect(
                    sesionGuardada.correo
                ).toBe(
                    "cliente@test.cl"
                );


                expect(
                    sesionGuardada
                        .contrasena
                ).toBeUndefined();

            }
        );

    }
);