import { obtenerStockValido } from "./stock";

/*
 sincroniza carrito + catálogo en caso de que se edite un producto que ya se encontraba en carrito
 */


// Precio que corresponde cobrar hoy: el de oferta solo si es menor.
export function precioVigente(producto) {

    const precio = Number(producto.precio) || 0;
    const oferta = Number(producto.precioOferta) || 0;

    return oferta > 0 && oferta < precio ? oferta : precio;

}


export function sincronizarCarrito(carrito, productos) {

    const items = Array.isArray(carrito) ? carrito : [];
    const catalogo = Array.isArray(productos) ? productos : [];
    const cambios = [];
    const resultado = [];

    // Marca si algún dato del ítem quedo distinto
    let algoCambio = false;


    for (const item of items) {
        const producto = catalogo.find(
            (p) => Number(p.id) === Number(item.id)
        );


        // El administrador eliminó el producto del catálogo.
        if (!producto) {

            cambios.push({
                tipo: "eliminado",
                nombre: item.nombre,
                texto: `${item.nombre} ya no está disponible y se quitó de tu carrito.`
            });

            continue;

        }

        const stock = obtenerStockValido(producto.stock);

        // Se quedó sin stock mientras estaba en el carrito.
        if (stock === 0) {

            cambios.push({
                tipo: "agotado",
                nombre: producto.nombre,
                texto: `${producto.nombre} quedó sin stock y se quitó de tu carrito.`
            });

            continue;

        }


        const precio = precioVigente(producto);
        const cantidadPedida = Number(item.cantidad) || 1;
        const cantidad = Math.min(cantidadPedida, stock);


        if (cantidad < cantidadPedida) {

            cambios.push({
                tipo: "stock",
                nombre: producto.nombre,
                texto: `Solo quedan ${stock} unidades de ${producto.nombre}; ajustamos la cantidad.`
            });

        }


        if (precio !== Number(item.precio)) {

            cambios.push({
                tipo: "precio",
                nombre: producto.nombre,
                anterior: Number(item.precio),
                nuevo: precio,
                texto: `El precio de ${producto.nombre} cambió y se actualizó en tu carrito.`
            });

        }

        const itemAlDia = {
            ...item,
            nombre: producto.nombre,
            imagen: producto.imagen,
            precio,
            cantidad,
            stock
        };

        /*
        Actualiza el nombre, imagen y el n° de stock.
         */
        if (
            itemAlDia.nombre !== item.nombre ||
            itemAlDia.imagen !== item.imagen ||
            itemAlDia.precio !== Number(item.precio) ||
            itemAlDia.cantidad !== cantidadPedida ||
            itemAlDia.stock !== Number(item.stock)
        ) {
            algoCambio = true;

        }

        resultado.push(itemAlDia);

    }
    const huboCambios =
        algoCambio ||
        cambios.length > 0 ||
        resultado.length !== items.length;

    return {
        carrito: huboCambios ? resultado : items,
        cambios,
        huboCambios
    };

}


/*
 Une el carrito de invitado con el del usuario que inicia sesión,
 para que no se pierda lo que juntó antes de entrar.
 */
export function fusionarCarritos(carritoInvitado, carritoUsuario) {

    const invitado = Array.isArray(carritoInvitado) ? carritoInvitado : [];
    const usuario = Array.isArray(carritoUsuario) ? carritoUsuario : [];

    // Se parte del carrito del usuario y se le suma el de invitado.
    const resultado = usuario.map((item) => ({ ...item }));


    for (const item of invitado) {

        const existente = resultado.find(
            (guardado) => Number(guardado.id) === Number(item.id)
        );

        const stock = obtenerStockValido(item.stock);


        if (!existente) {

            resultado.push({
                ...item,
                cantidad: Math.min(Number(item.cantidad) || 1, stock)
            });

            continue;

        }

        // Si el producto ya estaba, se suman las cantidades sin pasar del stock.
        const suma =
            (Number(existente.cantidad) || 0) + (Number(item.cantidad) || 0);

        existente.cantidad = Math.min(
            suma,
            obtenerStockValido(existente.stock, stock)
        );

    }

    return resultado;

}