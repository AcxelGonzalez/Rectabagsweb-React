# RectaBags - Frontend React

Proyecto frontend desarrollado para **RectaBags**, emprendimiento orientado a la fabricación de mochilas rolltop y equipamiento de bikepacking.

El proyecto corresponde a la asignatura **DSY1104 - Desarrollo Fullstack II** y representa la migración y ampliación de una versión inicial desarrollada con HTML, CSS, JavaScript y Bootstrap hacia una arquitectura basada en **React + Vite**.

La aplicación implementa catálogo, ofertas, autenticación, carrito, checkout, persistencia simulada, administración de productos y usuarios, gestión de órdenes, reportes y una suite de pruebas unitarias con **Vitest**.

---

# Tecnologías utilizadas

## Frontend

- React 19.
- React DOM 19.
- React Router DOM 7.
- Vite 8.
- Bootstrap 5.
- JavaScript.
- HTML5.
- CSS3.
- ESLint.

## Persistencia simulada

- LocalStorage.

## Testing

- Vitest 5.
- jsdom 30.
- `@vitest/coverage-v8`.
- V8 Coverage.

---

# Funcionalidades implementadas

## Navegación

- Navegación mediante React Router.
- Layout reutilizable con Header y Footer compartidos.
- Menú responsive.
- Navegación diferenciada para visitante, cliente y administrador.
- Rutas dinámicas.
- Redirecciones.
- Manejo de rutas inexistentes.
- Actualización automática del scroll al cambiar de página.
- Títulos dinámicos mediante hook personalizado.
- Protección de rutas administrativas.

---

## Página principal

- Home responsive.
- Hero principal.
- Secciones informativas.
- Accesos al catálogo y otras vistas.
- Integración con redes sociales.

---

# Catálogo y ofertas

La información de productos se centraliza mediante `ProductProvider` y se persiste en LocalStorage.

Funcionalidades:

- Catálogo dinámico.
- Tarjetas reutilizables.
- Filtros por categoría.
- Búsqueda desde el catálogo.
- Búsqueda desde el Header mediante parámetros en URL.
- Combinación de búsqueda y categoría.
- Mensaje cuando no existen resultados.
- Navegación al detalle de cada producto.
- Vista de ofertas.
- Soporte para precio normal y precio de oferta.
- Sincronización de cambios del catálogo entre pestañas mediante eventos `storage`.

Categorías utilizadas actualmente:

- Mochilas.
- Cilindros.
- Musette.
- Otros productos.

> La versión actual utiliza filtros de categoría dentro del catálogo. No existe una vista independiente exclusiva de categorías.

---

# Detalle de productos

Cada producto dispone de una vista dinámica mediante su identificador.

Incluye:

- Ruta dinámica por producto.
- Galería de imágenes.
- Cambio de imagen principal.
- Selector de cantidad.
- Entrada de cantidad mediante teclado.
- Control de stock mínimo y máximo.
- Manejo de productos agotados.
- Precio normal y precio de oferta cuando corresponde.
- Información adicional y medidas.
- Valoraciones y opiniones.
- Agregar al carrito.
- Manejo de productos inexistentes.

---

# Productos y stock

La lógica de productos y stock se concentra principalmente en:

```text
src/context/ProductProvider.jsx
src/utils/stock.js
src/data/productos.js
```

Se implementó:

- Lectura del catálogo inicial.
- Persistencia en `recta_productos`.
- Creación de productos.
- Edición de productos.
- Eliminación de productos.
- Restauración del catálogo inicial.
- Normalización de stock.
- Respeto de stock igual a cero.
- Conversión de valores válidos de stock.
- Verificación de disponibilidad.
- Descuento de stock al confirmar una compra.
- Reposición de stock al cancelar una orden.
- Sincronización entre pestañas.

---

# Carrito de compras

El carrito utiliza React Context como fuente central de estado.

Se implementaron:

- `CartContext`.
- `CartProvider`.
- Hook `useCart`.

Funcionalidades:

- Agregar productos.
- Agregar cantidades específicas.
- Acumular cantidades cuando se agrega el mismo producto.
- Aumentar y disminuir cantidades.
- Evitar cantidades inferiores a 1.
- Respetar el stock máximo.
- Bloquear productos agotados.
- Eliminar productos.
- Vaciar carrito.
- Calcular cantidad total de productos.
- Calcular subtotal.
- Contador dinámico en el Header.
- Persistencia mediante LocalStorage.
- Carrito independiente para invitado y usuarios autenticados.
- Fusión del carrito de invitado al iniciar sesión.
- Sincronización del carrito con cambios de stock, precio o eliminación de productos.

Persistencia utilizada:

```text
recta_carrito_invitado
recta_carrito_<usuarioId>
```

---

# Usuarios y autenticación

La autenticación está centralizada mediante React Context.

Se implementaron:

- `AuthContext`.
- `AuthProvider`.
- Hook `useAuth`.

Funcionalidades:

- Registro de clientes.
- Inicio de sesión.
- Cierre de sesión.
- Persistencia de sesión.
- Recuperación y cambio de contraseña.
- Normalización de correo.
- Normalización de RUT.
- Validación de correo duplicado.
- Validación de RUT duplicado.
- Validación de contraseña.
- Edición de perfil.
- Roles de cliente y administrador.
- Protección de rutas administrativas.

Los usuarios creados desde el registro público reciben automáticamente:

```text
rol: cliente
```

No es posible asignarse permisos administrativos desde el formulario público.

---

# Usuario administrador de prueba

El proyecto incorpora un usuario administrador inicial con fines académicos y de demostración:

```text
Correo: admin@duoc.cl
Contraseña: Admin123!
```

Estas credenciales son exclusivamente de demostración dentro de la simulación frontend.

La autenticación actual utiliza LocalStorage y **no corresponde a un sistema seguro para producción**.

---

# Perfil de usuario

Los usuarios autenticados pueden:

- Visualizar información personal.
- Editar nombre y apellido.
- Editar fecha de nacimiento.
- Editar teléfono.
- Editar dirección.
- Actualizar región y comuna.
- Persistir cambios.
- Mantener sincronizados los datos de sesión.
- Consultar su historial de compras.
- Revisar el detalle de sus boletas.

El correo y el RUT se mantienen como identificadores no editables desde el perfil.

---

# Checkout

El proyecto incorpora un checkout funcional para cliente registrado o invitado.

Permite ingresar o reutilizar:

- Nombre.
- Apellido.
- Correo.
- Teléfono.
- Dirección.
- Región.
- Comuna.
- Método de pago simulado.

También muestra:

- Resumen del pedido.
- Cantidad total de productos.
- Total de la compra.

Antes de completar una compra se valida:

1. Información requerida del formulario.
2. Disponibilidad real del stock.
3. Confirmación del usuario.

El flujo principal es:

```text
Catálogo
   ↓
Detalle de producto
   ↓
Carrito
   ↓
Aceptar términos
   ↓
Checkout
   ↓
Validar datos y stock
   ↓
Guardar compra
   ↓
Descontar stock
   ↓
Vaciar carrito
   ↓
Compra exitosa
```

---

# Métodos de pago y despacho

Los métodos de pago son simulados:

- Transferencia bancaria.
- Tarjeta bancaria simulada.

No se realizan cargos reales ni se almacenan datos bancarios reales.

El costo y modalidad de despacho no se calculan automáticamente en esta versión. El despacho se coordina posteriormente utilizando los datos registrados por el comprador.

---

# Compras y boletas

Las compras se gestionan mediante:

```text
src/services/compraService.js
```

Cada compra recibe un identificador similar a:

```text
RB-<timestamp>-<uuid-corto>
```

El servicio permite:

- Guardar compras.
- Mantener compras anteriores.
- Buscar por identificador.
- Recuperarse frente a datos inválidos en LocalStorage.
- Actualizar estados de orden bajo reglas controladas.
- Archivar órdenes finalizadas.

Los clientes autenticados pueden consultar su historial y abrir sus boletas.

La ruta de compra exitosa se protege para evitar mostrar una compra arbitraria al ingresar directamente a la URL.

---

# Estados de las órdenes

Estados disponibles:

```text
confirmada
en preparación
enviada
entregada
cancelada
```

Transiciones permitidas:

```text
confirmada
├── en preparación
└── cancelada

en preparación
├── enviada
└── cancelada

enviada
└── entregada

entregada
└── estado final

cancelada
└── confirmada
```

Reglas importantes:

- Una orden entregada no puede cancelarse.
- Una orden cancelada solo puede reactivarse como confirmada.
- Reactivar una orden exige stock suficiente.
- Cancelar una orden repone el stock.
- Reactivar una orden vuelve a descontar el stock.
- Las órdenes archivadas quedan en modo solo lectura.

---

# Panel de administración

Las rutas administrativas están protegidas mediante `RutaAdmin`.

El administrador dispone de:

## Productos

- Listado de productos.
- Creación.
- Edición.
- Eliminación.
- Restauración del catálogo inicial.
- Gestión de precio, precio de oferta y stock.

## Usuarios

- Listado de usuarios.
- Edición de datos.
- Cambio de rol cliente/administrador.
- Eliminación de usuarios.
- Consulta del historial de compras de cada usuario.

> La versión actual no incorpora una ruta independiente para crear usuarios desde el panel de administración. Los clientes se crean mediante el registro público.

## Órdenes

- Listado de compras activas.
- Consulta de boletas.
- Actualización controlada de estados.
- Cancelación y reactivación con sincronización de stock.
- Visualización de historial por usuario.

## Reportes

- Ventas totales del período.
- Cantidad de órdenes válidas.
- Unidades vendidas.
- Ticket promedio.
- Producto más vendido.
- Ranking de productos.
- Distribución de órdenes por estado.
- Impresión o guardado como PDF mediante el diálogo del navegador.
- Cierre de período.

El cierre de período solo archiva órdenes finalizadas:

```text
entregada  → archivar
cancelada  → archivar
```

Las órdenes todavía en proceso permanecen activas:

```text
confirmada
en preparación
enviada
```

---

# Contacto

El proyecto incorpora un formulario de contacto con:

- Nombre.
- Correo.
- Asunto.
- Mensaje.
- Campos controlados.
- Validaciones HTML.
- Confirmación de envío simulado.
- Limpieza de campos.

No existe un backend que envíe correos reales.

---

# Blog y páginas informativas

La aplicación incluye:

- Blog.
- Quiénes Somos.
- Impacto Ambiental.
- Contacto.
- Términos de Compra.
- Términos de Registro.

Los artículos individuales del Blog no están implementados en esta etapa.

---

# Diseño responsive

El proyecto utiliza Bootstrap y CSS propio para adaptarse a:

```text
Escritorio
Tablet
Dispositivo móvil
```

Se utilizan, entre otros:

- Grid system.
- Containers.
- Breakpoints.
- Flexbox.
- Navbar.
- Offcanvas.
- Cards.
- Formularios.
- Buttons.
- Alerts.
- Badges.
- Utilities de spacing y display.

---

# Arquitectura del proyecto

Estructura principal:

```text
src/
├── components/
│   ├── admin/
│   ├── products/
│   ├── ActualizarTop.jsx
│   ├── Boleta.jsx
│   ├── ConfirmarCompraModal.jsx
│   ├── ContadorCarrito.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Layout.jsx
│   ├── RutaAdmin.jsx
│   └── ...
│
├── context/
│   ├── AuthContext.js
│   ├── AuthProvider.jsx
│   ├── CartContext.js
│   ├── CartProvider.jsx
│   ├── ProductContext.js
│   └── ProductProvider.jsx
│
├── data/
│   ├── productos.js
│   ├── regionesComunas.js
│   └── usuariosIniciales.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useProducts.js
│   └── useTitulo.js
│
├── pages/
│   ├── admin/
│   ├── Blog.jsx
│   ├── Carrito.jsx
│   ├── Catalogo.jsx
│   ├── Checkout.jsx
│   ├── CompraError.jsx
│   ├── CompraExitosa.jsx
│   ├── Contacto.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── MiBoleta.jsx
│   ├── Ofertas.jsx
│   ├── Perfil.jsx
│   ├── ProductoDetalle.jsx
│   ├── Registro.jsx
│   └── ...
│
├── services/
│   └── compraService.js
│
├── tests/
│   └── *.spec.js
│
├── utils/
│   ├── carrito.js
│   ├── estadisticas.js
│   ├── stock.js
│   └── validaciones.js
│
├── App.jsx
├── index.css
└── main.jsx
```

La jerarquía global de Providers es:

```text
AuthProvider
   ↓
ProductProvider
   ↓
CartProvider
   ↓
App
```

---

# Persistencia simulada

Mientras el proyecto no dispone de backend se utiliza LocalStorage.

Principales claves:

```text
recta_usuarios
recta_usuario_actual
recta_productos
recta_compras
recta_carrito_invitado
recta_carrito_<usuarioId>
```

Esta implementación existe exclusivamente con fines académicos y de simulación frontend.

No debe considerarse un sistema seguro de almacenamiento, autenticación o persistencia para producción.

---

# Testing con Vitest

La suite de pruebas utiliza:

- Vitest 5.
- jsdom como entorno DOM.
- `vi.fn()` y `vi.spyOn()` para mocks y spies.
- V8 como proveedor de cobertura.

Configuración principal:

```text
vitest.config.js
```

Los archivos de pruebas se encuentran en:

```text
src/tests/**/*.spec.js
```

## Resultado actual

```text
Test Files  16 passed (16)
Tests       210 passed (210)
Failed      0
```

---

# Distribución actual de pruebas

```text
AuthProvider.spec.js               14
CantidadSelector.spec.js            6
CantidadSelectorTeclado.spec.js     7
CartProvider.spec.js                10
ConfirmarCompraModal.spec.js        15
Estadisticas.spec.js                14
ProductFilter.spec.js                3
ProductProvider.spec.js             25
RutaAdmin.spec.js                    7
Validaciones.spec.js                14
carritoSincronizacion.spec.js       16
carritoStockYFusion.spec.js         18
compraService.spec.js               14
compraServiceEstados.spec.js        19
productosCrud.spec.js               23
stock.spec.js                        5
──────────────────────────────────────
TOTAL                              210
```

---

# Áreas cubiertas por las pruebas

La suite prioriza lógica y comportamiento crítico:

- Autenticación.
- Registro y recuperación de contraseña.
- Roles y acceso administrativo.
- Actualización de perfil.
- ProductProvider.
- CRUD de productos.
- Persistencia y sincronización de productos.
- Stock.
- Carrito.
- Fusión y sincronización del carrito.
- Servicio de compras.
- Estados y transiciones de órdenes.
- Archivado y cierre de período.
- Estadísticas y reportes.
- Validaciones.
- Selectores de cantidad.
- Interacción por teclado.
- ProductFilter.
- Modal de confirmación de compra.
- Protección de rutas administrativas.
- LocalStorage.
- Componentes DOM seleccionados.

---

# Mocks y spies

Vitest permite simular funciones y observar llamadas mediante:

```js
vi.fn()
```

 y:

```js
vi.spyOn()
```

Esto permite probar componentes, callbacks y dependencias de forma aislada sin ejecutar toda la aplicación.

---

# Cobertura

La cobertura se ejecuta mediante:

```bash
npm run test:coverage
```

Configuración:

```text
Provider: V8
Entorno: jsdom
Scope: src/**/*.{js,jsx}
Exclusión: src/tests/**
```

Resultado actual:

```text
Statements   : 46.20% (523/1132)
Branches     : 40.98% (366/893)
Functions    : 44.80% (151/337)
Lines        : 46.49% (518/1114)
```

Estos porcentajes corresponden al **frontend completo incluido en `src`**, no únicamente a los módulos importados directamente por las pruebas.

Por esa razón también entran en el cálculo páginas y componentes principalmente visuales que no cuentan con pruebas unitarias directas.

La estrategia de testing prioriza reglas de negocio y zonas críticas antes que pruebas superficiales de vistas estáticas.

---

# Reporte HTML de cobertura

Al ejecutar:

```bash
npm run test:coverage
```

se genera la carpeta:

```text
coverage/
```

El reporte HTML puede abrirse desde:

```text
coverage/index.html
```

La carpeta `coverage/` es generada automáticamente y no debe almacenarse en Git.

---

# Requisitos

Para ejecutar el proyecto se necesita:

- Node.js compatible con Vite/Vitest utilizados por el proyecto.
- npm.
- Git.

Comprobar versiones:

```bash
node -v
npm -v
git --version
```

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

## 2. Ingresar al proyecto

```bash
cd Rectabagsweb-React
```

## 3. Instalar dependencias

Recomendado:

```bash
npm ci
```

Alternativamente:

```bash
npm install
```

`npm ci` utiliza las versiones registradas en `package-lock.json`, lo que permite mantener entornos consistentes entre integrantes del equipo.

---

# Comandos disponibles

## Desarrollo

```bash
npm run dev
```

Vite mostrará una URL local similar a:

```text
http://localhost:5173
```

## ESLint

```bash
npm run lint
```

## Pruebas unitarias

```bash
npm test
```

Resultado de referencia:

```text
16 archivos de pruebas
210 pruebas
210 exitosas
0 fallidas
```

## Watch mode

```bash
npm run test:watch
```

Vitest vuelve a ejecutar las pruebas cuando detecta cambios.

Para detenerlo:

```text
Ctrl + C
```

## Cobertura

```bash
npm run test:coverage
```

## Build de producción

```bash
npm run build
```

Los archivos generados quedan en:

```text
dist/
```

## Vista previa del build

```bash
npm run preview
```

---

# Validación recomendada antes de integrar cambios

Ejecutar:

```bash
npm run lint
npm test
npm run test:coverage
npm run build
```

Baseline técnico actual:

```text
ESLint                       ✅
Vitest                       ✅
16/16 archivos de pruebas    ✅
210/210 pruebas              ✅
Cobertura V8                 ✅
Build Vite                   ✅
```

---

# Archivos generados que no deben subirse

```text
node_modules/
dist/
coverage/
.vitest/
```

Estos directorios deben mantenerse excluidos mediante `.gitignore`.

---

# Flujo recomendado de Git

Antes de trabajar:

```bash
git pull
npm ci
```

Después de realizar modificaciones:

```bash
npm run lint
npm test
npm run build
```

Luego:

```bash
git status
git add .
git commit
git push
```

La integración entre ramas debe realizarse mediante Pull Request.

---

# Buenas prácticas aplicadas

- Componentes reutilizables.
- Separación de responsabilidades.
- Hooks personalizados.
- React Context.
- Props.
- Estado local y global.
- Formularios controlados.
- Rutas dinámicas.
- Protección por rol.
- Persistencia simulada.
- Servicios y utilidades.
- Validaciones centralizadas.
- Manejo de errores.
- Sincronización con LocalStorage.
- Diseño responsive.
- ESLint.
- Pruebas unitarias.
- Mocks y spies.
- Cobertura de código.
- Git y Pull Requests.

---

# Alcance y limitaciones actuales

La versión actual es una aplicación frontend académica. No incorpora:

- Backend real.
- Base de datos real.
- API REST propia.
- Autenticación segura del lado servidor.
- Procesamiento real de pagos.
- Envío real de correos.
- Cálculo automático de despacho.
- Creación de usuarios desde una ruta administrativa independiente.
- Vista independiente exclusiva de categorías.
- Artículos individuales completos del Blog.

Estas limitaciones no impiden el funcionamiento del flujo principal implementado en esta etapa.

---

# Mejoras futuras posibles

- Backend y API REST.
- Base de datos persistente.
- Autenticación segura y autorización en servidor.
- Integración con pasarelas de pago reales.
- Cálculo automático de despacho.
- Cobertura nacional completa de regiones y comunas.
- Vista independiente de categorías.
- Creación administrativa de usuarios.
- Artículos individuales del Blog.
- Mayor cobertura automatizada de páginas y flujos completos.

---

# Documentación de la evaluación

La entrega contempla además del código fuente:

- ERS actualizado.
- Documento de cobertura de testing.
- Planilla de requerimientos.
- Proyecto comprimido.
- Repositorio GitHub público.
- Presentación individual.

---

# Estado actual del proyecto

```text
FRONTEND
────────────────────────────────────────
React / Vite                       ✅
React Router                       ✅
Componentes reutilizables          ✅
Bootstrap responsive               ✅
Catálogo                           ✅
Filtros y búsqueda                 ✅
Ofertas                            ✅
Detalle de producto                ✅
Galería                            ✅
Stock                              ✅
Carrito                            ✅
Carrito por usuario                ✅
Fusión invitado/usuario            ✅
Registro                           ✅
Login / Logout                     ✅
Recuperación contraseña            ✅
Roles                              ✅
Perfil                             ✅
Checkout                           ✅
Compra invitado                    ✅
Compra autenticado                 ✅
Historial de compras               ✅
Boletas                            ✅
Persistencia de compras            ✅
Contacto                           ✅
Páginas informativas               ✅

ADMINISTRACIÓN
────────────────────────────────────────
Protección de rutas                ✅
Panel administrativo               ✅
CRUD de productos                  ✅
Gestión de usuarios                ✅
Gestión de órdenes                 ✅
Transiciones controladas           ✅
Cancelación / reactivación stock   ✅
Reportes y estadísticas            ✅
Cierre de período                  ✅
Órdenes archivadas solo lectura    ✅

TESTING
────────────────────────────────────────
Vitest                             ✅
jsdom                              ✅
V8 Coverage                        ✅
Mocks / Spies                      ✅
Pruebas DOM                        ✅
Pruebas Context                    ✅
Pruebas LocalStorage               ✅
16 archivos de pruebas             ✅
210 pruebas                        ✅
210/210 SUCCESS                    ✅

COVERAGE
────────────────────────────────────────
Statements                        46.20%
Branches                          40.98%
Functions                         44.80%
Lines                             46.49%
```

---

# Integrantes

Proyecto desarrollado por un equipo de 3 estudiantes.

- Integrante 1: `Marco Carrasco Zabalaga`
- Integrante 2: `Acxel Gonzalez Osorio `
- Integrante 3: `Fabian Cornejo Morales`

Asignatura:

**DSY1104 - Desarrollo Fullstack II**

---

# Repositorio

Repositorio público del proyecto:

```text
https://github.com/AcxelGonzalez/Rectabagsweb-React.git
```

---

# Estado académico

RectaBags se encuentra en etapa de cierre de la **Evaluación Parcial N°2 de DSY1104 - Desarrollo Fullstack II**.

La versión actual dispone de un frontend funcional basado en React y Vite, persistencia simulada mediante LocalStorage, flujos de cliente y administración, y una suite automatizada de pruebas con Vitest.

Baseline actual:

```text
16 archivos de pruebas
210 pruebas unitarias
210 pruebas exitosas
0 pruebas fallidas
```

La cobertura se obtiene mediante V8 sobre el conjunto completo de archivos JavaScript y JSX de `src`.

Las actividades restantes corresponden principalmente al cierre y sincronización de la documentación académica y a la preparación de la entrega final.
