import { BrowserRouter, Routes, Route } from "react-router-dom";
import ActualizarTop from "./components/ActualizarTop";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import ProductoDetalle from "./pages/ProductoDetalle";
import Blog from "./pages/Blog";
import ImpactoAmbiental from "./pages/ImpactoAmbiental";
import Contacto from "./pages/Contacto";
import QuienesSomos from "./pages/QuienesSomos";
import TerminosCompra from "./pages/TerminosCompra";
import TerminosRegistro from "./pages/TerminosRegistro";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Carrito from "./pages/Carrito";
import RecuperarConstrasena from "./pages/RecuperarContrasena";
import PaginaEnConstruccion from "./pages/PaginaEnConstruccion";

function App() {
    return (
        <BrowserRouter>
            <ActualizarTop/>
            <Routes>
                {/* Layout comparte el encabezado y pie de página entre todas las rutas. */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/producto/:id" element={<ProductoDetalle />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/impacto-ambiental" element={<ImpactoAmbiental />} />
                    <Route path="/QuienesSomos" element={<QuienesSomos />} />
                    <Route path="/terminos-compra" element={<TerminosCompra />} />
                    <Route path="/terminos-registro" element={<TerminosRegistro />} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/registro" element={<Registro/>} />
                    <Route path="/recuperar-contrasena" element={<RecuperarConstrasena/>} />
                    <Route path="/carrito" element={<Carrito/>} />
                    <Route path="/perfil" element={<PaginaEnConstruccion />} />
                    <Route path="*" element={<PaginaEnConstruccion />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
