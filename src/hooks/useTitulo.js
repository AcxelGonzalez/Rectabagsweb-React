import { useEffect } from 'react';

// Cambia el título de la pestaña del navegador (lo que antes era la etiqueta <title> de cada HTML)
function useTitulo(titulo) {
    useEffect(() => {
        document.title = titulo;
    }, [titulo]);
}

export default useTitulo;
