describe("dirección configurable de la API", () => {
    afterEach(() => { vi.unstubAllEnvs(); localStorage.clear(); });
    it.each([
        [undefined, "http://localhost:8080/api/v1"],
        ["", "http://localhost:8080/api/v1"],
        ["   ", "http://localhost:8080/api/v1"],
        [" http://localhost:8081/api/v1 ", "http://localhost:8081/api/v1"]
    ])("envía las consultas a la URL correspondiente para %j", async (valor, esperado) => {
        vi.stubEnv("VITE_API_URL", valor); vi.resetModules();
        const { default: api } = await import("../services/api");
        api.defaults.adapter = async config => ({ data: { baseURL: config.baseURL, url: config.url }, status: 200, statusText: "OK", headers: {}, config });
        const { data } = await api.get("/productos");
        expect(data).toEqual({ baseURL: esperado, url: "/productos" });
    });
    it("conserva el envío del JWT al usar una dirección configurada", async () => {
        vi.stubEnv("VITE_API_URL", "http://localhost:8081/api/v1"); vi.resetModules();
        localStorage.setItem("recta_token", "token-ficticio");
        const { default: api } = await import("../services/api");
        api.defaults.adapter = async config => ({ data: config.headers.Authorization, status: 200, statusText: "OK", headers: {}, config });
        expect((await api.get("/usuarios/me")).data).toBe("Bearer token-ficticio");
    });
});
