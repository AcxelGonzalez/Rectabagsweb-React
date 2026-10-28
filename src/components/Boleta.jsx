import { colorEstado } from "../services/compraService";

const METODOS_PAGO = {
    "transferencia": "Transferencia bancaria",
    "tarjeta-simulada": "Tarjeta bancaria (simulada)"
};

function formatearPrecio(valor) {
    return Number(valor).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}

/*
 * Muestra una boleta completa.
 *
 * Props:
 * - compra: la compra a mostrar.
 * - controlEstado: (opcional) elemento para cambiar el estado.
 *   El admin envía un selector; el cliente no envía nada
 *   y solo ve el estado como etiqueta.
 */
function Boleta({ compra, controlEstado }) {

    const { cliente } = compra;

    return (

        <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 p-md-5">

                <div className="d-flex flex-wrap justify-content-between gap-2 mb-4">

                    <div>
                        <h1 className="h3 fw-bold mb-1">Boleta {compra.id}</h1>
                        <div className="text-secondary">
                            {new Date(compra.fecha).toLocaleString("es-CL")}
                        </div>
                    </div>

                    {controlEstado || (
                        <span className={`badge ${colorEstado(compra.estado)} align-self-start text-capitalize`}>
                            {compra.estado}
                        </span>
                    )}

                </div>

                <div className="row g-4 mb-4">

                    <div className="col-md-6">
                        <h2 className="h6 fw-bold">Cliente</h2>
                        <div>{cliente.nombre} {cliente.apellido}</div>
                        <div className="text-secondary">{cliente.correo}</div>
                        <div className="text-secondary">{cliente.telefono}</div>
                    </div>

                    <div className="col-md-6">
                        <h2 className="h6 fw-bold">Despacho</h2>
                        <div>{cliente.direccion}</div>
                        <div className="text-secondary">
                            {cliente.comuna}, {cliente.region}
                        </div>
                        <div className="text-secondary">
                            Pago: {METODOS_PAGO[compra.metodoPago] || compra.metodoPago}
                        </div>
                    </div>

                </div>

                <div className="table-responsive">
                    <table className="table align-middle">

                        <thead className="table-light">
                            <tr>
                                <th>Producto</th>
                                <th className="text-end">Precio</th>
                                <th className="text-center">Cantidad</th>
                                <th className="text-end">Subtotal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {compra.productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.nombre}</td>
                                    <td className="text-end">{formatearPrecio(producto.precio)}</td>
                                    <td className="text-center">{producto.cantidad}</td>
                                    <td className="text-end">
                                        {formatearPrecio(producto.precio * producto.cantidad)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot>
                            <tr>
                                <th colSpan="3" className="text-end">Total</th>
                                <th className="text-end">{formatearPrecio(compra.subtotal)}</th>
                            </tr>
                        </tfoot>

                    </table>
                </div>

            </div>
        </div>

    );

}

export default Boleta;