import {
    useContext
} from "react";

import ProductContext
    from "../context/ProductContext";


function useProducts() {

    const contexto =
        useContext(
            ProductContext
        );


    if (!contexto) {

        throw new Error(
            "useProducts debe utilizarse dentro de ProductProvider."
        );

    }


    return contexto;

}


export default useProducts;