import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import useTitulo from "../../hooks/useTitulo";
import CampoFormulario from "../../components/admin/CampoFormulario";
import { obtenerStockValido } from "../../utils/stock";
import {
    CATEGORIAS_PRODUCTO,
    validarNombreProducto,
    validarCategoriaProducto,
    validarPrecioProducto,
    validarPrecioOferta,
    validarStockProducto,
    validarStockCritico,
    validarDescripcionProducto
} from "../../utils/validaciones";


/*
 * Datos iniciales del formulario.
 * - Crear: todo vacío.
 * - Editar: los datos del producto.
 */
function crearFormularioInicial(producto) {

    return {
        nombre: producto?.nombre ?? "",
        categoria: producto?.categoria ?? "",
        precio: producto?.precio ?? "",
        precioOferta: producto?.precioOferta ?? "",
        stock: producto ? obtenerStockValido(producto.stock) : "",
        stockCritico: producto?.stockCritico ?? "",
        descripcion: producto?.descripcion ?? "",
        descripcionCompleta: producto?.descripcionCompleta ?? "",
        imagen: producto?.imagen ?? ""
    };

}


/*
 * Revisa cada campo con las validaciones de utils/validaciones.js.
 * Devuelve un objeto: { campo: null | "mensaje de error" }.
 */
function validarFormulario(formulario) {

    return {
        nombre: validarNombreProducto(formulario.nombre),
        categoria: validarCategoriaProducto(formulario.categoria),
        precio: validarPrecioProducto(formulario.precio),
        precioOferta: validarPrecioOferta(formulario.precioOferta, formulario.precio),
        stock: validarStockProducto(formulario.stock),
        stockCritico: validarStockCritico(formulario.stockCritico),
        descripcion: validarDescripcionProducto(formulario.descripcion)
    };

}


function AdminProductoForm() {

    const { id } = useParams();
    const navigate = useNavigate();

    const {
        obtenerProducto,
        crearProducto,
        actualizarProducto
    } = useProducts();

    // Si la URL trae un id, estamos editando
    const esEdicion = id !== undefined;
    const producto = esEdicion ? obtenerProducto(id) : null;

    useTitulo(
        esEdicion
            ? "Editar producto | Panel de administración"
            : "Nuevo producto | Panel de administración"
    );

    const [formulario, setFormulario] = useState(
        () => crearFormularioInicial(producto)
    );

    // Campos que el usuario ya visitó (para mostrar sus errores)
    const [tocados, setTocados] = useState({});

    const [mensajeError, setMensajeError] = useState(null);


    // Editar un producto que no existe (por ejemplo /admin/productos/999/editar)
    if (esEdicion && !producto) {
        return (
            <section className="py-5">
                <div className="container">
                    <h1 className="h3 fw-bold mb-3">Producto no encontrado</h1>
                    <Link to="/admin/productos" className="btn btn-dark">
                        Volver a productos
                    </Link>
                </div>
            </section>
        );
    }


    const errores = validarFormulario(formulario);

    const formularioValido = Object.values(errores).every(
        (error) => error === null
    );


    function cambio(evento) {
        const { name, value } = evento.target;
        setFormulario((valores) => ({ ...valores, [name]: value }));
        setMensajeError(null);
    }

    function salirDeCampo(evento) {
        const { name } = evento.target;
        setTocados((anteriores) => ({ ...anteriores, [name]: true }));
    }

    // Solo muestra el error si el usuario ya pasó por ese campo
    function errorDe(campo) {
        return tocados[campo] ? errores[campo] : null;
    }


    function envio(evento) {

        evento.preventDefault();

        // Al enviar, se marcan todos los campos para mostrar sus errores
        setTocados(
            Object.fromEntries(
                Object.keys(errores).map((campo) => [campo, true])
            )
        );

        if (!formularioValido) {
            setMensajeError("Revisa los campos marcados en rojo.");
            return;
        }

        const resultado = esEdicion
            ? actualizarProducto(producto.id, formulario)
            : crearProducto(formulario);

        if (!resultado.ok) {
            setMensajeError(resultado.mensaje);
            return;
        }

        // Vuelve a la tabla y le pasa el mensaje de éxito
        navigate("/admin/productos", {
            state: { mensaje: resultado.mensaje }
        });

    }


    return (

        <section className="py-5">

            <div className="container" style={{ maxWidth: "820px" }}>

                <Link to="/admin/productos" className="small text-secondary">
                    ← Volver a productos
                </Link>

                <h1 className="display-6 fw-bold mb-4">
                    {esEdicion ? `Editar ${producto.nombre}` : "Nuevo producto"}
                </h1>

                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4 p-md-5">

                        <form onSubmit={envio} noValidate>

                            <div className="row g-3">

                                <div className="col-md-8">
                                    <CampoFormulario
                                        etiqueta="Nombre"
                                        nombre="nombre"
                                        valor={formulario.nombre}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        error={errorDe("nombre")}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <CampoFormulario
                                        etiqueta="Categoría"
                                        nombre="categoria"
                                        como="select"
                                        valor={formulario.categoria}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        error={errorDe("categoria")}
                                    >
                                        <option value="">Selecciona…</option>
                                        {CATEGORIAS_PRODUCTO.map((categoria) => (
                                            <option key={categoria} value={categoria}>
                                                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                                            </option>
                                        ))}
                                    </CampoFormulario>
                                </div>

                                <div className="col-md-6">
                                    <CampoFormulario
                                        etiqueta="Precio"
                                        nombre="precio"
                                        tipo="number"
                                        min="1"
                                        valor={formulario.precio}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        error={errorDe("precio")}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <CampoFormulario
                                        etiqueta="Precio de oferta (opcional)"
                                        nombre="precioOferta"
                                        tipo="number"
                                        min="1"
                                        valor={formulario.precioOferta}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        error={errorDe("precioOferta")}
                                        ayuda="Déjalo vacío si el producto no está en oferta."
                                    />
                                </div>

                                <div className="col-md-6">
                                    <CampoFormulario
                                        etiqueta="Stock"
                                        nombre="stock"
                                        tipo="number"
                                        min="0"
                                        valor={formulario.stock}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        error={errorDe("stock")}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <CampoFormulario
                                        etiqueta="Stock crítico (opcional)"
                                        nombre="stockCritico"
                                        tipo="number"
                                        min="0"
                                        valor={formulario.stockCritico}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        error={errorDe("stockCritico")}
                                        ayuda="Si lo dejas vacío se usa 3."
                                    />
                                </div>

                                <div className="col-12">
                                    <CampoFormulario
                                        etiqueta="Descripción corta"
                                        nombre="descripcion"
                                        como="textarea"
                                        rows="2"
                                        valor={formulario.descripcion}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        error={errorDe("descripcion")}
                                        ayuda="Se muestra en las tarjetas del catálogo."
                                    />
                                </div>

                                <div className="col-12">
                                    <CampoFormulario
                                        etiqueta="Descripción completa (opcional)"
                                        nombre="descripcionCompleta"
                                        como="textarea"
                                        rows="4"
                                        valor={formulario.descripcionCompleta}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        ayuda="Se muestra en el detalle. Si la dejas vacía se usa la descripción corta."
                                    />
                                </div>

                                <div className="col-12">
                                    <CampoFormulario
                                        etiqueta="Imagen (opcional)"
                                        nombre="imagen"
                                        valor={formulario.imagen}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        ayuda="Ruta de la imagen, por ejemplo /img/Musette/Musette_main.png"
                                    />
                                    {formulario.imagen && (
                                        <img
                                            src={formulario.imagen}
                                            alt="Vista previa"
                                            className="rounded-3 object-fit-cover mt-2"
                                            width="120"
                                            height="120"
                                        />
                                    )}
                                </div>

                            </div>

                            {mensajeError && (
                                <div className="alert alert-danger mt-4 mb-0" role="alert">
                                    {mensajeError}
                                </div>
                            )}

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Link to="/admin/productos" className="btn btn-outline-secondary">
                                    Cancelar
                                </Link>
                                <button type="submit" className="btn btn-dark">
                                    {esEdicion ? "Guardar cambios" : "Crear producto"}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>

            </div>

        </section>

    );

}

export default AdminProductoForm;