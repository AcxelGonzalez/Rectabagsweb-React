import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Lista de productos extraída del HTML original
const PRODUCTOS = [
    {
        id: 1,
        nombre: 'Cilindro',
        precio: '$32.000',
        descripcion: 'Cilindro customisable para bicicletas de RECTA.',
        imagen: '/img/CILINDRO/CILINDRO_MAIN.png',
        categoria: 'cilindro',
        link: '/Cilindro'
    },
    {
        id: 2,
        nombre: 'Musette',
        precio: '$18.000',
        descripcion: 'Musette customisable de RECTA.',
        imagen: '/img/Musette/Musette_main.png',
        categoria: 'musette',
        link: '/Musette'
    },
    {
        id: 3,
        nombre: 'RC-30',
        precio: '$45.000',
        descripcion: 'Mochila modelo RC-30 customisable de RECTA.',
        imagen: '/img/Mochila RC-30/MOCHILA_MAIN3.png',
        categoria: 'mochilas',
        link: '/Rc30'
    },
    {
        id: 4,
        nombre: 'Cilindro x thomson',
        precio: '$35.000',
        descripcion: 'Cilindro colaboración con thomson.',
        imagen: '/img/FOTOS_EJEMPLOS_TEMP/cilindro_th.png',
        categoria: 'cilindro',
        link: '#'
    },
    {
        id: 5,
        nombre: 'Cilindro',
        precio: '$32.000',
        descripcion: 'Cilindro verde customizado.',
        imagen: '/img/FOTOS_EJEMPLOS_TEMP/cilindro_vd.png',
        categoria: 'cilindro',
        link: '#'
    },
    {
        id: 6,
        nombre: 'Hippouch porta ulock',
        precio: '$40.000',
        descripcion: 'Hippouch porta ulock customizable de RECTA.',
        imagen: '/img/FOTOS_EJEMPLOS_TEMP/hippopunch.png',
        categoria: 'otros',
        link: '#'
    },
    {
        id: 7,
        nombre: 'EVA-01',
        precio: '$35.000',
        descripcion: 'EVA-01 customizado.',
        imagen: '/img/FOTOS_EJEMPLOS_TEMP/vea01.png',
        categoria: 'otros',
        link: '#'
    },
    {
        id: 8,
        nombre: 'RC-30',
        precio: '$44.000',
        descripcion: 'RC-30 verde customizada.',
        imagen: '/img/FOTOS_EJEMPLOS_TEMP/mochi.png',
        categoria: 'mochilas',
        link: '#'
    },
    {
        id: 9,
        nombre: 'RC-30',
        precio: '$44.000',
        descripcion: 'RC-30 rosa customizada.',
        imagen: '/img/FOTOS_EJEMPLOS_TEMP/mochila_r.png',
        categoria: 'mochilas',
        link: '#'
    }
];

function Catalogo() {
    // filtro
    const [filtroActivo, setFiltroActivo] = useState('all');

    // Filtrar los productos según la categoría seleccionada
    const productosFiltrados = filtroActivo === 'all' 
        ? PRODUCTOS 
        : PRODUCTOS.filter(producto => producto.categoria === filtroActivo);

    return (
        /* contenedor principal */
        <div className="layout-container">

            <aside className="sidebar">
                <h2 className="sidebar-title">Productos</h2>
                <div className="menu-group">
                    <span className="category-title">▼ Categorías</span>
                    <ul>
                       
                        <li>
                            <button 
                                type="button"
                                className={`filter-link btn p-0 border-0 text-start bg-transparent ${filtroActivo === 'all' ? 'fw-bold' : ''}`} 
                                onClick={() => setFiltroActivo('all')}
                            >
                                ≡ Todos los productos
                            </button>
                        </li>
                        <li>
                            <button 
                                type="button"
                                className={`filter-link btn p-0 border-0 text-start bg-transparent ${filtroActivo === 'mochilas' ? 'fw-bold' : ''}`} 
                                onClick={() => setFiltroActivo('mochilas')}
                            >
                                ≡ Mochilas
                            </button>
                        </li>
                        <li>
                            <button 
                                type="button"
                                className={`filter-link btn p-0 border-0 text-start bg-transparent ${filtroActivo === 'cilindro' ? 'fw-bold' : ''}`} 
                                onClick={() => setFiltroActivo('cilindro')}
                            >
                                ≡ Cilindros
                            </button>
                        </li>
                        <li>
                            <button 
                                type="button"
                                className={`filter-link btn p-0 border-0 text-start bg-transparent ${filtroActivo === 'musette' ? 'fw-bold' : ''}`} 
                                onClick={() => setFiltroActivo('musette')}
                            >
                                ≡ Musette
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>


            <main className="main-content">
                <h1 className="titulo-mono">EXPLORA EL QUE SE ADAPTE A TI</h1>
                

                <div className="catalog-grid">
                    {productosFiltrados.map((producto) => (

                        <article key={producto.id} className="card" data-category={producto.categoria}>
                            <Link to={producto.link}>
                                <img src={producto.imagen} alt={producto.nombre} />
                            </Link>
                            <div className="card-content">
                                <h3>{producto.nombre}</h3>
                                <span className="price">{producto.precio}</span>
                                <p>{producto.descripcion}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Catalogo;