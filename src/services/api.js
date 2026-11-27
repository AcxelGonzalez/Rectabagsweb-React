import axios from "axios";

/*
 * Cliente para llamar al backend (Spring Boot).
 * Todas las partes lo usan: api.get(...), api.post(...), etc.
 */
const api = axios.create({
    baseURL: "http://localhost:8080/api/v1"
});

// Si hay token guardado, se envía automáticamente en cada petición.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("recta_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/* Si el backend responde 401 (token vencido o inválido) se cierra la sesión y devuelve al login. Se deja fuera /auth/
   porque en ese caso un 401 solo significa "correo o contraseña incorrectos".
 */
api.interceptors.response.use(

    (respuesta) => respuesta,

    (error) => {

        const estado = error.response?.status;
        const ruta = error.config?.url || "";

        if (estado === 401 && !ruta.includes("/auth/")) {

            localStorage.removeItem("recta_token");
            localStorage.removeItem("recta_usuario_actual");

            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    }
);

export default api;