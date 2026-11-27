import EstadoDatos from "../../components/EstadoDatos";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitulo from "../../hooks/useTitulo";
import CampoFormulario from "../../components/admin/CampoFormulario";
import { validarRut, validarCorreo, validarContrasena } from "../../utils/validaciones";
import { REGIONES, obtenerComunas } from "../../data/regionesComunas";

function AdminUsuarioForm() {
    const { id } = useParams();
    const esEdicion = id !== undefined;
    useTitulo(`${esEdicion ? "Editar" : "Nuevo"} usuario | Panel de administración`);
    const { usuarios, cargandoUsuarios, errorUsuarios, cargarUsuarios } = useAuth();
    if (!esEdicion) return <FormularioUsuario key="nuevo" />;
    if (cargandoUsuarios || errorUsuarios) return <EstadoDatos cargando={cargandoUsuarios} error={errorUsuarios} onReintentar={cargarUsuarios} />;
    const usuario = usuarios.find(item => String(item.id) === id);
    if (!usuario) return <section className="container py-5"><h1>Usuario no encontrado</h1>
        <Link to="/admin/usuarios">Volver a usuarios</Link></section>;
    return <FormularioUsuario key={usuario.id} usuario={usuario} />;
}

function FormularioUsuario({ usuario }) {
    const navigate = useNavigate();
    const { usuarioActual, actualizarUsuario, crearUsuario } = useAuth();
    const esEdicion = Boolean(usuario);
    const [formulario, setFormulario] = useState({
        nombre: usuario?.nombre || "", apellido: usuario?.apellido || "", telefono: usuario?.telefono || "", rol: usuario?.rol || "CLIENTE",
        run: "", correo: "", contrasena: "", region: "", comuna: "", direccion: ""
    });
    const [mensajeError, setMensajeError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const esUnoMismo = esEdicion && usuario.id === usuarioActual?.id;
    function cambio(evento) {
        const { name, value } = evento.target;
        setFormulario(actual => ({ ...actual, [name]: value, ...(name === "region" ? { comuna: "" } : {}) }));
        setMensajeError("");
    }
    async function envio(evento) {
        evento.preventDefault();
        if (guardando) return;
        if (!esEdicion) {
            const error = validarRut(formulario.run) || validarCorreo(formulario.correo) || validarContrasena(formulario.contrasena);
            if (error) { setMensajeError(error); return; }
        }
        setGuardando(true);
        // La edición conserva los datos de contacto que este formulario no modifica.
        const resultado = esEdicion
            ? await actualizarUsuario(usuario.id, { ...usuario, nombre: formulario.nombre, apellido: formulario.apellido, telefono: formulario.telefono, rol: formulario.rol })
            : await crearUsuario(formulario);
        setGuardando(false);
        if (!resultado.ok) { setMensajeError(resultado.mensaje); return; }
        navigate("/admin/usuarios", { state: { mensaje: resultado.mensaje } });
    }
    return <section className="py-5"><div className="container" style={{ maxWidth: "720px" }}>
        <Link to="/admin/usuarios" className="small text-secondary">← Volver a usuarios</Link>
        <h1 className="display-6 fw-bold mb-4">{esEdicion ? `Editar ${usuario.nombre} ${usuario.apellido}` : "Nuevo usuario"}</h1>
        <div className="card border-0 shadow-sm rounded-4"><div className="card-body p-4">
            {esEdicion && <><p>Correo: {usuario.correo}</p><p>RUT: {usuario.run}</p></>}
            <form onSubmit={envio}><div className="row g-3">
                {!esEdicion && <>
                    <div className="col-md-6"><CampoFormulario etiqueta="RUT" nombre="run" valor={formulario.run} onChange={cambio} required minLength={7} maxLength={9} ayuda="Sin puntos ni guion. Ejemplo: 123456785." /></div>
                    <div className="col-md-6"><CampoFormulario etiqueta="Correo" nombre="correo" valor={formulario.correo} onChange={cambio} tipo="email" required maxLength={100} autoComplete="off" /></div>
                    <div className="col-md-6"><CampoFormulario etiqueta="Contraseña" nombre="contrasena" valor={formulario.contrasena} onChange={cambio} tipo="password" required minLength={4} maxLength={10} autoComplete="new-password" ayuda="Entre 4 y 10 caracteres." /></div>
                </>}
                <div className="col-md-6"><CampoFormulario etiqueta="Nombre" nombre="nombre" valor={formulario.nombre} onChange={cambio} required maxLength={50} /></div>
                <div className="col-md-6"><CampoFormulario etiqueta="Apellido" nombre="apellido" valor={formulario.apellido} onChange={cambio} required maxLength={100} /></div>
                <div className="col-md-6"><CampoFormulario etiqueta="Teléfono" nombre="telefono" valor={formulario.telefono} onChange={cambio} tipo="tel" maxLength={20} /></div>
                <div className="col-md-6"><CampoFormulario etiqueta="Rol" nombre="rol" como="select" valor={formulario.rol} onChange={cambio}
                    disabled={esUnoMismo} ayuda={esUnoMismo ? "No puedes cambiar tu propio rol." : null}>
                    <option value="CLIENTE">Cliente</option><option value="VENDEDOR">Vendedor</option><option value="ADMIN">Administrador</option>
                </CampoFormulario></div>
                {!esEdicion && <>
                    <div className="col-md-6"><CampoFormulario etiqueta="Región (opcional)" nombre="region" como="select" valor={formulario.region} onChange={cambio}>
                        <option value="">Selecciona una región</option>
                        {REGIONES.map(region => <option key={region.nombre} value={region.nombre}>{region.nombre}</option>)}
                    </CampoFormulario></div>
                    <div className="col-md-6"><CampoFormulario etiqueta="Comuna (opcional)" nombre="comuna" como="select" valor={formulario.comuna} onChange={cambio} disabled={!formulario.region}>
                        <option value="">Selecciona una comuna</option>
                        {obtenerComunas(formulario.region).map(comuna => <option key={comuna} value={comuna}>{comuna}</option>)}
                    </CampoFormulario></div>
                    <div className="col-12"><CampoFormulario etiqueta="Dirección (opcional)" nombre="direccion" valor={formulario.direccion} onChange={cambio} maxLength={300} /></div>
                </>}
            </div>
                {mensajeError && <div className="alert alert-danger mt-4" role="alert">{mensajeError}</div>}
                <div className="d-flex justify-content-end gap-2 mt-4"><Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
                    <button type="submit" className="btn btn-dark" disabled={guardando}>{guardando ? "Guardando…" : esEdicion ? "Guardar cambios" : "Crear usuario"}</button></div>
            </form>
        </div></div>
    </div></section>;
}
export default AdminUsuarioForm;
