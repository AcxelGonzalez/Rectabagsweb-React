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

/*
 * Valida los datos necesarios para completar una compra.
 *
 * Reutiliza las reglas generales del proyecto para correo
 * y teléfono, evitando mantener validaciones diferentes
 * entre Registro, Auth y Checkout.
 */
export function validarCheckout(formulario) {

    const camposObligatorios = [
        "nombre",
        "apellido",
        "correo",
        "telefono",
        "direccion",
        "region",
        "comuna",
        "metodoPago"
    ];


    const faltaCampo =
        camposObligatorios.some(
            (campo) =>
                !String(
                    formulario?.[campo] || ""
                ).trim()
        );


    if (faltaCampo) {

        return "Debes completar todos los datos requeridos para continuar.";

    }


    const errorCorreo =
        validarCorreo(
            formulario.correo
        );


    if (errorCorreo) {

        return errorCorreo;

    }


    const errorTelefono =
        validarTelefono(
            formulario.telefono
        );


    if (errorTelefono) {

        return errorTelefono;

    }


    return null;

}

/*
 * Validaciones del formulario de productos (panel administrador).
 * Siguen la misma convención: null = válido, texto = mensaje de error.
 */

export const CATEGORIAS_PRODUCTO = [
    "mochilas",
    "cilindros",
    "musette",
    "otros"
];


export function validarNombreProducto(nombre) {

    const valor = String(nombre || "").trim();

    if (!valor) {
        return "Ingresa el nombre del producto.";
    }

    if (valor.length < 3) {
        return "El nombre debe tener al menos 3 caracteres.";
    }

    if (valor.length > 60) {
        return "El nombre no puede superar los 60 caracteres.";
    }

    return null;

}


export function validarPrecioProducto(precio) {

    if (precio === undefined || precio === null || precio === "") {
        return "Ingresa el precio del producto.";
    }

    const valor = Number(precio);

    if (!Number.isFinite(valor)) {
        return "El precio debe ser un número.";
    }

    if (valor <= 0) {
        return "El precio debe ser mayor que 0.";
    }

    return null;

}


export function validarStockProducto(stock) {

    if (stock === undefined || stock === null || stock === "") {
        return "Ingresa el stock del producto.";
    }

    const valor = Number(stock);

    if (!Number.isFinite(valor)) {
        return "El stock debe ser un número.";
    }

    if (valor < 0) {
        return "El stock no puede ser negativo.";
    }

    if (!Number.isInteger(valor)) {
        return "El stock debe ser un número entero.";
    }

    return null;

}


export function validarCategoriaProducto(categoria) {

    const valor = String(categoria || "").trim().toLowerCase();

    if (!valor) {
        return "Selecciona una categoría.";
    }

    if (!CATEGORIAS_PRODUCTO.includes(valor)) {
        return "La categoría seleccionada no es válida.";
    }

    return null;

}


export function validarDescripcionProducto(descripcion) {

    const valor = String(descripcion || "").trim();

    if (!valor) {
        return "Ingresa una descripción del producto.";
    }

    if (valor.length < 10) {
        return "La descripción debe tener al menos 10 caracteres.";
    }

    return null;

}

/*
 * El precio de oferta es opcional.
 * Si se ingresa, debe ser mayor que 0 y menor que el precio normal.
 */
export function validarPrecioOferta(precioOferta, precio) {

    if (precioOferta === undefined || precioOferta === null || precioOferta === "") {
        return null;
    }

    const valor = Number(precioOferta);

    if (!Number.isFinite(valor)) {
        return "El precio de oferta debe ser un número.";
    }

    if (valor <= 0) {
        return "El precio de oferta debe ser mayor que 0.";
    }

    if (valor >= Number(precio)) {
        return "El precio de oferta debe ser menor que el precio normal.";
    }

    return null;

}


/*
 * El stock crítico es opcional.
 * Si se ingresa, debe ser un número entero no negativo.
 */
export function validarStockCritico(stockCritico) {

    if (stockCritico === undefined || stockCritico === null || stockCritico === "") {
        return null;
    }

    const valor = Number(stockCritico);

    if (!Number.isInteger(valor) || valor < 0) {
        return "El stock crítico debe ser un número entero no negativo.";
    }

    return null;

}

/*
 * Valida un producto completo y devuelve el primer error encontrado.
 * Se usa tanto en el formulario del panel como en la capa de datos.
 */
export function validarProducto(datos) {

    const producto = datos || {};

    const errores = [
        validarNombreProducto(producto.nombre),
        validarCategoriaProducto(producto.categoria),
        validarPrecioProducto(producto.precio),
        validarStockProducto(producto.stock),
        validarDescripcionProducto(producto.descripcion),
        validarPrecioOferta(producto.precioOferta, producto.precio),
        validarStockCritico(producto.stockCritico)
    ];

    return errores.find((error) => error !== null) || null;

}