import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";


/*
se usa como ruta para que solo el admin ingrese a /admin/productos,
si el usuario es Cliente, se devuelve al Home
 */
function RutaAdmin() {

    const { estaAutenticado, esAdmin } = useAuth();
    const location = useLocation();

    if (!estaAutenticado) {

        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (!esAdmin) {

        return <Navigate to="/" replace />;

    }
    return <Outlet />;

}

export default RutaAdmin;