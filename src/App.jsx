import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'; 

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import ProductoCilindro from './pages/ProductoCilindro';
import ProductoMusette from './pages/ProductoMusette';
import ProductoRc30 from './pages/ProductoRc30';
import Catalogo from './pages/Catalogo';
import QuienesSomos from './pages/QuienesSomos';
function App() {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Cilindro' element={<ProductoCilindro />} />
        <Route path='Musette' element={<ProductoMusette />} />
        <Route path='Rc30' element={<ProductoRc30 />} />
        <Route path='Catalogo' element={<Catalogo />} />
        <Route path='QuienesSomos' element={<QuienesSomos />} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;