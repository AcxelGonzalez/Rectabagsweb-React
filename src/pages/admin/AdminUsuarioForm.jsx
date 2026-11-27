import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitulo from "../../hooks/useTitulo";
import CampoFormulario from "../../components/admin/CampoFormulario";

function AdminUsuarioForm() {
    useTitulo("Editar usuario | Panel de administración");
    const { id } = useParams();
    const { usuarios, cargandoUsuarios } = useAuth();
    if (cargandoUsuarios) return <p className="container py-5" role="status">Cargando usuario…</p>;
    const usuario = usuarios.find(item => String(item.id) === id);
    if (!usuario) return <section className="container py-5"><h1>Usuario no encontrado</h1>
        <Link to="/admin/usuarios">Volver a usuarios</Link></section>;
    return <FormularioUsuario key={usuario.id} usuario={usuario} />;
}

function FormularioUsuario({ usuario }) {
    const navigate = useNavigate();
    const { usuarioActual, actualizarUsuario } = useAuth();
    const [formulario, setFormulario] = useState({
        nombre: usuario.nombre, apellido: usuario.apellido, telefono: usuario.telefono || "", rol: usuario.rol
    });
    const [mensajeError, setMensajeError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const esUnoMismo = usuario.id === usuarioActual?.id;
    function cambio(evento) {
        setFormulario(actual => ({ ...actual, [evento.target.name]: evento.target.value }));
        setMensajeError("");
    }
    async function envio(evento) {
        evento.preventDefault();
        if (guardando) return;
        setGuardando(true);
        const resultado = await actualizarUsuario(usuario.id, { ...usuario, ...formulario });
        setGuardando(false);
        if (!resultado.ok) { setMensajeError(resultado.mensaje); return; }
        navigate("/admin/usuarios", { state: { mensaje: resultado.mensaje } });
    }
    return <section className="py-5"><div className="container" style={{ maxWidth: "720px" }}>
        <Link to="/admin/usuarios" className="small text-secondary">← Volver a usuarios</Link>
        <h1 className="display-6 fw-bold mb-4">Editar {usuario.nombre} {usuario.apellido}</h1>
        <div className="card border-0 shadow-sm rounded-4"><div className="card-body p-4">
            <p>Correo: {usuario.correo}</p><p>RUT: {usuario.run}</p>
            <form onSubmit={envio}><div className="row g-3">
                <div className="col-md-6"><CampoFormulario etiqueta="Nombre" nombre="nombre" valor={formulario.nombre} onChange={cambio} required maxLength={50} /></div>
                <div className="col-md-6"><CampoFormulario etiqueta="Apellido" nombre="apellido" valor={formulario.apellido} onChange={cambio} required maxLength={100} /></div>
                <div className="col-md-6"><CampoFormulario etiqueta="Teléfono" nombre="telefono" valor={formulario.telefono} onChange={cambio} tipo="tel" maxLength={20} /></div>
                <div className="col-md-6"><CampoFormulario etiqueta="Rol" nombre="rol" como="select" valor={formulario.rol} onChange={cambio}
                    disabled={esUnoMismo} ayuda={esUnoMismo ? "No puedes cambiar tu propio rol." : null}>
                    <option value="CLIENTE">Cliente</option><option value="VENDEDOR">Vendedor</option><option value="ADMIN">Administrador</option>
                </CampoFormulario></div>
            </div>
                {mensajeError && <div className="alert alert-danger mt-4" role="alert">{mensajeError}</div>}
                <div className="d-flex justify-content-end gap-2 mt-4"><Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
                    <button type="submit" className="btn btn-dark" disabled={guardando}>{guardando ? "Guardando…" : "Guardar cambios"}</button></div>
            </form>
        </div></div>
    </div></section>;
}
export default AdminUsuarioForm;
