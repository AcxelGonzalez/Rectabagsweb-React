import useCart
    from "../hooks/useCart";


function ContadorCarrito() {

    const {
        cantidadProductos
    } = useCart();


    if (
        cantidadProductos === 0
    ) {

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
            {cantidadProductos}
        </span>

    );

}


export default ContadorCarrito;