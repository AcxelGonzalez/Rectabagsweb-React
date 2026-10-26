import {
    Offcanvas
} from "bootstrap";

import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom";

import ContadorCarrito
    from "./ContadorCarrito";

import useAuth
    from "../hooks/useAuth";


const claseNav = ({
    isActive
}) => {

    return isActive
        ? "nav-link text-white active"
        : "nav-link text-white";

};


function Header() {

    const navigate =
        useNavigate();


    const {
        usuarioActual,
        estaAutenticado,
        cerrarSesion
    } = useAuth();


    const manejarBusqueda = (
        evento
    ) => {

        evento.preventDefault();


        const formulario =
            new FormData(
                evento.currentTarget
            );


        const busqueda =
            String(
                formulario.get(
                    "buscar"
                ) || ""
            ).trim();


        if (!busqueda) {

            navigate(
                "/catalogo"
            );

            return;

        }


        navigate(
            `/catalogo?buscar=${encodeURIComponent(
                busqueda
            )}`
        );

    };


    function cerrarMenu() {

        const menu =
            document.getElementById(
                "menuLateral"
            );


        if (!menu) {

            return;

        }


        const offcanvas =
            Offcanvas.getInstance(
                menu
            );


        if (offcanvas) {

            offcanvas.hide();

        }

    }


    function manejarCerrarSesion() {

        cerrarMenu();

        cerrarSesion();

        navigate("/");

    }


    return (

        <>

            <header className="header-principal fixed-top bg-black text-white py-3">

                <div className="container-fluid px-3 px-md-4 d-flex justify-content-between align-items-center">


                    <div className="header-left d-flex align-items-center gap-2 gap-md-3">

                        <button
                            className="btn btn-link p-0"
                            aria-label="Menú"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#menuLateral"
                            aria-controls="menuLateral"
                        >

                            <img
                                src="/img/HEADER/icons8-menu-50.png"
                                alt="Menú"
                                className="icono-nav"
                            />

                        </button>


                        <form
                            id="form-buscar"
                            className="d-flex align-items-center m-0"
                            role="search"
                            onSubmit={
                                manejarBusqueda
                            }
                        >

                            <input
                                id="input-buscar"
                                name="buscar"
                                className="header-search-input form-control form-control-sm me-2 bg-dark border-secondary text-white d-none d-md-block"
                                type="search"
                                placeholder="Buscar..."
                                aria-label="Buscar"
                            />


                            <button
                                id="btn-buscar"
                                className="btn btn-link p-0"
                                aria-label="Buscar"
                                type="submit"
                            >

                                <img
                                    src="/img/HEADER/icons8-search-50.png"
                                    alt="Buscar"
                                    className="icono-nav"
                                />

                            </button>

                        </form>

                    </div>


                    <div className="header-center text-center">

                        <Link
                            to="/"
                            onClick={() =>
                                window.scrollTo(
                                    0,
                                    0
                                )
                            }
                        >

                            <img
                                src="/img/HEADER/Logo R.jpg"
                                alt="Recta"
                                className="logo-img"
                            />

                        </Link>


                        <p className="eslogan m-0 small mt-1 d-none d-sm-block">

                            “De ciclista para ciclistas”

                        </p>

                    </div>


                    <div className="header-right d-flex gap-2 gap-md-3">

                        <Link
                            id="enlace-usuario-header"
                            className="btn btn-link p-0"
                            aria-label={
                                estaAutenticado
                                    ? "Mi perfil"
                                    : "Iniciar sesión"
                            }
                            to={
                                estaAutenticado
                                    ? "/perfil"
                                    : "/login"
                            }
                        >

                            <img
                                src="/img/HEADER/icons8-user-50.png"
                                alt="Usuario"
                                className="icono-nav"
                            />

                        </Link>


                        <Link
                            className="btn btn-link p-0 position-relative"
                            aria-label="Carrito"
                            to="/carrito"
                        >

                            <img
                                src="/img/HEADER/icons8-shopping-cart-50.png"
                                alt="Carrito"
                                className="icono-nav"
                            />

                            <ContadorCarrito />

                        </Link>

                    </div>


                    <div
                        className="offcanvas offcanvas-start bg-dark text-white"
                        tabIndex="-1"
                        id="menuLateral"
                        aria-labelledby="menuLateralLabel"
                    >

                        <div className="offcanvas-header border-bottom border-secondary">

                            <h5
                                className="offcanvas-title fw-bold"
                                id="menuLateralLabel"
                            >
                                RectaBags
                            </h5>


                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="offcanvas"
                                aria-label="Cerrar"
                            />

                        </div>


                        <div className="offcanvas-body d-flex flex-column">

                            <ul className="nav nav-pills flex-column mb-auto">

                                <li className="nav-item">

                                    <NavLink
                                        to="/"
                                        className={
                                            claseNav
                                        }
                                        onClick={
                                            cerrarMenu
                                        }
                                    >
                                        Inicio
                                    </NavLink>

                                </li>


                                <li className="nav-item">

                                    <NavLink
                                        to="/catalogo"
                                        className={
                                            claseNav
                                        }
                                        onClick={
                                            cerrarMenu
                                        }
                                    >
                                        Catálogo
                                    </NavLink>

                                </li>

                                <li className="nav-item">

                                    <NavLink
                                        to="/ofertas"
                                        className={claseNav}
                                        onClick={cerrarMenu}
                                    >
                                        Ofertas
                                    </NavLink>

                                </li>       

                                <li className="nav-item">

                                    <NavLink
                                        to="/blog"
                                        className={
                                            claseNav
                                        }
                                        onClick={
                                            cerrarMenu
                                        }
                                    >
                                        Blog
                                    </NavLink>

                                </li>


                                <li className="nav-item">

                                    <NavLink
                                        to="/contacto"
                                        className={
                                            claseNav
                                        }
                                        onClick={
                                            cerrarMenu
                                        }
                                    >
                                        Contacto
                                    </NavLink>

                                </li>


                                <li className="nav-item">

                                    <NavLink
                                        to="/impacto-ambiental"
                                        className={
                                            claseNav
                                        }
                                        onClick={
                                            cerrarMenu
                                        }
                                    >
                                        Impacto Ambiental
                                    </NavLink>

                                </li>


                                <li className="nav-item">

                                    <NavLink
                                        to="/quienes-somos"
                                        className={
                                            claseNav
                                        }
                                        onClick={
                                            cerrarMenu
                                        }
                                    >
                                        Quiénes Somos
                                    </NavLink>

                                </li>

                            </ul>


                            <hr className="border-secondary" />


                            {
                                !estaAutenticado && (

                                    <div>

                                        <ul className="nav nav-pills flex-column">

                                            <li className="nav-item">

                                                <NavLink
                                                    to="/login"
                                                    className="nav-link text-white"
                                                    onClick={
                                                        cerrarMenu
                                                    }
                                                >
                                                    Iniciar sesión
                                                </NavLink>

                                            </li>


                                            <li className="nav-item">

                                                <NavLink
                                                    to="/registro"
                                                    className="nav-link text-white"
                                                    onClick={
                                                        cerrarMenu
                                                    }
                                                >
                                                    Registrarse
                                                </NavLink>

                                            </li>

                                        </ul>

                                    </div>

                                )
                            }


                            {
                                estaAutenticado &&
                                usuarioActual && (

                                    <div>

                                        <div className="mb-3 px-3">

                                            <div className="small text-secondary">
                                                Sesión iniciada como
                                            </div>


                                            <div className="fw-bold text-white">

                                                {
                                                    usuarioActual.nombre
                                                }{" "}

                                                {
                                                    usuarioActual.apellido
                                                }

                                            </div>


                                            <div className="small text-secondary">

                                                {
                                                    usuarioActual.correo
                                                }

                                            </div>

                                        </div>


                                        {
                                            usuarioActual.rol ===
                                                "admin" && (

                                                <div className="text-warning fw-bold small px-3 mb-2">

                                                    Administrador

                                                </div>

                                            )
                                        }


                                        <ul className="nav nav-pills flex-column">

                                            <li className="nav-item">

                                                <NavLink
                                                    to="/perfil"
                                                    className="nav-link text-white fw-bold"
                                                    onClick={
                                                        cerrarMenu
                                                    }
                                                >
                                                    Mi Perfil
                                                </NavLink>

                                            </li>


                                            <li className="nav-item">

                                                <button
                                                    type="button"
                                                    className="nav-link text-danger fw-bold text-start w-100"
                                                    onClick={
                                                        manejarCerrarSesion
                                                    }
                                                >
                                                    Cerrar sesión
                                                </button>

                                            </li>

                                        </ul>

                                    </div>

                                )
                            }

                        </div>

                    </div>

                </div>

            </header>

        </>

    );

}


export default Header;