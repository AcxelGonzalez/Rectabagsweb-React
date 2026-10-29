import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo";
import useProducts from "../../hooks/useProducts";
import Boleta from "../../components/Boleta";
import {
    leerCompraPorId,
    actualizarEstadoCompra,
    ESTADOS_COMPRA
} from "../../services/compraService";

function AdminBoleta() {

    const { id } = useParams();

    const {
        verificarDisponibilidad,
        descontarStock,
        reponerStock
    } = useProducts();

    const [compra, setCompra] = useState(() => leerCompraPorId(id));

    const [
        mensajeEstado,
        setMensajeEstado
    ] = useState("");

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

        const estadoAnterior =
            compra.estado;


        const nuevoEstado =
            evento.target.value;


        setMensajeEstado("");


        /*
        * No hacemos nada si el estado no cambió.
        */
        if (
            estadoAnterior ===
            nuevoEstado
        ) {

            return;

        }


        /*
        * -----------------------------------------------------------
        * CASO 1
        * Una compra activa pasa a CANCELADA.
        *
        * Primero actualizamos la orden.
        * Solo cuando la actualización fue exitosa devolvemos stock.
        * -----------------------------------------------------------
        */
        if (
            estadoAnterior !== "cancelada" &&
            nuevoEstado === "cancelada"
        ) {

            const actualizada =
                actualizarEstadoCompra(
                    compra.id,
                    nuevoEstado
                );


            if (!actualizada) {

                setMensajeEstado(
                    "No fue posible cancelar la orden."
                );

                return;

            }


            reponerStock(
                compra.productos
            );


            setCompra(
                actualizada
            );


            setMensajeEstado(
                "Orden cancelada y stock restaurado correctamente."
            );


            return;

        }


        /*
        * -----------------------------------------------------------
        * CASO 2
        * Una compra CANCELADA vuelve a estar activa.
        *
        * Antes de reactivarla verificamos que exista stock.
        * -----------------------------------------------------------
        */
        if (
            estadoAnterior === "cancelada" &&
            nuevoEstado !== "cancelada"
        ) {

            const disponibilidad =
                verificarDisponibilidad(
                    compra.productos
                );


            if (!disponibilidad.ok) {

                setMensajeEstado(
                    disponibilidad.mensaje ||
                    "No existe stock suficiente para reactivar la orden."
                );

                return;

            }


            const actualizada =
                actualizarEstadoCompra(
                    compra.id,
                    nuevoEstado
                );


            if (!actualizada) {

                setMensajeEstado(
                    "No fue posible reactivar la orden."
                );

                return;

            }


            descontarStock(
                compra.productos
            );


            setCompra(
                actualizada
            );


            setMensajeEstado(
                "Orden reactivada y stock actualizado correctamente."
            );


            return;

        }


        /*
        * -----------------------------------------------------------
        * CASO 3
        * Cambio entre estados activos.
        *
        * Ejemplo:
        * confirmada → enviada
        *
        * El stock no se modifica.
        * -----------------------------------------------------------
        */
        const actualizada =
            actualizarEstadoCompra(
                compra.id,
                nuevoEstado
            );


        if (actualizada) {

            setCompra(
                actualizada
            );

            setMensajeEstado(
                "Estado de la orden actualizado correctamente."
            );

        } else {

            setMensajeEstado(
                "No fue posible actualizar el estado de la orden."
            );

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

                {mensajeEstado && (

                    <div
                        className="alert alert-info mt-3 mb-0"
                        role="alert"
                    >
                        {mensajeEstado}
                    </div>

                )}

                <div className="mt-2">
                    <Boleta compra={compra} controlEstado={selectorEstado} />
                </div>

            </div>
        </section>

    );

}

export default AdminBoleta;