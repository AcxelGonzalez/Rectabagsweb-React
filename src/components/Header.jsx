import { Link, NavLink } from 'react-router-dom';

// Clases de cada ítem del menú: "active" solo se aplica en la página actual
const claseMenu = ({ isActive }) =>
    'nav-link text-white' + (isActive ? ' active bg-secondary' : '');

function Header() {
    return (
        <>
            <header className="header-principal fixed-top bg-black text-white py-3">
                <div className="container-fluid px-4 d-flex justify-content-between align-items-center">


                    <div className="header-left d-flex align-items-center gap-3">
                        <button className="btn btn-link p-0" aria-label="Menú" data-bs-toggle="offcanvas" data-bs-target="#menuLateral" aria-controls="menuLateral">
                            <img src="/img/HEADER/icons8-menu-50.png" alt="Menú" className="icono-nav" />
                        </button>
                        {/* onSubmit evita que el formulario recargue la página (el buscador se conectará más adelante) */}
                        <form id="form-buscar" className="d-flex align-items-center m-0" role="search" onSubmit={(e) => e.preventDefault()}>
                            <input id="input-buscar" className="form-control form-control-sm me-2 bg-dark border-secondary text-white d-none d-md-block" type="search" placeholder="Buscar..." aria-label="Search"/>
                            <button id="btn-buscar" className="btn btn-link p-0" aria-label="Buscar" type="submit">
                                <img src="/img/HEADER/icons8-search-50.png" alt="Buscar" className="icono-nav"/>
                            </button>
                        </form>
                    </div>


                    <div className="header-center text-center">
                        <Link to="/">
                            <img src="/img/HEADER/Logo R.jpg" alt="Recta" className="logo-img"/>
                        </Link>
                        <p className="eslogan m-0 small mt-1">“De ciclista para ciclistas”</p>
                    </div>


                    <div className="header-right d-flex gap-3">

                        {/* Por ahora lleva al login; más adelante dependerá de si hay sesión iniciada */}
                        <Link id="enlace-usuario-header" className="btn btn-link p-0" aria-label="Usuario" to="/login">
                            <img src="/img/HEADER/icons8-user-50.png" alt="Usuario" className="icono-nav"/>
                        </Link>
                        <Link className="btn btn-link p-0" aria-label="Carrito" to="/carrito">
                            <img src="/img/HEADER/icons8-shopping-cart-50.png" alt="Carrito" className="icono-nav"/>
                        </Link>
                    </div>


                    <div className="offcanvas offcanvas-start bg-dark text-white" tabIndex="-1" id="menuLateral" aria-labelledby="menuLateralLabel">
                        <div className="offcanvas-header border-bottom border-secondary">
                            <h5 className="offcanvas-title fw-bold" id="menuLateralLabel">RectaBags</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
                        </div>

                        <div className="offcanvas-body d-flex flex-column">
                            <ul className="nav nav-pills flex-column mb-auto">
                                <li className="nav-item"><NavLink to="/" end className={claseMenu} data-bs-dismiss="offcanvas">Inicio</NavLink></li>
                                <li className="nav-item"><NavLink to="/catalogo" className={claseMenu} data-bs-dismiss="offcanvas">Catálogo</NavLink></li>
                                <li className="nav-item"><NavLink to="/blog" className={claseMenu} data-bs-dismiss="offcanvas">Blog</NavLink></li>
                                <li className="nav-item"><NavLink to="/contacto" className={claseMenu} data-bs-dismiss="offcanvas">Contacto</NavLink></li>
                                <li className="nav-item"><NavLink to="/impacto-ambiental" className={claseMenu} data-bs-dismiss="offcanvas">Impacto Ambiental</NavLink></li>
                                <li className="nav-item"><NavLink to="/quienes-somos" className={claseMenu} data-bs-dismiss="offcanvas">Quiénes Somos</NavLink></li>
                            </ul>

                            <hr className="border-secondary"/>


                            <div id="menu-visitante">
                                <ul className="nav nav-pills flex-column">
                                    <li className="nav-item"><NavLink to="/login" className={claseMenu} data-bs-dismiss="offcanvas">Log in</NavLink></li>
                                    <li className="nav-item"><NavLink to="/registro" className={claseMenu} data-bs-dismiss="offcanvas">Registro</NavLink></li>
                                </ul>
                            </div>


                            {/* Estos dos bloques seguirán ocultos hasta que exista la sesión de usuario (AuthContext) */}
                            <div id="menu-usuario" className="d-none">
                                <ul className="nav nav-pills flex-column">
                                    <li className="nav-item"><Link to="/perfil" className="nav-link text-white fw-bold" data-bs-dismiss="offcanvas">Mi Perfil</Link></li>
                                    <li className="nav-item"><a href="#" className="nav-link text-danger fw-bold btn-logout">Cerrar Sesión</a></li>
                                </ul>
                            </div>


                            <div id="menu-admin" className="d-none">

                                <div className="text-warning fw-bold small mb-2">
                                    ▼ ADMINISTRACIÓN
                                </div>

                                <ul className="nav nav-pills flex-column">

                                    <li className="nav-item">
                                        <Link
                                            to="/admin/productos"
                                            className="nav-link text-warning"
                                            data-bs-dismiss="offcanvas">
                                            ≡ Gestión de Productos
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            to="/admin/usuarios"
                                            className="nav-link text-warning"
                                            data-bs-dismiss="offcanvas">
                                            ≡ Gestión de Usuarios
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <a
                                            href="#"
                                            className="nav-link text-danger fw-bold btn-logout">
                                            Cerrar Sesión
                                        </a>
                                    </li>

                                </ul>

                            </div>

                        </div>
                    </div>

                </div>
            </header>
        </>

    );
}

export default Header;
