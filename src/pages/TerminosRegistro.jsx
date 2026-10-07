import PaginaTerminos from '../components/PaginaTerminos.jsx';
import useTitulo from '../hooks/useTitulo';

const secciones = [
    {
        titulo: '1. Registro de Cuenta y Datos Personales',
        texto: 'Para realizar compras y acceder al historial de pedidos, el usuario debe registrar sus datos personales de forma verídica y actualizada. Toda la información recopilada será tratada de forma confidencial y utilizada exclusivamente para el procesamiento de envíos, emisión de comprobantes y gestión interna de compras.',
    },
    {
        titulo: '2. Autenticación y Seguridad',
        texto: 'El usuario es responsable de mantener la confidencialidad de su contraseña y de restringir el acceso a su dispositivo. Cualquier actividad realizada con sus credenciales de acceso se considerará de su absoluta responsabilidad.',
    },
    {
        titulo: '3. Precios y Compras',
        texto: 'Los precios informados en el catálogo están en moneda nacional (CLP) e incluyen impuestos correspondientes. Los costos de envío y el cálculo total se confirmarán antes de procesar el pago final en la plataforma.',
    },
    {
        titulo: '4. Políticas de Despacho y Devoluciones',
        texto: 'Los plazos de entrega dependerán de la región y ciudad seleccionadas. Rectabags se compromete a notificar cualquier cambio en el estado de los envíos registrados dentro del historial de la cuenta.',
    },
];

function TerminosRegistro() {
    useTitulo('Términos y Condiciones | Rectabags');

    return (
        <PaginaTerminos
            titulo="Términos del Servicio"
            subtitulo="Condiciones de uso y registro de cuenta en Rectabags"
            tituloCaja="TÉRMINOS Y CONDICIONES"
            intro={
                <>
                    Bienvenido a <strong>Rectabags</strong>. Al registrarte o iniciar sesión en nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones de uso. Por favor, léelos detenidamente antes de realizar transacciones o gestionar tu cuenta.
                </>
            }
            secciones={secciones}
            rutaVolver="/registro"
            textoVolver="Volver al Registro"
            preguntaAyuda="¿Preguntas?"
            textoEnlaceAyuda="Contáctanos aquí."
        />
    );
}

export default TerminosRegistro;
