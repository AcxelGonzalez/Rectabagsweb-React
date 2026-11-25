import axios from "axios";

/*
 * Cliente para llamar al backend (Spring Boot).
 * Todas las partes lo usan: api.get(...), api.post(...), etc.
 */
const api = axios.create({
    baseURL: "http://localhost:8080/api/v1"
});

// Si hay token guardado (lo guarda la Parte 2 al hacer login),
// se envía automáticamente en cada petición.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("recta_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;