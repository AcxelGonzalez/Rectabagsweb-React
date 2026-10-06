import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

import './css/style_header_footer.css'
import './css/style_home.css'
import './css/style_login.css'
// style_catalogo.css queda fuera por ahora: define reglas globales (body, .card, .card img)
// que deforman Blog y Términos. Se vuelve a importar al migrar el Catálogo, con sus reglas acotadas.
// import './css/style_catalogo.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
