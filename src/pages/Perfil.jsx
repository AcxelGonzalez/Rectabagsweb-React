import {
    useState
} from "react";

import {
    Link,
    Navigate
} from "react-router-dom";

import useAuth
    from "../hooks/useAuth";

import useTitulo
    from "../hooks/useTitulo";

import {
    REGIONES,
    obtenerComunas
} from "../data/regionesComunas";

import {
    leerCompras,
    colorEstado
} from "../services/compraService";

import "../css/style_perfil.css";


function formatearPrecio(valor) {
    return Number(valor).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}


/*
 * Datos del formulario a partir del usuario guardado.
 * Se usa al cargar la página y al cancelar una edición.
 */
function datosIniciales(usuario) {
    return {
        nombre: usuario?.nombre || "",
        apellido: usuario?.apellido || "",
        fechaNacimiento: usuario?.fechaNacimiento || "",
        telefono: usuario?.telefono || "",
        region: usuario?.region || "",
        comuna: usuario?.comuna || "",
        direccion: usuario?.direccion || ""
    };
}


/*
 * Muestra un dato con su etiqueta. Si está vacío, muestra "—".
 */
function Dato({ etiqueta, valor }) {
    return (
        <div className="mb-2">
            <div className="small text-secondary">{etiqueta}</div>
            <div className="fw-semibold">{valor || "—"}</div>
        </div>
    );
}


/*
 * Lista de compras con su estado y el botón para ver la boleta.
 */
function ListaCompras({ compras }) {

    if (compras.length === 0) {
        return (
            <p className="text-secondary mb-0">
                Todavía no has realizado compras.
            </p>
        );
    }

    return compras.map((compra) => (

        <details key={compra.id} className="perfil-compra rounded-3 p-3 mb-3">

            <summary className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <span className="fw-semibold">{compra.id}</span>
                <span className="text-secondary small">
                    {new Date(compra.fecha).toLocaleDateString("es-CL")}
                </span>
                <span className={`badge ${colorEstado(compra.estado)} text-capitalize`}>
                    {compra.estado}
                </span>
                <span className="fw-bold">
                    {formatearPrecio(compra.subtotal)}
                </span>
            </summary>

            <ul className="mt-3 mb-0">
                {compra.productos.map((producto) => (
                    <li key={producto.id}>
                        {producto.nombre} × {producto.cantidad}
                    </li>
                ))}
            </ul>

            <Link
                to={`/mis-compras/${compra.id}`}
                className="btn btn-sm btn-dark mt-3"
            >
                Ver boleta
            </Link>

        </details>

    ));

}


const OPCIONES_MENU = [
    { id: "detalles", texto: "Detalles" },
    { id: "editar", texto: "Editar perfil" },
    { id: "historial", texto: "Historial de compras" }
];


function Perfil() {

    useTitulo(
        "Mi perfil | Rectabags"
    );


    const {
        usuarioActual,
        usuarios,
        actualizarPerfil,
        cerrarSesion
    } = useAuth();


    const usuario =
        usuarios.find(
            (item) =>
                item.id ===
                usuarioActual?.id
        ) || usuarioActual;


    const [
        formulario,
        setFormulario
    ] = useState(
        () => datosIniciales(usuario)
    );


    const [
        mensaje,
        setMensaje
    ] = useState(null);


    // Sección visible: "detalles", "editar" o "historial"
    const [
        seccion,
        setSeccion
    ] = useState("detalles");


    // Compras de este usuario, las más recientes primero
    const misCompras = leerCompras()
        .filter((compra) => compra.usuarioId === usuarioActual?.id)
        .reverse();


    if (!usuarioActual) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    function cambioFormulario(
        evento
    ) {

        const {
            name,
            value
        } = evento.target;


        setFormulario(
            (valores) => ({
                ...valores,
                [name]: value,

                // Si cambia la región, la comuna anterior
                // ya no corresponde y se borra.
                ...(name === "region"
                    ? { comuna: "" }
                    : {})
            })
        );

        if (mensaje) {

            setMensaje(null);

        }

    }


    function envio(
        evento
    ) {

        evento.preventDefault();


        const resultado =
            actualizarPerfil(
                formulario
            );


        setMensaje({

            tipo:
                resultado.ok
                    ? "success"
                    : "danger",

            texto:
                resultado.mensaje

        });


        // Si se guardó bien, vuelve a la vista de detalles
        if (resultado.ok) {
            setSeccion("detalles");
        }

    }


    function cambiarSeccion(nuevaSeccion) {
        setSeccion(nuevaSeccion);
        setMensaje(null);
    }


    function cancelarEdicion() {
        setFormulario(datosIniciales(usuario));
        cambiarSeccion("detalles");
    }


    const ubicacion = [
        usuario?.comuna,
        usuario?.region
    ].filter(Boolean).join(", ");


    return (

        <section className="perfil-page py-5">

            <div className="container">

                <h1 className="titulo-mono text-center fw-bold mb-4">
                    Bienvenid@, {usuario?.nombre} {usuario?.apellido}
                </h1>

                <div className="row g-4">

                    {/* ---------- Menú lateral ---------- */}
                    <aside className="col-lg-3">

                        <div className="perfil-menu p-3 mb-3">

                            <nav className="nav flex-column gap-1">

                                {OPCIONES_MENU.map((opcion) => (
                                    <button
                                        key={opcion.id}
                                        type="button"
                                        className={`nav-link text-start ${seccion === opcion.id ? "active" : ""}`}
                                        onClick={() => cambiarSeccion(opcion.id)}
                                    >
                                        {opcion.texto}
                                    </button>
                                ))}

                            </nav>

                        </div>

                        <button
                            type="button"
                            className="btn btn-danger w-100 rounded-pill mb-4"
                            onClick={cerrarSesion}
                        >
                            Cerrar sesión
                        </button>

                         <div className="d-none d-lg-block px-2">
                            <div className="fw-bold text-uppercase mb-3">
                                Síguenos en redes
                            </div>
                            <a href="https://www.instagram.com/rectabags" target="_blank" rel="noopener noreferrer" className="perfil-red">
                                <span className="perfil-red-icono">
                                    <img src="/img/RRSS/icons8-instagram-50.png" alt="Instagram" />
                                </span>
                                @rectabags
                            </a>
                            <a href="https://www.tiktok.com/@rectabags" target="_blank" rel="noopener noreferrer" className="perfil-red">
                                <span className="perfil-red-icono">
                                    <img src="/img/RRSS/icons8-tiktok-50.png" alt="TikTok" />
                                </span>
                                @rectabags
                            </a>
                        </div>

                    </aside>


                    {/* ---------- Panel principal ---------- */}
                    <div className="col-lg-9">

                        <div className="perfil-panel p-3 p-md-4">

                            {mensaje && (
                                <div
                                    className={`alert alert-${mensaje.tipo}`}
                                    role="alert"
                                >
                                    {mensaje.texto}
                                </div>
                            )}


                            {/* ===== DETALLES ===== */}
                            {seccion === "detalles" && (

                                <>
                                    <div className="row g-3 mb-3">

                                        <div className="col-md-6">
                                            <div className="perfil-tarjeta h-100 p-4">

                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <h2 className="h6 fw-bold text-uppercase mb-0">
                                                        Detalles de contacto
                                                    </h2>
                                                    <span className={usuarioActual.rol === "admin" ? "badge text-bg-warning" : "badge text-bg-dark"}>
                                                        {usuarioActual.rol === "admin" ? "Administrador" : "Cliente"}
                                                    </span>
                                                </div>

                                                <Dato etiqueta="Nombre" valor={`${usuario?.nombre || ""} ${usuario?.apellido || ""}`} />
                                                <Dato etiqueta="Correo" valor={usuarioActual.correo} />
                                                <Dato etiqueta="Teléfono" valor={usuario?.telefono} />
                                                <Dato etiqueta="Fecha de nacimiento" valor={usuario?.fechaNacimiento} />

                                                <button
                                                    type="button"
                                                    className="btn btn-dark btn-sm mt-2"
                                                    onClick={() => cambiarSeccion("editar")}
                                                >
                                                    Editar
                                                </button>

                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="perfil-tarjeta h-100 p-4">

                                                <h2 className="h6 fw-bold text-uppercase mb-3">
                                                    Detalle de facturación
                                                </h2>

                                                <Dato etiqueta="RUT" valor={usuarioActual.rut} />
                                                <Dato etiqueta="Dirección" valor={usuario?.direccion} />
                                                <Dato etiqueta="Comuna y región" valor={ubicacion} />

                                                <button
                                                    type="button"
                                                    className="btn btn-dark btn-sm mt-2"
                                                    onClick={() => cambiarSeccion("editar")}
                                                >
                                                    Editar
                                                </button>

                                            </div>
                                        </div>

                                    </div>

                                    <div className="perfil-tarjeta p-4">

                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h2 className="h6 fw-bold text-uppercase mb-0">
                                                Últimas compras
                                            </h2>
                                            {misCompras.length > 3 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-link btn-sm p-0"
                                                    onClick={() => cambiarSeccion("historial")}
                                                >
                                                    Ver todo
                                                </button>
                                            )}
                                        </div>

                                        <ListaCompras compras={misCompras.slice(0, 3)} />

                                    </div>
                                </>

                            )}


                            {/* ===== EDITAR ===== */}
                            {seccion === "editar" && (

                                <div className="perfil-tarjeta p-4">

                                    <h2 className="titulo-mono h4 mb-4">
                                        Edita tus datos
                                    </h2>

                                    <form onSubmit={envio}>

                                        <div className="row g-3">

                                            <div className="col-md-6">
                                                <label htmlFor="perfil-nombre" className="form-label fw-semibold">
                                                    Nombre
                                                </label>
                                                <input
                                                    type="text"
                                                    id="perfil-nombre"
                                                    name="nombre"
                                                    className="form-control"
                                                    value={formulario.nombre}
                                                    onChange={cambioFormulario}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="perfil-apellido" className="form-label fw-semibold">
                                                    Apellido
                                                </label>
                                                <input
                                                    type="text"
                                                    id="perfil-apellido"
                                                    name="apellido"
                                                    className="form-control"
                                                    value={formulario.apellido}
                                                    onChange={cambioFormulario}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="perfil-correo" className="form-label fw-semibold">
                                                    Correo electrónico
                                                </label>
                                                <input
                                                    type="email"
                                                    id="perfil-correo"
                                                    className="form-control"
                                                    value={usuarioActual.correo}
                                                    readOnly
                                                />
                                                <div className="form-text">
                                                    El correo no puede modificarse desde el perfil.
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="perfil-rut" className="form-label fw-semibold">
                                                    RUT
                                                </label>
                                                <input
                                                    type="text"
                                                    id="perfil-rut"
                                                    className="form-control"
                                                    value={usuarioActual.rut}
                                                    readOnly
                                                />
                                                <div className="form-text">
                                                    El RUT identifica tu cuenta y no puede modificarse.
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="perfil-fecha" className="form-label fw-semibold">
                                                    Fecha de nacimiento
                                                </label>
                                                <input
                                                    type="date"
                                                    id="perfil-fecha"
                                                    name="fechaNacimiento"
                                                    className="form-control"
                                                    value={formulario.fechaNacimiento}
                                                    onChange={cambioFormulario}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="perfil-telefono" className="form-label fw-semibold">
                                                    Teléfono
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="perfil-telefono"
                                                    name="telefono"
                                                    className="form-control"
                                                    placeholder="+56 9 XXXX XXXX"
                                                    value={formulario.telefono}
                                                    onChange={cambioFormulario}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="perfil-region" className="form-label fw-semibold">
                                                    Región
                                                </label>
                                                <select
                                                    id="perfil-region"
                                                    name="region"
                                                    className="form-select"
                                                    value={formulario.region}
                                                    onChange={cambioFormulario}
                                                >
                                                    <option value="">
                                                        Selecciona una región
                                                    </option>
                                                    {REGIONES.map((region) => (
                                                        <option key={region.nombre} value={region.nombre}>
                                                            {region.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="perfil-comuna" className="form-label fw-semibold">
                                                    Comuna
                                                </label>
                                                <select
                                                    id="perfil-comuna"
                                                    name="comuna"
                                                    className="form-select"
                                                    value={formulario.comuna}
                                                    onChange={cambioFormulario}
                                                    disabled={!formulario.region}
                                                >
                                                    <option value="">
                                                        Selecciona una comuna
                                                    </option>
                                                    {obtenerComunas(formulario.region).map((comuna) => (
                                                        <option key={comuna} value={comuna}>
                                                            {comuna}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="perfil-direccion" className="form-label fw-semibold">
                                                    Dirección
                                                </label>
                                                <input
                                                    type="text"
                                                    id="perfil-direccion"
                                                    name="direccion"
                                                    className="form-control"
                                                    value={formulario.direccion}
                                                    onChange={cambioFormulario}
                                                />
                                            </div>

                                        </div>

                                        <div className="d-flex gap-2 mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-dark px-4"
                                            >
                                                Guardar cambios
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-dark px-4"
                                                onClick={cancelarEdicion}
                                            >
                                                Cancelar
                                            </button>
                                        </div>

                                    </form>

                                </div>

                            )}


                            {/* ===== HISTORIAL ===== */}
                            {seccion === "historial" && (

                                <div className="perfil-tarjeta p-4">

                                    <h2 className="h6 fw-bold text-uppercase mb-3">
                                        Historial de compras
                                    </h2>

                                    <ListaCompras compras={misCompras} />

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}


export default Perfil;