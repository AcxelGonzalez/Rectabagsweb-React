import { Link, Navigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useTitulo from "../hooks/useTitulo";
import Boleta from "../components/Boleta";
import { leerCompraPorId } from "../services/compraService";

function MiBoleta() {

    useTitulo("Mi boleta | Rectabags");

    const { id } = useParams();
    const { usuarioActual } = useAuth();

    const compra = leerCompraPorId(id);

    if (!usuarioActual) {
        return <Navigate to="/login" replace />;
    }

    // Un cliente solo puede ver sus propias boletas
    if (!compra || compra.usuarioId !== usuarioActual.id) {
        return (
            <section className="py-5">
                <div className="container">
                    <h1 className="h3 fw-bold mb-3">Boleta no encontrada</h1>
                    <Link to="/perfil" className="btn btn-dark">
                        Volver a mi perfil
                    </Link>
                </div>
            </section>
        );
    }

    return (

        <section className="py-5">
            <div className="container" style={{ maxWidth: "820px" }}>

                <Link to="/perfil" className="small text-secondary">
                    ← Volver a mi perfil
                </Link>

                <div className="mt-2">
                    <Boleta compra={compra} />
                </div>

            </div>
        </section>

    );

}

export default MiBoleta;