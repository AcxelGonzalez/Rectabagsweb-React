import PaginaTerminos from '../components/PaginaTerminos';
import useTitulo from '../hooks/useTitulo';

const secciones = [
    {
        titulo: '1. Confirmación de Stock y Precios',
        texto: 'Todos los precios están expresados en pesos chilenos (CLP). El stock de productos está sujeto a disponibilidad inmediata. La confirmación final de la compra se concretará una vez validado el pago con la entidad bancaria correspondiente.',
    },
    {
        titulo: '2. Métodos de Pago',
        texto: 'Aceptamos pagos electrónicos a través de tarjetas de débito, crédito (Mastercard, VISA) y pasarelas de pago habilitadas (Webpay, Mercado Pago). Los datos financieros no son almacenados en nuestros servidores locales.',
    },
    {
        titulo: '3. Tiempos y Costos de Envío',
        texto: 'Los envíos se gestionan según la dirección y región ingresadas por el usuario. Los plazos estimados de entrega se calcularán al momento de procesar la orden y la información detallada del envío podrá ser consultada en el historial de pedidos de tu perfil.',
    },
    {
        titulo: '4. Garantía y Cambios',
        texto: 'Todo producto cuenta con garantía legal en caso de fallas de fabricación. Para solicitar un cambio o devolución, el cliente debe presentar su número de orden (ORD-XXXXXX) e iniciar la solicitud mediante nuestro canal formal de atención al cliente.',
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
            textoEnlaceAyuda="Atención al cliente aquí."
        />
    );
}

export default TerminosCompra;
