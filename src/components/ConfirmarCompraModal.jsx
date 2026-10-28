/* Ventana de confirmación al registrar la compra, solo recibe por propiedades lo que debe mostrar y las dos funciones que debe ejecutar cuando el usuario responde.
 */
function ConfirmarCompraModal({
    productos,
    cantidadProductos,
    subtotal,
    direccion,
    comuna,
    region,
    metodoPago,
    formatearPrecio,
    onConfirmar,
    onCancelar
}) {

    const listaProductos =
        Array.isArray(productos)? productos: [];
    return (
        <>
            <div className="modal fade show d-block"role="dialog"aria-modal="true" aria-labelledby="tituloConfirmarCompra">

                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">

                    <div className="modal-content rounded-4 border-0 shadow">

                        <div className="modal-header border-0 pb-0">

                            <h2 className="modal-title h5 fw-bold" id="tituloConfirmarCompra">
                                Confirmar compra
                            </h2>

                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Cerrar"
                                onClick={onCancelar}/>

                        </div>

                        <div className="modal-body">

                            <h3 className="h6 fw-bold text-uppercase text-secondary mb-3">
                                Productos
                            </h3>


                            {
                                listaProductos.map(
                                    (item) => (
                                        <div key={item.id} className="d-flex justify-content-between gap-3 border-bottom py-2">

                                            <div>

                                                <div className="fw-semibold">
                                                    {item.nombre}
                                                </div>

                                                <div className="small text-secondary">
                                                    Cantidad: {item.cantidad}
                                                </div>

                                            </div>


                                            <div className="fw-semibold text-nowrap">

                                                {
                                                    formatearPrecio(
                                                        Number(item.precio) *
                                                        Number(item.cantidad)
                                                    )
                                                }

                                            </div>
                                        </div>
                                    )
                                )
                            }


                            <div className="d-flex justify-content-between mt-3">

                                <span>
                                    Productos
                                </span>

                                <strong>
                                    {cantidadProductos}
                                </strong>

                            </div>


                            <div className="d-flex justify-content-between fs-5 mt-2">

                                <strong>
                                    Subtotal
                                </strong>

                                <strong>
                                    {formatearPrecio(subtotal)}
                                </strong>

                            </div>


                            <h3 className="h6 fw-bold text-uppercase text-secondary mt-4 mb-2">
                                Dirección de despacho
                            </h3>

                            <p className="mb-0">
                                {direccion}
                            </p>

                            <p className="mb-0 text-secondary">
                                {comuna}, {region}
                            </p>


                            {
                                metodoPago && (

                                    <p className="small text-secondary mt-3 mb-0">
                                        Método de pago: {metodoPago}
                                    </p>

                                )
                            }


                            <p className="fw-semibold mt-4 mb-0">
                                ¿Deseas confirmar la compra?
                            </p>

                        </div>


                        <div className="modal-footer border-0 pt-0">

                            <button
                                type="button"
                                className="btn btn-outline-dark px-4"
                                onClick={onCancelar}
                            >
                                No
                            </button>

                            <button
                                type="button"
                                className="btn btn-dark px-4 fw-bold"
                                onClick={onConfirmar}
                            >
                                Sí, confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-backdrop fade show" />
        </>
    );
}
export default ConfirmarCompraModal;