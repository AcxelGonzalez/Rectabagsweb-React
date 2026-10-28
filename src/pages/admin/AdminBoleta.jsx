import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo";
import {
    leerCompraPorId,
    actualizarEstadoCompra,
    ESTADOS_COMPRA,
    colorEstado
} from "../../services/compraService";

function formatearPrecio(valor) {
    return Number(valor).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}

const METODOS_PAGO = {
    "transferencia": "Transferencia bancaria",
    "tarjeta-simulada": "Tarjeta bancaria (simulada)"
};

function AdminBoleta() {

    const { id } = useParams();

    const [compra, setCompra] = useState(() => leerCompraPorId(id));

    useTitulo(`Boleta ${id} | Panel de administración`);

    if (!compra) {
        return (
            <section className="py-5">
                <div className="container">
                    <h1 className="h3 fw-bold mb-3">Orden no encontrada</h1>
                    <Link to="/admin/ordenes" className="btn btn-dark">
                        Volver a órdenes
                    </Link>
                </div>
            </section>
        );
    }

    const { cliente } = compra;

    function cambiarEstado(evento) {

        const actualizada = actualizarEstadoCompra(
            compra.id,
            evento.target.value
        );

        if (actualizada) {
            setCompra(actualizada);
        }

    }

    return (

        <section className="py-5">

            <div className="container" style={{ maxWidth: "820px" }}>

                <Link to="/admin/ordenes" className="small text-secondary">
                    ← Volver a órdenes
                </Link>

                <div className="card border-0 shadow-sm rounded-4 mt-2">
                    <div className="card-body p-4 p-md-5">

                        <div className="d-flex flex-wrap justify-content-between gap-2 mb-4">
                            <div>
                                <h1 className="h3 fw-bold mb-1">Boleta {compra.id}</h1>
                                <div className="text-secondary">
                                    {new Date(compra.fecha).toLocaleString("es-CL")}
                                </div>
                            </div>
                            <div className="align-self-start">
                                <label htmlFor="estado-compra" className="form-label small text-secondary mb-1">
                                    Estado de la orden
                                </label>
                                <select
                                    id="estado-compra"
                                    className="form-select form-select-sm text-capitalize"
                                    value={compra.estado}
                                    onChange={cambiarEstado}
                                >
                                    {ESTADOS_COMPRA.map((estado) => (
                                        <option key={estado} value={estado}>
                                            {estado}
                                        </option>
                                    ))}
                                </select>
                            </div>
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

            </div>

        </section>

    );

}

export default AdminBoleta;