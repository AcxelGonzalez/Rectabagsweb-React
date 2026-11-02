/*
 * Regiones de Chile con sus comunas.
 * Se usa en Registro, Perfil y Checkout para
 * que la lista de comunas dependa de la región elegida.
 */
export const REGIONES = [
    {
        nombre: "Región Metropolitana",
        comunas: [
            "Santiago",
            "Providencia",
            "Ñuñoa",
            "Las Condes",
            "La Florida",
            "Maipú",
            "Til Til",
            "Puente Alto"
        ]
    },
    {
        nombre: "Región de Valparaíso",
        comunas: [
            "Valparaíso",
            "Viña del Mar",
            "Concón",
            "Quilpué",
            "Villa Alemana",
            "Quillota",
            "San Antonio"
        ]
    },
    {
        nombre: "Región del Biobío",
        comunas: [
            "Concepción",
            "Talcahuano",
            "San Pedro de la Paz",
            "Chiguayante",
            "Hualpén",
            "Coronel",
            "Los Ángeles"
        ]
    }
];

/*
 * Devuelve las comunas de una región.
 * Si la región no existe (o está vacía), devuelve [].
 */
export function obtenerComunas(nombreRegion) {

    const region = REGIONES.find(
        (item) => item.nombre === nombreRegion
    );

    return region ? region.comunas : [];

}