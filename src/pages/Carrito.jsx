import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import useTitulo from '../hooks/useTitulo';
import useCart from "../hooks/useCart";

function Carrito() {
    // Lógica
    useTitulo('Carro de Compras | Rectabags');

    const navigate =
        useNavigate(); 

    const {
        carrito,
        cambiarCantidad,
        eliminarProducto:
            eliminarDelCarrito,
        cantidadProductos,
        subtotal
    } = useCart();

    const [terminos, setTerminos] = useState(false);
    const [productoEliminar, setProductoEliminar] = useState(null);

    // Elimina el producto seleccionado
    function confirmarEliminacion() {

        if (!productoEliminar) {

            return;

        }


        eliminarDelCarrito(
            productoEliminar.id
        );


        setProductoEliminar(null);

    }

    // Valida el carrito antes de pagar
    function procederPago() {

        if (!terminos) {

            return;

        }


        navigate(
            "/checkout"
        );

    }

    const precio = valor => '$' + Number(valor).toLocaleString('es-CL');

    // Render
    return (
        <div className="py-5 mt-5">
            <div className="container py-4">

                {/* Encabezado */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <h1 className="display-6 fw-bold titulo-mono mb-2">Tu carrito</h1>
                        <p className="text-secondary mb-0">
                            {cantidadProductos} {cantidadProductos === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                        </p>
                    </div>
                    <Link to="/catalogo" className="btn btn-outline-dark rounded-pill px-4">
                        Seguir comprando
                    </Link>
                </div>

                {/* Contenedor principal */}
                <div className="rounded-5 p-3 p-md-4 p-lg-5" style={{ backgroundColor: '#E8DED8' }}>
                    <div className="row g-4 align-items-start">

                        {/* Lista de productos */}
                        <div className="col-lg-8">
                            {carrito.length === 0 ? (
                                <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 text-center h-100">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-4"
                                            style={{ width: '90px', height: '90px', fontSize: '42px' }}>
                                            🛍️
                                        </div>
                                        <h2 className="h4 fw-bold mb-3">Tu carrito está vacío</h2>
                                        <p className="text-secondary mb-4">
                                            Explora nuestros productos y encuentra tu próximo compañero de ruta.
                                        </p>
                                        <Link to="/catalogo" className="btn btn-dark rounded-pill px-4 py-2">
                                            Explorar catálogo
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {carrito.map(item => (
                                        <div className="card border-0 rounded-4 shadow-sm p-3 p-md-4" key={item.id}>
                                            <div className="row g-3 align-items-center">

                                                {/* Imagen */}
                                                <div className="col-4 col-md-3">
                                                    <div className="bg-light rounded-4 d-flex align-items-center justify-content-center p-2"
                                                        style={{ height: '150px' }}>
                                                        {item.imagen ? (
                                                            <img src={item.imagen} alt={item.nombre}
                                                                className="img-fluid w-100 h-100 object-fit-contain" />
                                                        ) : (
                                                            <span className="fs-1">🛍️</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Información */}
                                                <div className="col-8 col-md-9">
                                                    <div className="d-flex justify-content-between align-items-start gap-2">
                                                        <div>
                                                            <h2 className="h5 fw-bold mb-1">{item.nombre}</h2>
                                                            <p className="small text-secondary mb-2">
                                                                {precio(item.precio)} / unidad
                                                            </p>
                                                        </div>
                                                        <button type="button" className="btn btn-outline-danger btn-sm rounded-circle"
                                                            title="Eliminar producto" aria-label={`Eliminar ${item.nombre}`}
                                                            onClick={() => setProductoEliminar(item)}>
                                                            ×
                                                        </button>
                                                    </div>

                                                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
                                                        <div className="btn-group border rounded-3" role="group" aria-label="Cantidad">
                                                            <button type="button" className="btn btn-light"
                                                                disabled={Number(item.cantidad) <= 1}
                                                                onClick={() => cambiarCantidad(item.id, -1)}>−</button>
                                                            <span className="d-flex align-items-center justify-content-center px-3 bg-white">
                                                                {item.cantidad}
                                                            </span>
                                                            <button type="button" className="btn btn-light"
                                                                disabled={Number(item.cantidad) >= (item.stock ?? 99)}
                                                                onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                                                        </div>
                                                        <span className="h5 fw-bold mb-0">
                                                            {precio(item.precio * item.cantidad)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Resumen de compra */}
                        <div className="col-lg-4">
                            <div className="card border-0 rounded-4 shadow-sm p-3 p-md-4">
                                <div className="card-body p-2">
                                    <h2 className="h4 fw-bold mb-4">Resumen de compra</h2>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-secondary">Productos ({cantidadProductos})</span>
                                        <span className="fw-semibold">{precio(subtotal)}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="text-secondary">Envío</span>
                                        <span className="text-secondary small">Por calcular</span>
                                    </div>

                                    <hr className="mb-4" />

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <span className="fw-bold fs-5">Subtotal</span>
                                        <span className="fw-bold fs-4">{precio(subtotal)}</span>
                                    </div>

                                    {/* Términos y condiciones */}
                                    <div className="form-check mb-4">
                                        <input type="checkbox" className="form-check-input" id="aceptoTerminos"
                                            checked={terminos} onChange={e => setTerminos(e.target.checked)} />
                                        <label className="form-check-label small" htmlFor="aceptoTerminos">
                                            Acepto los{' '}
                                            <Link to="/terminos-compra" target="_blank" rel="noopener noreferrer"
                                                className="text-dark text-decoration-underline">
                                                términos y condiciones
                                            </Link> (*)
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-dark w-100 fw-bold"
                                        onClick={procederPago}
                                        disabled={
                                            !terminos ||
                                            carrito.length === 0
                                        }
                                    >
                                        Proceder al pago
                                    </button>

                                    <p className="small text-secondary text-center mt-3 mb-4">
                                        Los gastos de envío se calcularán antes de finalizar la compra.
                                    </p>

                                    {/* Medios de pago */}
                                    <div className="border-top pt-3 text-center">
                                        <p className="small text-secondary mb-2">Medios de pago</p>
                                        <div className="d-flex flex-wrap justify-content-center gap-2">
                                            <span className="badge bg-light text-dark border">Mastercard</span>
                                            <span className="badge bg-light text-dark border">VISA</span>
                                            <span className="badge bg-light text-dark border">Webpay</span>
                                            <span className="badge bg-light text-dark border">Mercado Pago</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Confirmación de eliminación */}
            {productoEliminar && (
                <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true"
                    aria-labelledby="tituloEliminar" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 p-3 shadow">
                            <div className="modal-header border-0 pb-0">
                                <h2 className="modal-title h5 fw-bold" id="tituloEliminar">Eliminar producto</h2>
                                <button type="button" className="btn-close" aria-label="Cerrar"
                                    onClick={() => setProductoEliminar(null)} />
                            </div>
                            <div className="modal-body py-3">
                                <p className="text-secondary mb-0">
                                    ¿Deseas eliminar <strong>{productoEliminar.nombre}</strong> de tu carrito?
                                </p>
                            </div>
                            <div className="modal-footer border-0 pt-0 d-flex gap-2">
                                <button type="button" className="btn btn-light flex-fill rounded-3"
                                    onClick={() => setProductoEliminar(null)}>Cancelar</button>
                                <button type="button" className="btn btn-danger flex-fill rounded-3"
                                    onClick={confirmarEliminacion}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Carrito;
