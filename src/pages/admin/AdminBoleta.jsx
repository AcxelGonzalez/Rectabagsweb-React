import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo";
import Boleta from "../../components/Boleta";
import {
    leerCompraPorId,
    actualizarEstadoCompra,
    ESTADOS_COMPRA
} from "../../services/compraService";

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

    function cambiarEstado(evento) {

        const actualizada = actualizarEstadoCompra(
            compra.id,
            evento.target.value
        );

        if (actualizada) {
            setCompra(actualizada);
        }

    }

    // Selector que se envía a la boleta como prop
    const selectorEstado = (
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
    );

    return (

        <section className="py-5">
            <div className="container" style={{ maxWidth: "820px" }}>

                <Link to="/admin/ordenes" className="small text-secondary">
                    ← Volver a órdenes
                </Link>

                <div className="mt-2">
                    <Boleta compra={compra} controlEstado={selectorEstado} />
                </div>

            </div>
        </section>

    );

}

export default AdminBoleta;