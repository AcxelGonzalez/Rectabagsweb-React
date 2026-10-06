import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import QuienesSomos from './pages/QuienesSomos';
import ImpactoAmbiental from './pages/ImpactoAmbiental';
import TerminosCompra from './pages/TerminosCompra';
import TerminosRegistro from './pages/TerminosRegistro';

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/quienes-somos" element={<QuienesSomos />} />
                <Route path="/impacto-ambiental" element={<ImpactoAmbiental />} />
                <Route path="/terminos-compra" element={<TerminosCompra />} />
                <Route path="/terminos-registro" element={<TerminosRegistro />} />
                {/* Pendientes de migrar:
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/producto/:id" element={<ProductoDetalle />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/login" element={<Login />} />
                */}
            </Route>
        </Routes>
    );
}

export default App;
