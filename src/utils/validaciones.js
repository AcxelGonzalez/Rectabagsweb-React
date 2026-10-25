/*
 * Validaciones de formularios de Rectabags.
 *
 * Cada función devuelve:
 * - null   → el dato es válido.
 * - texto  → el mensaje de error para mostrar al usuario.
 */

export const DOMINIOS_PERMITIDOS = [
    "@gmail.com",
    "@profesor.duoc.cl",
    "@duoc.cl"
];


export function validarCorreo(correo) {

    const valor = String(correo || "").trim().toLowerCase();

    if (!valor) {
        return "Ingresa tu correo electrónico.";
    }

    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formato.test(valor)) {
        return "El correo no tiene un formato válido.";
    }

    const dominioValido = DOMINIOS_PERMITIDOS.some(
        (dominio) => valor.endsWith(dominio)
    );

    if (!dominioValido) {
        return "Solo se permiten correos " +
            DOMINIOS_PERMITIDOS.join(" o ") + ".";
    }

    return null;

}


export function validarRut(rut) {

    // Quita puntos, guion y espacios: "12.345.678-5" → "123456785"
    const limpio = String(rut || "")
        .replace(/[.\-\s]/g, "")
        .toUpperCase();

    if (!limpio) {
        return "Ingresa tu RUT.";
    }

    // 6 u 8 números + dígito verificador (número o K)
    if (!/^\d{6,8}[0-9K]$/.test(limpio)) {
        return "El RUT no tiene un formato válido. Ej: 12345678-9";
    }

    const cuerpo = limpio.slice(0, -1);
    const dvIngresado = limpio.slice(-1);

    // Algoritmo módulo 11
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);

    const dvEsperado =
        resto === 11 ? "0" :
        resto === 10 ? "K" :
        String(resto);

    if (dvIngresado !== dvEsperado) {
        return "El RUT ingresado no es válido.";
    }

    return null;

}


export function validarContrasena(contrasena) {

    const valor = String(contrasena || "");

    if (valor.length < 4 || valor.length > 10) {
        return "La contraseña debe tener entre 4 y 10 caracteres.";
    }

    return null;

}


export function validarFechaNacimiento(fecha) {

    if (!fecha) {
        return "Ingresa tu fecha de nacimiento.";
    }

    // Fecha de hoy en hora local, formato AAAA-MM-DD
    const ahora = new Date();

    const hoy = [
        ahora.getFullYear(),
        String(ahora.getMonth() + 1).padStart(2, "0"),
        String(ahora.getDate()).padStart(2, "0")
    ].join("-");

    if (fecha > hoy) {
        return "La fecha de nacimiento no puede ser futura.";
    }

    return null;

}


export function validarTelefono(telefono) {

    // Acepta "912345678" o "+56 9 1234 5678"
    const limpio = String(telefono || "")
        .replace(/\s/g, "")
        .replace(/^\+?56/, "");

    if (!/^9\d{8}$/.test(limpio)) {
        return "Ingresa un celular válido de 9 dígitos. Ej: 912345678";
    }

    return null;

}