import { formatearPrecio } from "../utils/moneda";
import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import useProducts from "../hooks/useProducts";
import useTitulo from "../hooks/useTitulo";

import ConfirmarCompraModal from "../components/ConfirmarCompraModal";
import { guardarCompra } from "../services/compraService";
import { REGIONES, obtenerComunas } from "../data/regionesComunas";
import { validarCheckout } from "../utils/validaciones";


// Texto que se muestra en la confirmación para cada método de pago.
const ETIQUETAS_PAGO = {
    transferencia: "Transferencia bancaria",
    "tarjeta-simulada": "Tarjeta bancaria — simulación"
};


function crearFormularioInicial(usuario) {

    return {
        nombre: usuario?.nombre || "",
        apellido: usuario?.apellido || "",
        correo: usuario?.correo || "",
        telefono: usuario?.telefono || "",
        direccion: usuario?.direccion || "",
        region: usuario?.region || "",
        comuna: usuario?.comuna || "",
        metodoPago: ""
    };

}


function Checkout() {

    useTitulo("Checkout | Rectabags");

    const navigate = useNavigate();

    const { usuarioActual } = useAuth();
    const { cargarProductos } = useProducts();

    const {
        carrito,
        cantidadProductos,
        subtotal,
        vaciarCarrito
    } = useCart();

    const [formulario, setFormulario] = useState(
        () => crearFormularioInicial(usuarioActual)
    );

    const [mensaje, setMensaje] = useState(null);

    const [compraRealizada, setCompraRealizada] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const envioEnCurso = useRef(false);

    // Controla la ventana de confirmación previa al registro de la compra.
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);


    if (!compraRealizada && carrito.length === 0) {

        return <Navigate to="/carrito" replace />;

    }


    function cambioFormulario(evento) {

        const { name, value } = evento.target;

        setFormulario((valores) => ({
            ...valores,
            [name]: value,
            // Al cambiar la región, la comuna anterior deja de ser válida.
            ...(name === "region" ? { comuna: "" } : {})
        }));

        if (mensaje) {
            setMensaje(null);
        }

    }


    /*
     * Valida el formulario. Si está completo no registra la compra:
     * abre la ventana de confirmación y espera la respuesta del usuario.
     */
    function envio(evento) {

        evento.preventDefault();
        if (envioEnCurso.current) return;

        const error =
            validarCheckout(
                formulario
            );


        if (error) {

            setMensaje({
                tipo: "danger",
                texto:
                    error
            });

            return;

        }

        setMostrarConfirmacion(true);

    }


    function cancelarConfirmacion() {

        setMostrarConfirmacion(false);

    }


    // Registra la compra. Solo corre cuando el usuario responde que sí.
    async function confirmarCompra() {
        if (envioEnCurso.current) return;
        envioEnCurso.current = true;
        setProcesando(true);
        setMostrarConfirmacion(false);
        try {
            // Los precios, el estado y el stock los determina el backend.
            const compra = await guardarCompra({
                nombreCliente: formulario.nombre.trim(),
                apellidoCliente: formulario.apellido.trim(),
                correoCliente: formulario.correo.trim().toLowerCase(),
                telefonoCliente: formulario.telefono.trim(),
                direccionCliente: formulario.direccion.trim(),
                region: formulario.region.trim(),
                comuna: formulario.comuna.trim(),
                metodoPago: formulario.metodoPago,
                items: carrito.map((item) => ({
                    idProducto: item.id,
                    cantidad: item.cantidad
                }))
            });
            setCompraRealizada(true);
            vaciarCarrito();
            // La compra ya fue confirmada; recargamos el stock sin volver a descontarlo.
            void cargarProductos();
            navigate("/compra-exitosa", {
                replace: true,
                state: { compra }
            });
        } catch (error) {
            navigate("/compra-error", {
                state: {
                    mensaje: error.response?.data?.mensaje || "No fue posible registrar la compra."
                }
            });
        } finally {
            envioEnCurso.current = false;
            setProcesando(false);
        }

    }

    return (

        <section className="py-5">

            <div className="container">

                <div className="mb-4">

                    <h1 className="display-6 fw-bold">Checkout</h1>

                    <p className="text-secondary">
                        Confirma tus datos y revisa tu pedido antes de finalizar.
                    </p>

                </div>


                {usuarioActual && (
                     <div
                        className="alert mb-4"
                        role="status"
                        style={{
                            backgroundColor: 'var(--rb-arena)',
                            border: 0,
                            borderLeft: '4px solid var(--rb-negro)'
                        }}
                    >
                        Hemos completado tus datos utilizando la información de tu perfil.
                    </div>
                )}


                 <div className="rounded-5 p-3 p-md-4 p-lg-5" style={{ backgroundColor: 'var(--rb-arena)' }}>

                <div className="row g-4">

                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-4 p-md-5">

                                <h2 className="h4 fw-bold mb-4">
                                    Datos del comprador
                                </h2>

                                <form id="form-checkout" onSubmit={envio} aria-busy={procesando}>

                                    <div className="row g-3">

                                        <div className="col-md-6">
                                            <label
                                                htmlFor="checkout-nombre"
                                                className="form-label fw-semibold"
                                            >
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                id="checkout-nombre"
                                                name="nombre"
                                                maxLength={50}
                                                className="form-control"
                                                value={formulario.nombre}
                                                onChange={cambioFormulario}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label
                                                htmlFor="checkout-apellido"
                                                className="form-label fw-semibold"
                                            >
                                                Apellido
                                            </label>
                                            <input
                                                type="text"
                                                id="checkout-apellido"
                                                name="apellido"
                                                maxLength={100}
                                                className="form-control"
                                                value={formulario.apellido}
                                                onChange={cambioFormulario}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label
                                                htmlFor="checkout-correo"
                                                className="form-label fw-semibold"
                                            >
                                                Correo electrónico
                                            </label>
                                            <input
                                                type="email"
                                                id="checkout-correo"
                                                name="correo"
                                                maxLength={100}
                                                className="form-control"
                                                value={formulario.correo}
                                                onChange={cambioFormulario}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label
                                                htmlFor="checkout-telefono"
                                                className="form-label fw-semibold"
                                            >
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                id="checkout-telefono"
                                                name="telefono"
                                                maxLength={20}
                                                className="form-control"
                                                value={formulario.telefono}
                                                onChange={cambioFormulario}
                                                required
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label
                                                htmlFor="checkout-direccion"
                                                className="form-label fw-semibold"
                                            >
                                                Dirección de despacho
                                            </label>
                                            <input
                                                type="text"
                                                id="checkout-direccion"
                                                name="direccion"
                                                maxLength={300}
                                                className="form-control"
                                                value={formulario.direccion}
                                                onChange={cambioFormulario}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label
                                                htmlFor="checkout-region"
                                                className="form-label fw-semibold"
                                            >
                                                Región
                                            </label>
                                            <select
                                                id="checkout-region"
                                                name="region"
                                                className="form-select"
                                                value={formulario.region}
                                                onChange={cambioFormulario}
                                                required
                                            >
                                                <option value="">
                                                    Selecciona una región
                                                </option>
                                                {REGIONES.map((region) => (
                                                    <option
                                                        key={region.nombre}
                                                        value={region.nombre}
                                                    >
                                                        {region.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label
                                                htmlFor="checkout-comuna"
                                                className="form-label fw-semibold"
                                            >
                                                Comuna
                                            </label>
                                            <select
                                                id="checkout-comuna"
                                                name="comuna"
                                                className="form-select"
                                                value={formulario.comuna}
                                                onChange={cambioFormulario}
                                                disabled={!formulario.region}
                                                required
                                            >
                                                <option value="">
                                                    Selecciona una comuna
                                                </option>
                                                {obtenerComunas(formulario.region).map((comuna) => (
                                                    <option key={comuna} value={comuna}>
                                                        {comuna}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-12">
                                            <label
                                                htmlFor="checkout-pago"
                                                className="form-label fw-semibold"
                                            >
                                                Método de pago
                                            </label>
                                            <select
                                                id="checkout-pago"
                                                name="metodoPago"
                                                className="form-select"
                                                value={formulario.metodoPago}
                                                onChange={cambioFormulario}
                                                required
                                            >
                                                <option value="">
                                                    Selecciona un método
                                                </option>
                                                <option value="transferencia">
                                                    Transferencia bancaria
                                                </option>
                                                <option value="tarjeta-simulada">
                                                    Tarjeta bancaria — simulación
                                                </option>
                                            </select>
                                        </div>

                                    </div>


                                    {mensaje && (
                                        <div
                                            className={`alert alert-${mensaje.tipo} mt-4 mb-0`}
                                            role="alert"
                                        >
                                            {mensaje.texto}
                                        </div>
                                    )}


                                    <button
                                        type="submit"
                                        disabled={procesando}
                                        className="btn btn-dark w-100 mt-4 py-2 fw-bold"
                                    >
                                        {procesando ? "Procesando compra…" : "Confirmar compra"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-5">

                        <div
                            className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-lg-top"
                            style={{ top: '110px' }}
                        >

                            <div className="px-4 py-3 text-white" style={{ backgroundColor: 'var(--rb-negro)' }}>
                                <h2 className="h5 mb-0">
                                    Resumen del pedido
                                </h2>
                            </div>

                            <div className="card-body p-4">
                                {carrito.map((item) => (
                                    <div
                                        key={item.id}
                                        className="d-flex justify-content-between gap-3 border-bottom py-3"
                                    >
                                        <div>
                                            <div className="fw-semibold">
                                                {item.nombre}
                                            </div>
                                            <div className="small text-secondary">
                                                Cantidad: {item.cantidad}
                                            </div>
                                        </div>

                                        <div className="fw-semibold text-nowrap">
                                            {formatearPrecio(
                                                Number(item.precio) * Number(item.cantidad)
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="d-flex justify-content-between mt-4">
                                    <span>Productos</span>
                                    <strong>{cantidadProductos}</strong>
                                </div>

                                <div className="d-flex justify-content-between fs-5 mt-3">
                                    <strong>Total productos</strong>
                                    <strong>{formatearPrecio(subtotal)}</strong>
                                </div>
  <p className="small text-secondary mt-3 mb-0">
                                    El costo de despacho no está incluido y se coordinará
                                    posteriormente.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                </div>

            </div>


            {mostrarConfirmacion && (
                <ConfirmarCompraModal
                    productos={carrito}
                    cantidadProductos={cantidadProductos}
                    subtotal={subtotal}
                    direccion={formulario.direccion}
                    comuna={formulario.comuna}
                    region={formulario.region}
                    metodoPago={ETIQUETAS_PAGO[formulario.metodoPago] || ""}
                    formatearPrecio={formatearPrecio}
                    onConfirmar={confirmarCompra}
                    onCancelar={cancelarConfirmacion}
                />
            )}

        </section>

    );

}


export default Checkout;
