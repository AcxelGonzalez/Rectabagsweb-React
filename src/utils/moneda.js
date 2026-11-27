// Conservar los centavos del backend y mostrar enteros sin fracción.
export function formatearPrecio(valor) {
    const numero = Number(valor);
    return numero.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: Number.isInteger(numero) ? 0 : 2,
        maximumFractionDigits: 2
    });
}
