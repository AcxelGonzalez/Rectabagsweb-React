import { formatearPrecio } from "../../utils/moneda";
import { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import useTitulo from "../../hooks/useTitulo";
import useAuth from "../../hooks/useAuth";
import { obtenerStockValido } from "../../utils/stock";
import { STOCK_CRITICO_POR_DEFECTO } from "../../data/productos";

/*
 * Un producto está en stock crítico cuando su stock
 * es igual o menor que su stock crítico (RF10).
 */

function enStockCritico(producto) {
    const stock = obtenerStockValido(producto.stock);
    const limite = producto.stockCritico ?? STOCK_CRITICO_POR_DEFECTO;
    return stock <= limite;
}

function AdminProductos() {

    useTitulo("Productos | Panel de administración");
    const { esAdmin } = useAuth();

    const {
        productos,
        eliminarProducto,
        restaurarProductos
    } = useProducts();

    // Producto que se quiere eliminar (abre el modal de confirmación)
    const [productoAEliminar, setProductoAEliminar] = useState(null);


    const location = useLocation();
    // Mensaje de la última acción. Si venimos del formulario, // puede venir en location.state.mensaje.
    const [mensaje, setMensaje] = useState(() =>
        location.state?.mensaje
            ? { tipo: "success", texto: location.state.mensaje }
            : null
    );

    const productosCriticos = productos.filter(enStockCritico);


    async function confirmarEliminacion() {

        const resultado = await eliminarProducto(productoAEliminar.id);
        setMensaje({
            tipo: resultado.ok ? "success" : "danger",
            texto: resultado.mensaje
        });

        setProductoAEliminar(null);

    }


    async function restaurar() {

        const resultado = await restaurarProductos();

        setMensaje({
            tipo: "success",
            texto: resultado.mensaje
        });

    }


    return (

        <section className="py-5">

            <div className="container">

                {/* Encabezado */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

                    <div>
                        <Link to="/admin" className="small text-secondary">
                            ← Volver al panel
                        </Link>
                        <h1 className="display-6 fw-bold mb-0">
                            Productos
                        </h1>
                    </div>

                    {esAdmin && <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={restaurar}
                        >
                            Restaurar catálogo
                        </button>
                        <Link to="/admin/productos/nuevo" className="btn btn-dark">
                            Nuevo producto
                        </Link>
                    </div>}

                </div>


                {/* Mensaje de la última acción */}
                {mensaje && (
                    <div className={`alert alert-${mensaje.tipo}`} role="alert">
                        {mensaje.texto}
                    </div>
                )}


                {/* Alerta de stock crítico (RF10) */}
                {productosCriticos.length > 0 ? (
                    <div className="alert alert-warning" role="alert">
                        <strong>Stock crítico:</strong>{" "}
                        {productosCriticos.map((p) => p.nombre).join(", ")}
                    </div>
                ) : (
                    <div className="alert alert-light border" role="status">
                        Ningún producto está en stock crítico.
                    </div>
                )}


                {/* Tabla de productos */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="table-responsive">

                        <table className="table align-middle mb-0">

                            <thead className="table-light">
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {productos.map((producto) => (

                                    <tr key={producto.id}>

                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={producto.imagen}
                                                    alt={producto.nombre}
                                                    className="rounded-3 object-fit-cover"
                                                    width="56"
                                                    height="56"
                                                />
                                                <span className="fw-semibold">
                                                    {producto.nombre}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="text-capitalize">
                                            {producto.categoria}
                                        </td>

                                        <td>
                                            {producto.precioOferta ? (
                                                <>
                                                    <span className="text-decoration-line-through text-secondary small me-2">
                                                        {formatearPrecio(producto.precio)}
                                                    </span>
                                                    <span className="text-danger fw-bold">
                                                        {formatearPrecio(producto.precioOferta)}
                                                    </span>
                                                </>
                                            ) : (
                                                formatearPrecio(producto.precio)
                                            )}
                                        </td>

                                        <td>
                                            {obtenerStockValido(producto.stock)}
                                            {enStockCritico(producto) && (
                                                <span className="badge bg-danger ms-2">
                                                    Crítico
                                                </span>
                                            )}
                                        </td>

                                        <td className="text-end">
                                            <Link to={`/producto/${producto.id}`} className="btn btn-sm btn-outline-secondary me-2">Ver producto</Link>
                                            {esAdmin && <><Link
                                                to={`/admin/productos/${producto.id}/editar`}
                                                className="btn btn-sm btn-outline-dark me-2"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => setProductoAEliminar(producto)}
                                            >
                                                Eliminar
                                            </button></>}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                </div>

            </div>


            {/* Modal de confirmación */}
            {esAdmin && productoAEliminar && (
                <>
                    <div className="modal d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h2 className="modal-title h5">Eliminar producto</h2>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Cerrar"
                                        onClick={() => setProductoAEliminar(null)}
                                    />
                                </div>

                                <div className="modal-body">
                                    ¿Seguro que quieres eliminar{" "}
                                    <strong>{productoAEliminar.nombre}</strong>?
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setProductoAEliminar(null)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={confirmarEliminacion}
                                    >
                                        Eliminar
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="modal-backdrop show" />
                </>
            )}

        </section>

    );

}

export default AdminProductos;
