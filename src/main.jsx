import {
    StrictMode
} from "react";

import {
    createRoot
} from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import "./css/style_header_footer.css";

import App
    from "./App.jsx";

import CartProvider
    from "./context/CartProvider.jsx";

import AuthProvider
    from "./context/AuthProvider.jsx";

createRoot(
    document.getElementById("root")
).render(

    <StrictMode>

        <AuthProvider>

            <CartProvider>

                <App />

            </CartProvider>

        </AuthProvider>

    </StrictMode>,

);