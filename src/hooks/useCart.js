import {
    useContext
} from "react";

import CartContext
    from "../context/CartContext";


function useCart() {

    const contexto =
        useContext(
            CartContext
        );


    if (!contexto) {

        throw new Error(
            "useCart debe utilizarse dentro de CartProvider."
        );

    }


    return contexto;

}


export default useCart;