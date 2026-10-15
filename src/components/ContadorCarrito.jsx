import {
    useEffect,
    useState
} from "react";


function obtenerTotalCarrito() {

    try {

        const carrito =
            JSON.parse(
                localStorage.getItem(
                    "recta_carrito_invitado"
                )
            ) || [];


        if (!Array.isArray(carrito)) {
            return 0;
        }


        return carrito.reduce(
            (suma, item) =>
                suma +
                Number(
                    item.cantidad || 0
                ),
            0
        );

    } catch {

        return 0;

    }

}


function ContadorCarrito() {

    const [
        numero,
        setNumero
    ] = useState(
        obtenerTotalCarrito
    );


    useEffect(() => {

        function actualizarContador() {

            setNumero(
                obtenerTotalCarrito()
            );

        }


        window.addEventListener(
            "carritoActualizado",
            actualizarContador
        );

        window.addEventListener(
            "storage",
            actualizarContador
        );


        return () => {

            window.removeEventListener(
                "carritoActualizado",
                actualizarContador
            );

            window.removeEventListener(
                "storage",
                actualizarContador
            );

        };

    }, []);


    if (numero === 0) {

        return null;

    }


    return (

        <span
            className="
                position-absolute
                badge
                rounded-pill
                bg-danger
            "
            style={{
                top: "-5px",
                right: "-10px",
                fontSize: "10px"
            }}
        >
            {numero}
        </span>

    );

}


export default ContadorCarrito;