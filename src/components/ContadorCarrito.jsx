
import { useState, useEffect } from 'react';

function ContadorCarrito() {
    // Lógica
    const [numero, setNumero] = useState(0);

    function actualizarContador() {
        try {
            const carrito = JSON.parse(localStorage.getItem('recta_carrito_invitado')) || [];
            const total = Array.isArray(carrito)
                ? carrito.reduce((suma, item) => suma + Number(item.cantidad || 0), 0)
                : 0;

            setNumero(total);
        } catch {
            setNumero(0);
        }
    }

    useEffect(() => {
        actualizarContador();

        window.addEventListener('carritoActualizado', actualizarContador);
        window.addEventListener('storage', actualizarContador);

        return () => {
            window.removeEventListener('carritoActualizado', actualizarContador);
            window.removeEventListener('storage', actualizarContador);
        };
    }, []);

    // Render
    if (numero === 0) return null;

    return (
    <span
        className="position-absolute badge rounded-pill bg-danger"
        style={{ top: '-5px', right: '-10px', fontSize: '10px' }}
    >
        {numero}
    </span>
);
}

export default ContadorCarrito;
