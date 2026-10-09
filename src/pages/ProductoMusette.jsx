import React, { useState } from 'react';

function ProductoMusette({ agregarAlCarrito }) {
    // cambio de la miniatura hacia la imagen principal
    const [imagenPrincipal, setImagenPrincipal] = useState('/img/Musette/Musette_main.png');
    // contador de cantidad (jaja)
    const [cantidad, setCantidad] = useState(1);

    return (
        <main className="py-5 mt-5">
            <div className="container py-4">

                {/* ficha de producto principal */}
                <section className="card border-0 rounded-5 p-4 mb-5 shadow-sm" style={{ backgroundColor: '#E8DED8' }}>
                    <div className="row g-4 align-items-start">
                        {/* galeria */}
                        <div className="col-lg-7 d-flex flex-column-reverse flex-lg-row gap-3">
                            
                            {/* miniaturas */}
                            <div className="d-flex flex-row flex-lg-column gap-2 flex-shrink-0 overflow-x-auto" style={{ maxHeight: '520px' }}>
                                <button 
                                    className={`btn p-0 border-0 rounded-4 overflow-hidden thumbnail-btn flex-shrink-0 ${imagenPrincipal === '/img/Musette/Musette_main.png' ? 'active' : ''}`} 
                                    style={{ width: '80px', height: '80px' }} 
                                    onClick={() => setImagenPrincipal('/img/Musette/Musette_main.png')}
                                >
                                    <img src="/img/Musette/Musette_main.png" alt="Vista frontal" className="img-fluid w-100 h-100 object-fit-cover" />
                                </button>

                                <button 
                                    className={`btn p-0 border-0 rounded-4 overflow-hidden thumbnail-btn flex-shrink-0 ${imagenPrincipal === '/img/Musette/Musette_main2.png' ? 'active' : ''}`} 
                                    style={{ width: '80px', height: '80px' }} 
                                    onClick={() => setImagenPrincipal('/img/Musette/Musette_main2.png')}
                                >
                                    <img src="/img/Musette/Musette_main2.png" alt="Vista inferior" className="img-fluid w-100 h-100 object-fit-cover" />
                                </button>

                                <button 
                                    className={`btn p-0 border-0 rounded-4 overflow-hidden thumbnail-btn flex-shrink-0 ${imagenPrincipal === '/img/Musette/Musette_main3.jpeg' ? 'active' : ''}`} 
                                    style={{ width: '80px', height: '80px' }} 
                                    onClick={() => setImagenPrincipal('/img/Musette/Musette_main3.jpeg')}
                                >
                                    <img src="/img/Musette/Musette_main3.jpeg" alt="Vista lateral" className="img-fluid w-100 h-100 object-fit-cover" />
                                </button>
                            </div>

                            {/* imagen principal */}
                            <div className="rounded-4 overflow-hidden flex-grow-1 bg-white" style={{ aspectRatio: '1 / 1', maxHeight: '520px' }}>
                                <img id="imagen-principal" src={imagenPrincipal} alt="Musette" className="img-fluid w-100 h-100 object-fit-contain" />
                            </div>

                        </div>

                        {/* info productos */}
                        <div className="col-lg-5">
                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 mb-2">Musettes</span>
                            <h1 className="h2 fw-bold text-dark mb-1">Musette</h1>
                            <p className="display-6 fw-bold text-dark mb-4">$18.000</p>

                            {/* descripcion */}
                            <div className="bg-white rounded-4 p-3 mb-3 shadow-sm">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h2 className="h6 fw-bold m-0">Descripción</h2>
                                    <span className="small">▲</span>
                                </div>
                                <p className="small text-secondary m-0">
                                    Bolso cruzado de perfil bajo inspirado en el clásico musette de ciclismo, reestructurado para el uso urbano e interurbano. Confeccionado en textil de alta resistencia con cierre impermeable, incorpora un bolsillo frontal de malla para acceso rápido y una correa cruzada de tres puntos con hebilla táctica que evita el desplazamiento al pedalear. Ideal para transportar esenciales, herramientas o alimentos con total estabilidad.
                                </p>
                            </div>

                            {/* cantidad + boton */}
                            <div className="d-flex gap-2 mb-3">
                                <div className="input-group rounded-4 overflow-hidden border border-secondary-subtle bg-white" style={{ width: '140px', height: '50px' }}>
                                    <button className="btn btn-light border-0 fw-bold px-3" type="button" onClick={() => cantidad > 1 && setCantidad(cantidad - 1)}>-</button>
                                    <input id="cant-musette" type="number" className="form-control border-0 text-center fw-bold p-0" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} style={{ boxShadow: 'none' }} min="1" max="10" />
                                    <button className="btn btn-light border-0 fw-bold px-3" type="button" onClick={() => cantidad < 10 && setCantidad(cantidad + 1)}>+</button>
                                </div>

                                <button className="btn btn-dark flex-grow-1 py-3 rounded-4 fw-bold" style={{ height: '50px' }} 
                                    onClick={() => agregarAlCarrito({
                                        id: 'musette',
                                        nombre: 'Musette',
                                        categoria: 'Musettes',
                                        precio: 18000,
                                        medidas: '35 cm de ancho x 31 cm de alto',
                                        imagen: imagenPrincipal,
                                        cantidad: cantidad
                                    })}>
                                    Añadir al carro
                                </button>
                            </div>

                            {/* medidas */}
                            <div className="bg-white rounded-4 p-3 shadow-sm">
                                <h2 className="h6 fw-bold mb-2">Medidas</h2>
                                <ul className="list-unstyled small text-secondary m-0">
                                    <li><strong>35 cm</strong> de ancho</li>
                                    <li><strong>31 cm</strong> de alto</li>
                                </ul>
                            </div>                              
                        </div>
                    </div>
                </section>

                {/* especificacion + opiniones */}
                <section className="card border-0 rounded-5 p-4 mt-5 shadow-sm" style={{ backgroundColor: '#E8DED8' }}>
                    <div className="row g-4">
                        
                        {/* resumen */}
                        <div className="col-md-3">
                            <div className="p-3 bg-white rounded-4 h-100 d-flex flex-column justify-content-between shadow-sm">
                                <div>
                                    <span className="small text-muted d-block">Musettes</span>
                                    <h3 className="h5 fw-bold mb-2">Musette</h3>
                                </div>
                                
                                <div className="my-2 text-center flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden">
                                    <img 
                                        src="/img/Musette/Musette_bottom.png" 
                                        alt="Imagen Musette" 
                                        className="img-fluid w-100 h-100 object-fit-cover" 
                                        style={{ height: '220px' }}
                                    />
                                </div>
                                
                                <div className="small text-muted pt-2 border-top">
                                    <p className="m-0 fw-bold text-dark">Medidas:</p>
                                    <p className="m-0">35 cm de ancho</p>
                                    <p className="m-0">31 cm de alto</p>
                                </div>
                            </div>
                        </div>

                        {/* opiniones */}
                        <div className="col-md-5">
                            <h2 className="h5 fw-bold mb-3">Opiniones del producto: 'Musette'</h2>
                            
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <span className="display-6 fw-bold">4,8</span>
                                <div className="text-warning fs-4">★★★★★</div>
                            </div>

                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex align-items-center gap-2 small">
                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-secondary" style={{ width: '100%' }}></div>
                                    </div>
                                    <span>5 ★</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small">
                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-secondary" style={{ width: '0%' }}></div>
                                    </div>
                                    <span>4 ★</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small">
                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-secondary" style={{ width: '0%' }}></div>
                                    </div>
                                    <span>3 ★</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small">
                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-secondary" style={{ width: '0%' }}></div>
                                    </div>
                                    <span>2 ★</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small">
                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-secondary" style={{ width: '0%' }}></div>
                                    </div>
                                    <span>1 ★</span>
                                </div>
                            </div>
                        </div>

                        {/* productos relacionados */}
                        <div className="col-md-4">
                            <h2 className="h5 fw-bold mb-3">Te podría interesar</h2>
                            <div className="rounded-4 h-75 overflow-hidden" style={{ backgroundColor: '#F1E4D6' }}>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </main>
    );
}

export default ProductoMusette;