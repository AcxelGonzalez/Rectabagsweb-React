import PaginaTerminos from '../components/PaginaTerminos';
import useTitulo from '../hooks/useTitulo';

const secciones = [
    {
        titulo: '1. Confirmación de Stock y Precios',
        texto: 'Todos los precios están expresados en pesos chilenos (CLP). El stock de productos está sujeto a disponibilidad inmediata. La confirmación final de la compra se concretará una vez validado el pago con la entidad bancaria correspondiente.',
    },
    {
        titulo: '2. Métodos de Pago',
        texto: 'En esta versión del proyecto, el checkout permite seleccionar transferencia bancaria o tarjeta bancaria simulada. No se realizan cargos reales ni se almacenan datos financieros o bancarios del usuario.',
    },
    {
        titulo: '3. Tiempos y Costos de Envío',
        texto: 'El costo de despacho no está incluido en el total de productos mostrado durante el checkout. El despacho será coordinado posteriormente según la dirección, comuna y región ingresadas por el comprador.',
    },
    {
        titulo: '4. Garantía y Cambios',
        texto: 'Todo producto cuenta con garantía legal en caso de fallas de fabricación. Para solicitar un cambio o devolución, el cliente debe presentar el número de compra generado por Rectabags, identificado con el prefijo RB-, e iniciar la solicitud mediante nuestro canal formal de atención al cliente.',
    },
];

function TerminosCompra() {
    useTitulo('Términos de Compra | Rectabags');

    return (
        <PaginaTerminos
            titulo="Condiciones de Venta"
            subtitulo="Políticas de pago, despacho y garantías de tu pedido"
            tituloCaja="TÉRMINOS DE COMPRA"
            intro={
                <>
                    Al procesar una orden de compra en <strong>Rectabags</strong>, el usuario acepta las siguientes condiciones comerciales relativas al pago, preparación y entrega de los productos seleccionados en el carrito.
                </>
            }
            secciones={secciones}
            rutaVolver="/carrito"
            textoVolver="Volver al Carrito"
            preguntaAyuda="¿Dudas sobre tu compra?"
            textoEnlaceAyuda="Contáctanos."
        />
    );
}

export default TerminosCompra;
