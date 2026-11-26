import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import useTitulo from "../../hooks/useTitulo";
import CampoFormulario from "../../components/admin/CampoFormulario";
import { obtenerStockValido } from "../../utils/stock";
import {
    validarNombreProducto,
    validarPrecioProducto,
    validarPrecioOferta,
    validarStockProducto,
    validarStockCritico,
    validarDescripcionProducto
} from "../../utils/validaciones";


/* Código: requerido, de 3 a 20 caracteres (igual que el backend) */
function validarCodigo(codigo) {
    const valor = String(codigo || "").trim();
    if (valor.length < 3) return "El código debe tener al menos 3 caracteres.";
    if (valor.length > 20) return "El código no puede superar 20 caracteres.";
    return null;
}

/* Categoría: requerida */
function validarCategoria(idCategoria) {
    return idCategoria ? null : "Selecciona una categoría.";
}


function crearFormularioInicial(producto) {

    return {
        codigo: producto?.codigo ?? "",
        nombre: producto?.nombre ?? "",
        idCategoria: producto?.idCategoria ?? "",
        precio: producto?.precio ?? "",
        precioOferta: producto?.precioOferta ?? "",
        stock: producto ? obtenerStockValido(producto.stock) : "",
        stockCritico: producto?.stockCritico ?? "",
        descripcion: producto?.descripcion ?? "",
        imagen: producto?.imagen ?? ""
    };

}


function validarFormulario(formulario) {

    return {
        codigo: validarCodigo(formulario.codigo),
        nombre: validarNombreProducto(formulario.nombre),
        idCategoria: validarCategoria(formulario.idCategoria),
        precio: validarPrecioProducto(formulario.precio),
        precioOferta: validarPrecioOferta(formulario.precioOferta, formulario.precio),
        stock: validarStockProducto(formulario.stock),
        stockCritico: validarStockCritico(formulario.stockCritico),
        descripcion: validarDescripcionProducto(formulario.descripcion)
    };

}


/*
 * Página: espera a que carguen los productos y después
 * muestra el formulario (crear o editar).
 */
function AdminProductoForm() {

    const { id } = useParams();
    const { obtenerProducto, cargando } = useProducts();

    const esEdicion = id !== undefined;
    const producto = esEdicion ? obtenerProducto(id) : null;

    useTitulo(
        esEdicion
            ? "Editar producto | Panel de administración"
            : "Nuevo producto | Panel de administración"
    );

    if (cargando) {
        return (
            <section className="py-5">
                <div className="container">Cargando…</div>
            </section>
        );
    }

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

    return <FormularioProducto producto={producto} esEdicion={esEdicion} />;

}


/*
 * Formulario de producto (ya con los datos cargados).
 */
function FormularioProducto({ producto, esEdicion }) {

    const navigate = useNavigate();

    const { crearProducto, actualizarProducto, categorias } = useProducts();

    const [formulario, setFormulario] = useState(
        () => crearFormularioInicial(producto)
    );

    const [tocados, setTocados] = useState({});
    const [mensajeError, setMensajeError] = useState(null);
    const [guardando, setGuardando] = useState(false);


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

    function errorDe(campo) {
        return tocados[campo] ? errores[campo] : null;
    }


    async function envio(evento) {

        evento.preventDefault();

        setTocados(
            Object.fromEntries(
                Object.keys(errores).map((campo) => [campo, true])
            )
        );

        if (!formularioValido) {
            setMensajeError("Revisa los campos marcados en rojo.");
            return;
        }

        setGuardando(true);

        const resultado = esEdicion
            ? await actualizarProducto(producto.id, formulario)
            : await crearProducto(formulario);

        setGuardando(false);

        // Si el backend responde 400, aquí aparece su mensaje
        if (!resultado.ok) {
            setMensajeError(resultado.mensaje);
            return;
        }

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

                                <div className="col-md-4">
                                    <CampoFormulario
                                        etiqueta="Código"
                                        nombre="codigo"
                                        valor={formulario.codigo}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        error={errorDe("codigo")}
                                        ayuda="De 3 a 20 caracteres. Ej: RC-30"
                                    />
                                </div>

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

                                <div className="col-md-6">
                                    <CampoFormulario
                                        etiqueta="Categoría"
                                        nombre="idCategoria"
                                        como="select"
                                        valor={formulario.idCategoria}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        error={errorDe("idCategoria")}
                                    >
                                        <option value="">Selecciona…</option>
                                        {categorias.map((categoria) => (
                                            <option
                                                key={categoria.idCategoria}
                                                value={categoria.idCategoria}
                                            >
                                                {categoria.nombre}
                                            </option>
                                        ))}
                                    </CampoFormulario>
                                </div>

                                <div className="col-md-6">
                                    <CampoFormulario
                                        etiqueta="Imagen (opcional)"
                                        nombre="imagen"
                                        valor={formulario.imagen}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        ayuda="Ej: /img/Musette/Musette_main.png"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <CampoFormulario
                                        etiqueta="Precio"
                                        nombre="precio"
                                        tipo="number"
                                        min="0"
                                        step="0.01"
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
                                        min="0"
                                        step="0.01"
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
                                        ayuda="Si lo dejas vacío se usa 0."
                                    />
                                </div>

                                <div className="col-12">
                                    <CampoFormulario
                                        etiqueta="Descripción"
                                        nombre="descripcion"
                                        como="textarea"
                                        rows="3"
                                        maxLength="200"
                                        valor={formulario.descripcion}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        error={errorDe("descripcion")}
                                        ayuda="Máximo 200 caracteres."
                                    />
                                </div>

                                {formulario.imagen && (
                                    <div className="col-12">
                                        <img
                                            src={formulario.imagen}
                                            alt="Vista previa"
                                            className="rounded-3 object-fit-cover"
                                            width="120"
                                            height="120"
                                        />
                                    </div>
                                )}

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
                                <button type="submit" className="btn btn-dark" disabled={guardando}>
                                    {guardando
                                        ? "Guardando…"
                                        : esEdicion ? "Guardar cambios" : "Crear producto"}
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