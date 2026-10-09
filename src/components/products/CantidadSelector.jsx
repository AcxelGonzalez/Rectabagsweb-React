function CantidadSelector({
    cantidad,
    onCambiar,
    maximo = 10
}) {

    function disminuir() {

        if (cantidad > 1) {

            onCambiar(
                cantidad - 1
            );

        }

    }


    function aumentar() {

        if (cantidad < maximo) {

            onCambiar(
                cantidad + 1
            );

        }

    }


    function manejarCambio(
        evento
    ) {

        const nuevaCantidad =
            Number(
                evento.target.value
            );


        if (
            Number.isNaN(
                nuevaCantidad
            )
        ) {

            return;

        }


        const cantidadValida =
            Math.min(
                maximo,
                Math.max(
                    1,
                    nuevaCantidad
                )
            );


        onCambiar(
            cantidadValida
        );

    }


    return (

        <div
            className="
                producto-cantidad
                input-group
                rounded-4
                overflow-hidden
                border
                border-secondary-subtle
                bg-white
            "
        >

            <button
                type="button"
                className="
                    btn
                    btn-light
                    border-0
                    fw-bold
                "
                onClick={
                    disminuir
                }
                disabled={
                    cantidad <= 1
                }
            >
                −
            </button>


            <input
                type="number"
                className="
                    form-control
                    border-0
                    text-center
                    fw-bold
                "
                value={cantidad}
                min="1"
                max={maximo}
                onChange={
                    manejarCambio
                }
                aria-label="Cantidad"
            />


            <button
                type="button"
                className="
                    btn
                    btn-light
                    border-0
                    fw-bold
                "
                onClick={
                    aumentar
                }
                disabled={
                    cantidad >= maximo
                }
            >
                +
            </button>

        </div>

    );

}


export default CantidadSelector;