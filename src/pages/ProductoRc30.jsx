import React, { useState } from 'react';

function ProductoRc30({ agregarAlCarrito }) {
    // cambio de miniatura a principal
    const [imagenPrincipal, setImagenPrincipal] = useState('/img/Mochila RC-30/MOCHILA_MAIN3.png');
    // contador
    const [cantidad, setCantidad] = useState(1);

    return (
        <main className="py-5 mt-5">
            <div className="container py-4">

                {/* galeria */}
                <section className="card border-0 rounded-5 p-4 mb-5 shadow-sm" style={{ backgroundColor: '#E8DED8' }}>
                    <div className="row g-4 align-items-start">
                        
                        {/* ruleta imagenes */}
                        <div className="col-lg-7 d-flex flex-column-reverse flex-lg-row gap-3">
                            

                            <div className="d-flex flex-row flex-lg-column gap-2 flex-shrink-0 overflow-x-auto" style={{ maxHeight: '520px' }}>
                                
                                <button 
                                    className={`btn p-0 border-0 rounded-4 overflow-hidden thumbnail-btn flex-shrink-0 ${imagenPrincipal === '/img/Mochila RC-30/MOCHILA_MAIN3.png' ? 'active' : ''}`} 
                                    style={{ width: '80px', height: '80px' }} 
                                    onClick={() => setImagenPrincipal('/img/Mochila RC-30/MOCHILA_MAIN3.png')}
                                >
                                    <img src="/img/Mochila RC-30/MOCHILA_MAIN3.png" alt="Vista lateral" className="img-fluid w-100 h-100 object-fit-cover" />
                                </button>

                                <button 
                                    className={`btn p-0 border-0 rounded-4 overflow-hidden thumbnail-btn flex-shrink-0 ${imagenPrincipal === '/img/Mochila RC-30/MOCHILA_MAIN2.png' ? 'active' : ''}`} 
                                    style={{ width: '80px', height: '80px' }} 
                                    onClick={() => setImagenPrincipal('/img/Mochila RC-30/MOCHILA_MAIN2.png')}
                                >
                                    <img src="/img/Mochila RC-30/MOCHILA_MAIN2.png" alt="Vista inferior" className="img-fluid w-100 h-100 object-fit-cover" />
                                </button>

                                <button 
                                    className={`btn p-0 border-0 rounded-4 overflow-hidden thumbnail-btn flex-shrink-0 ${imagenPrincipal === '/img/Mochila RC-30/MOCHILA_MAIN.png' ? 'active' : ''}`} 
                                    style={{ width: '80px', height: '80px' }} 
                                    onClick={() => setImagenPrincipal('/img/Mochila RC-30/MOCHILA_MAIN.png')}
                                >
                                    <img src="/img/Mochila RC-30/MOCHILA_MAIN.png" alt="Vista frontal" className="img-fluid w-100 h-100 object-fit-cover" />
                                </button>

                            </div>
                            
                            <div className="rounded-4 overflow-hidden flex-grow-1 bg-white" style={{ aspectRatio: '1 / 1', maxHeight: '520px' }}>
                                <img id="imagen-principal" src={imagenPrincipal} alt="Mochila RC-30" className="img-fluid w-100 h-100 object-fit-contain" />
                            </div>

                        </div>

                        {/* info producto*/}
                        <div className="col-lg-5">
                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 mb-2">Mochilas</span>
                            <h1 className="h2 fw-bold text-dark mb-1">Mochila RC-30</h1>
                            <p className="display-6 fw-bold text-dark mb-4">$45.000</p>

                            {/* descripcion */}
                            <div className="bg-white rounded-4 p-3 mb-3 shadow-sm">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h2 className="h6 fw-bold m-0">Descripción</h2>
                                    <span className="small">▲</span>
                                </div>
                                <p className="small text-secondary m-0">
                                    Mochila de 30 litros de capacidad, diseñada para un uso funcional y versátil. Incorpora bolsillos organizadores internos que optimizan el almacenamiento y una red frontal externa que permite ampliar la capacidad de carga. Ideal para actividades diarias, viajes cortos o uso outdoor.
                                </p>
                            </div>

                            {/* cantidad + añadir al carrito*/}
                            <div className="d-flex gap-2 mb-3">
                                {/* inputs + o -*/}
                                <div className="input-group rounded-4 overflow-hidden border border-secondary-subtle bg-white" style={{ width: '140px', height: '50px' }}>
                                    <button className="btn btn-light border-0 fw-bold px-3" type="button" onClick={() => cantidad > 1 && setCantidad(cantidad - 1)}>-</button>
                                    <input id="cant-rc30" type="number" className="form-control border-0 text-center fw-bold p-0" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} style={{ boxShadow: 'none' }} min="1" max="10" />
                                    <button className="btn btn-light border-0 fw-bold px-3" type="button" onClick={() => cantidad < 10 && setCantidad(cantidad + 1)}>+</button>
                                </div>

                                {/* botoncito */}
                                <button className="btn btn-dark flex-grow-1 py-3 rounded-4 fw-bold" style={{ height: '50px' }} 
                                    onClick={() => agregarAlCarrito({
                                        id: 'mochila-rc30',
                                        nombre: 'Mochila RC-30',
                                        categoria: 'Mochilas',
                                        precio: 45000,
                                        medidas: '30 cm ancho x 45 cm alto x 15 cm largo',
                                        imagen: imagenPrincipal,
                                        cantidad: cantidad
                                    })}>
                                    Añadir al carro
                                </button>
                            </div>

                            <div className="bg-white rounded-4 p-3 shadow-sm">
                                <h2 className="h6 fw-bold mb-2">Medidas</h2>
                                <ul className="list-unstyled small text-secondary m-0">
                                    <li><strong>30 cm</strong> de ancho</li>
                                    <li><strong>45 cm</strong> de alto</li>
                                    <li><strong>15 cm</strong> de largo</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </section>

                {/* especificaciones*/}
                <section className="card border-0 rounded-5 p-4 shadow-sm" style={{ backgroundColor: '#E8DED8' }}>
                    <div className="row g-4">
                        
                        <div className="col-md-3">
                            <div className="p-3 bg-white rounded-4 h-100 d-flex flex-column justify-content-between shadow-sm">
                                <div>
                                    <span className="small text-muted d-block">Mochilas</span>
                                    <h3 className="h5 fw-bold mb-2">Mochila RC-30</h3>
                                </div>
                                
                                <div className="my-2 text-center flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden">
                                    <img 
                                        src="/img/Mochila RC-30/RC-30_BOTTOM.png" 
                                        alt="Imagen Cilindro" 
                                        className="img-fluid w-100 h-100 object-fit-cover" 
                                        style={{ height: '220px' }}
                                    />
                                </div>
                                
                                <div className="small text-muted pt-2 border-top">
                                    <p className="m-0 fw-bold text-dark">Medidas:</p>
                                    <p className="m-0">30 cm de ancho</p>
                                    <p className="m-0">45 cm de alto</p>
                                    <p className="m-0">15 cm de largo</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <h2 className="h5 fw-bold mb-3">Opiniones del producto: 'Mochila RC-30'</h2>
                            
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <span className="display-6 fw-bold">4,8</span>
                                <div className="text-warning fs-4">★★★★★</div>
                            </div>

                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex align-items-center gap-2 small">
                                    <div className="progress flex-grow-1" style={{ height: 8 }}>
                                        <div className="progress-bar bg-secondary" style={{ width: '90%' }}></div>
                                    </div>
                                    <span>5 ★</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small">
                                    <div className="progress flex-grow-1" style={{ height: 8 }}>
                                        <div className="progress-bar bg-secondary" style={{ width: '10%' }}></div>
                                    </div>
                                    <span>4 ★</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small">
                                    <div className="progress flex-grow-1" style={{ height: 8 }}>
                                        <div className="progress-bar bg-secondary" style={{ width: '0%' }}></div>
                                    </div>
                                    <span>3 ★</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small">
                                    <div className="progress flex-grow-1" style={{ height: 8 }}>
                                        <div className="progress-bar bg-secondary" style={{ width: '0%' }}></div>
                                    </div>
                                    <span>2 ★</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small">
                                    <div className="progress flex-grow-1" style={{ height: 8 }}>
                                        <div className="progress-bar bg-secondary" style={{ width: '0%' }}></div>
                                    </div>
                                    <span>1 ★</span>
                                </div>
                            </div>
                        </div>

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

export default ProductoRc30;