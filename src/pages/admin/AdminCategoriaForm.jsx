import EstadoDatos from "../../components/EstadoDatos";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import useTitulo from "../../hooks/useTitulo";
import CampoFormulario from "../../components/admin/CampoFormulario";


/* Reglas iguales al backend */
function validarFormulario(formulario) {

    const nombre = formulario.nombre.trim();

    return {
        nombre:
            !nombre ? "El nombre es obligatorio."
            : nombre.length > 50 ? "El nombre no puede superar 50 caracteres."
            : null,
        descripcion:
            formulario.descripcion.length > 200
                ? "La descripción no puede superar 200 caracteres."
                : null
    };

}


/*
 * Página: busca la categoría (si es edición) y muestra el formulario.
 */
function AdminCategoriaForm() {

    const { id } = useParams();
    const { categorias, cargandoCategorias, errorCategorias, cargarCategorias } = useProducts();

    const esEdicion = id !== undefined;
    const categoria = esEdicion
        ? categorias.find((c) => c.idCategoria === Number(id))
        : null;

    useTitulo(
        esEdicion
            ? "Editar categoría | Panel de administración"
            : "Nueva categoría | Panel de administración"
    );

    // Las categorías todavía no llegan del backend
    if (cargandoCategorias || errorCategorias) {
        return <EstadoDatos cargando={cargandoCategorias} error={errorCategorias} onReintentar={cargarCategorias} />;
    }

    if (esEdicion && !categoria) {
        return (
            <section className="py-5">
                <div className="container">
                    <h1 className="h3 fw-bold mb-3">Categoría no encontrada</h1>
                    <Link to="/admin/categorias" className="btn btn-dark">
                        Volver a categorías
                    </Link>
                </div>
            </section>
        );
    }

    return <FormularioCategoria categoria={categoria} esEdicion={esEdicion} />;

}


function FormularioCategoria({ categoria, esEdicion }) {

    const navigate = useNavigate();
    const { crearCategoria, actualizarCategoria } = useProducts();

    const [formulario, setFormulario] = useState({
        nombre: categoria?.nombre ?? "",
        descripcion: categoria?.descripcion ?? ""
    });

    const [tocados, setTocados] = useState({});
    const [mensajeError, setMensajeError] = useState(null);
    const [guardando, setGuardando] = useState(false);

    const errores = validarFormulario(formulario);
    const formularioValido = Object.values(errores).every((e) => e === null);


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

        setTocados({ nombre: true, descripcion: true });

        if (!formularioValido) {
            setMensajeError("Revisa los campos marcados en rojo.");
            return;
        }

        setGuardando(true);

        const resultado = esEdicion
            ? await actualizarCategoria(categoria.idCategoria, formulario)
            : await crearCategoria(formulario);

        setGuardando(false);

        if (!resultado.ok) {
            setMensajeError(resultado.mensaje);
            return;
        }

        navigate("/admin/categorias", { state: { mensaje: resultado.mensaje } });

    }


    return (

        <section className="py-5">

            <div className="container" style={{ maxWidth: "640px" }}>

                <Link to="/admin/categorias" className="small text-secondary">
                    ← Volver a categorías
                </Link>

                <h1 className="display-6 fw-bold mb-4">
                    {esEdicion ? `Editar ${categoria.nombre}` : "Nueva categoría"}
                </h1>

                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4 p-md-5">

                        <form onSubmit={envio} noValidate>

                            <div className="row g-3">

                                <div className="col-12">
                                    <CampoFormulario
                                        etiqueta="Nombre"
                                        nombre="nombre"
                                        maxLength="50"
                                        valor={formulario.nombre}
                                        onChange={cambio}
                                        onBlur={salirDeCampo}
                                        error={errorDe("nombre")}
                                    />
                                </div>

                                <div className="col-12">
                                    <CampoFormulario
                                        etiqueta="Descripción (opcional)"
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

                            </div>

                            {mensajeError && (
                                <div className="alert alert-danger mt-4 mb-0" role="alert">
                                    {mensajeError}
                                </div>
                            )}

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Link to="/admin/categorias" className="btn btn-outline-secondary">
                                    Cancelar
                                </Link>
                                <button type="submit" className="btn btn-dark" disabled={guardando}>
                                    {guardando
                                        ? "Guardando…"
                                        : esEdicion ? "Guardar cambios" : "Crear categoría"}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>

            </div>

        </section>

    );

}

export default AdminCategoriaForm;