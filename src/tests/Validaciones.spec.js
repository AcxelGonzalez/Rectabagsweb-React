import {
    validarCorreo,
    validarRut,
    validarContrasena,
    validarFechaNacimiento,
    validarTelefono,
    validarCheckout
} from "../utils/validaciones";


describe("Validaciones de formularios", () => {

    /* ---------- CORREO ---------- */

    it("debe aceptar correos de los dominios permitidos por la ERS", () => {
        expect(validarCorreo("cliente@gmail.com")).toBeNull();
        expect(validarCorreo("alumno@duoc.cl")).toBeNull();
        expect(validarCorreo("profe@profesor.duoc.cl")).toBeNull();
    });

    it("debe rechazar correos de otros dominios", () => {
        expect(validarCorreo("cliente@hotmail.com")).not.toBeNull();
    });

    it("debe rechazar correos con formato inválido", () => {
        expect(validarCorreo("cliente@gmail")).not.toBeNull();
    });


    /* ---------- RUT ---------- */

    it("debe aceptar un RUT válido con y sin puntos", () => {
        expect(validarRut("12.345.678-5")).toBeNull();
        expect(validarRut("123456785")).toBeNull();
    });

    it("debe rechazar un RUT con dígito verificador incorrecto", () => {
        expect(validarRut("12345678-9")).not.toBeNull();
    });

    it("debe aceptar un RUT cuyo dígito verificador es K", () => {
        expect(validarRut("10000013-K")).toBeNull();
    });


    /* ---------- CONTRASEÑA ---------- */

    it("debe aceptar contraseñas de 4 y de 10 caracteres", () => {
        expect(validarContrasena("abcd")).toBeNull();
        expect(validarContrasena("abcdefghij")).toBeNull();
    });

    it("debe rechazar contraseñas de menos de 4 o más de 10 caracteres", () => {
        expect(validarContrasena("abc")).not.toBeNull();
        expect(validarContrasena("abcdefghijk")).not.toBeNull();
    });


    /* ---------- FECHA DE NACIMIENTO ---------- */

    it("debe rechazar una fecha de nacimiento futura", () => {
        const proximoAnio = new Date().getFullYear() + 1;

        expect(validarFechaNacimiento("2000-05-10")).toBeNull();
        expect(validarFechaNacimiento(`${proximoAnio}-01-01`)).not.toBeNull();
    });


    /* ---------- TELÉFONO ---------- */

    it("debe aceptar celulares chilenos y rechazar números inválidos", () => {
        expect(validarTelefono("912345678")).toBeNull();
        expect(validarTelefono("+56 9 1234 5678")).toBeNull();
        expect(validarTelefono("812345678")).not.toBeNull();
    });

    /* ---------- CHECKOUT ---------- */

    describe(
        "validarCheckout",
        () => {

            const checkoutValido = {
                nombre:
                    "Marco",

                apellido:
                    "Carrasco",

                correo:
                    "cliente@gmail.com",

                telefono:
                    "+56 9 1234 5678",

                direccion:
                    "Av. Principal 123",

                region:
                    "Región Metropolitana de Santiago",

                comuna:
                    "Santiago",

                metodoPago:
                    "transferencia"
            };


            it(
                "debe aceptar un checkout con datos válidos",
                () => {

                    expect(
                        validarCheckout(
                            checkoutValido
                        )
                    ).toBeNull();

                }
            );


            it(
                "debe rechazar un checkout con campos obligatorios vacíos",
                () => {

                    const formulario = {
                        ...checkoutValido,
                        direccion: ""
                    };


                    expect(
                        validarCheckout(
                            formulario
                        )
                    ).not.toBeNull();

                }
            );


            it(
                "debe rechazar un correo no permitido en checkout",
                () => {

                    const formulario = {
                        ...checkoutValido,
                        correo:
                            "cliente@hotmail.com"
                    };


                    expect(
                        validarCheckout(
                            formulario
                        )
                    ).not.toBeNull();

                }
            );


            it(
                "debe rechazar un teléfono inválido en checkout",
                () => {

                    const formulario = {
                        ...checkoutValido,
                        telefono:
                            "123456"
                    };


                    expect(
                        validarCheckout(
                            formulario
                        )
                    ).not.toBeNull();

                }
            );

        }
    );

});