import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

/* Deja entrar al ADMIN y al VENDEDOR. 
Un cliente se devuelve al inicio y un visitante va al login.
*/
function RutaAdmin() {

    const {
        estaAutenticado,
        puedeEntrarAlPanel,
        cargandoSesion
    } = useAuth();

    const location = useLocation();

    // Mientras el backend confirma el token no se decide nada
    if (cargandoSesion) {

        return (
            <div className="container py-5 text-center text-secondary">
                Comprobando tu sesión...
            </div>
        );

    }

    if (!estaAutenticado) {

        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );

    }


    if (!puedeEntrarAlPanel) {

        return <Navigate to="/" replace />;

    }

    return <Outlet />;

}

export default RutaAdmin;