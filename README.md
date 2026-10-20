# RectaBags - Frontend React

Proyecto frontend desarrollado para la tienda online **RectaBags**, emprendimiento orientado a la fabricación de mochilas rolltop y equipamiento de bikepacking.

El proyecto corresponde a la asignatura **DSY1104 - Desarrollo Fullstack II** y representa la migración y ampliación de una versión inicial desarrollada con HTML, CSS, JavaScript y Bootstrap hacia una arquitectura moderna basada en **React**.

---

## Descripción del proyecto

RectaBags es una tienda online enfocada en productos para ciclismo, bikepacking y uso urbano.

Durante esta etapa del proyecto se migró el frontend original hacia React, incorporando componentes reutilizables, manejo de estado, navegación dinámica, persistencia simulada mediante LocalStorage, autenticación de usuarios, carrito de compras y flujo de checkout.

El proyecto continúa en desarrollo y posteriormente incorporará administración de productos y usuarios, ofertas y pruebas unitarias mediante Jasmine y Karma.

---

## Tecnologías utilizadas

- React 19
- Vite 8
- React Router DOM
- Bootstrap 5
- JavaScript
- HTML5
- CSS3
- ESLint
- LocalStorage

---

## Funcionalidades implementadas

Actualmente el proyecto incorpora las siguientes funcionalidades:

### Navegación

- Navegación mediante React Router.
- Layout reutilizable.
- Header y Footer compartidos.
- Menú lateral responsive.
- Navegación para visitantes y usuarios autenticados.
- Redirecciones mediante React Router.
- Manejo de rutas inexistentes.
- Actualización automática del scroll al cambiar de página.

### Página principal

- Página Home responsive.
- Secciones informativas.
- Acceso al catálogo.
- Sección de redes sociales reutilizable.
- Enlaces hacia páginas internas del proyecto.

### Catálogo

- Catálogo dinámico de productos.
- Información centralizada en JavaScript.
- 9 productos actualmente disponibles.
- Filtros por categoría.
- Búsqueda de productos.
- Búsqueda desde el Header.
- Parámetros de búsqueda mediante URL.
- Mensaje cuando no existen resultados.

### Categorías actuales

- Mochilas.
- Cilindros.
- Musette.
- Otros.

### Detalle de productos

- Ruta dinámica por identificador.
- Galería de imágenes.
- Cambio de imagen principal.
- Selector de cantidad.
- Control de stock.
- Manejo de productos agotados.
- Precio.
- Medidas.
- Valoración.
- Opiniones.
- Título dinámico en la pestaña del navegador.
- Manejo de productos inexistentes.

### Carrito de compras

- Estado global mediante React Context.
- `CartContext`.
- `CartProvider`.
- Hook personalizado `useCart`.
- Agregar productos.
- Acumular cantidades del mismo producto.
- Aumentar cantidades.
- Disminuir cantidades.
- Eliminar productos.
- Vaciar carrito.
- Control de stock máximo.
- Contador dinámico en el Header.
- Cálculo de total de productos.
- Persistencia mediante LocalStorage.
- Persistencia después de actualizar la página.

### Usuarios y autenticación

- `AuthContext`.
- `AuthProvider`.
- Hook personalizado `useAuth`.
- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Persistencia de sesión.
- Recuperación de contraseña.
- Validación de correo duplicado.
- Validación de RUT duplicado.
- Validación de contraseñas.
- Roles de usuario.
- Rol cliente.
- Rol administrador.
- Usuario administrador inicial.
- Header dinámico según estado de autenticación.

### Perfil

- Página protegida para usuarios autenticados.
- Visualización de información personal.
- Edición de nombre.
- Edición de apellido.
- Edición de fecha de nacimiento.
- Edición de teléfono.
- Edición de dirección.
- Persistencia de cambios.
- Actualización inmediata de la sesión.
- Correo y RUT protegidos como datos no editables.
- Identificación visual del rol del usuario.

### Checkout

- Checkout funcional.
- Compra como usuario registrado.
- Compra como invitado.
- Autocompletado de datos desde el perfil.
- Datos del comprador.
- Dirección de despacho.
- Región.
- Comuna.
- Selección de método de pago simulado.
- Resumen del pedido.
- Total de productos.
- Registro simulado de compras.
- Identificador único de compra.
- Persistencia mediante LocalStorage.
- Vaciado automático del carrito después de comprar.

### Compra exitosa y error

- Página de compra exitosa.
- Identificador de compra.
- Cantidad total de productos.
- Total de productos.
- Información sobre coordinación de despacho.
- Protección contra acceso directo sin una compra válida.
- Página de error de compra.

### Contacto

- Formulario controlado mediante React.
- Nombre.
- Correo electrónico.
- Asunto.
- Mensaje.
- Validaciones HTML.
- Feedback visual.
- Limpieza del formulario después del envío.
- Simulación frontend del envío de consultas.

### Páginas informativas

- Blog.
- Quiénes Somos.
- Impacto Ambiental.
- Términos de Compra.
- Términos de Registro.
- Contacto.

---

## Arquitectura del proyecto

La aplicación se encuentra organizada utilizando separación de responsabilidades.

```text
src/
├── components/
│   ├── products/
│   │   ├── CantidadSelector.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductFilter.jsx
│   │   ├── ProductGallery.jsx
│   │   └── ProductReviews.jsx
│   │
│   ├── ContadorCarrito.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Layout.jsx
│   ├── PaginaTerminos.jsx
│   ├── SeccionRedes.jsx
│   └── ...
│
├── context/
│   ├── AuthContext.js
│   ├── AuthProvider.jsx
│   ├── CartContext.js
│   └── CartProvider.jsx
│
├── css/
│   ├── style_catalogo.css
│   ├── style_header_footer.css
│   ├── style_home.css
│   ├── style_login.css
│   ├── style_producto_detalle.css
│   └── ...
│
├── data/
│   ├── productos.js
│   └── usuariosIniciales.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   └── useTitulo.js
│
├── pages/
│   ├── Blog.jsx
│   ├── Carrito.jsx
│   ├── Catalogo.jsx
│   ├── Checkout.jsx
│   ├── CompraError.jsx
│   ├── CompraExitosa.jsx
│   ├── Contacto.jsx
│   ├── Home.jsx
│   ├── ImpactoAmbiental.jsx
│   ├── Login.jsx
│   ├── Perfil.jsx
│   ├── ProductoDetalle.jsx
│   ├── QuienesSomos.jsx
│   ├── RecuperarContrasena.jsx
│   ├── Registro.jsx
│   ├── TerminosCompra.jsx
│   ├── TerminosRegistro.jsx
│   └── ...
│
├── services/
│   └── compraService.js
│
├── utils/
│   └── stock.js
│
├── App.jsx
├── index.css
└── main.jsx
```

---

## React Context

El proyecto utiliza React Context para centralizar estados globales.

### CartProvider

Administra:

- Productos agregados al carrito.
- Cantidades.
- Eliminación.
- Stock.
- Total de productos.
- Subtotal.
- Persistencia del carrito.

Los componentes consumen esta información mediante:

```js
useCart()
```

### AuthProvider

Administra:

- Usuarios registrados.
- Usuario autenticado.
- Registro.
- Inicio de sesión.
- Cierre de sesión.
- Recuperación de contraseña.
- Actualización del perfil.
- Roles.
- Persistencia de sesión.

Los componentes consumen esta información mediante:

```js
useAuth()
```

---

## Persistencia simulada

Mientras el proyecto no dispone de un backend, se utiliza **LocalStorage** para simular persistencia de información.

Actualmente se almacenan datos como:

```text
recta_carrito_invitado
recta_usuarios
recta_usuario_actual
recta_compras
```

Esta implementación corresponde únicamente a una simulación frontend con fines académicos.

No debe considerarse un sistema seguro de autenticación o almacenamiento para un entorno real de producción.

---

## Usuario administrador de prueba

El proyecto incorpora un usuario administrador inicial para permitir futuras pruebas del módulo administrativo.

```text
Correo:
admin@rectabags.cl

Contraseña:
Admin123!
```

Este usuario existe exclusivamente para fines académicos y de demostración.

Los usuarios que se registran mediante la página pública reciben automáticamente:

```text
rol: cliente
```

y no pueden asignarse privilegios administrativos desde el formulario de registro.

---

## Requisitos

Para ejecutar el proyecto se necesita:

- Node.js en una versión reciente compatible con el proyecto.
- npm.

Puedes comprobar las versiones instaladas con:

```bash
node -v
npm -v
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

### 2. Ingresar al proyecto

```bash
cd Rectabagsweb-React
```

### 3. Instalar las dependencias

Se recomienda utilizar:

```bash
npm ci
```

También es posible utilizar:

```bash
npm install
```

`npm ci` utiliza las versiones registradas en `package-lock.json`, por lo que resulta especialmente útil para mantener un entorno consistente entre los distintos integrantes del equipo.

---

## Ejecutar el proyecto

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará una dirección local similar a:

```text
http://localhost:5173
```

Abre esa dirección en el navegador.

---

## Validación del código

El proyecto utiliza ESLint.

Para revisar el código:

```bash
npm run lint
```

Antes de realizar un Pull Request o una entrega se recomienda comprobar que el comando termine sin errores.

---

## Compilar el proyecto

Para generar una versión de producción:

```bash
npm run build
```

Los archivos compilados serán generados dentro de:

```text
dist/
```

La carpeta `dist` es generada automáticamente y no debe almacenarse en el repositorio.

---

## Vista previa de producción

Después de ejecutar:

```bash
npm run build
```

se puede revisar la versión compilada mediante:

```bash
npm run preview
```

---

## Trabajo entre Windows y Linux

El proyecto está preparado para ser desarrollado desde distintos sistemas operativos.

Cada desarrollador debe instalar sus propias dependencias localmente.

La carpeta:

```text
node_modules/
```

no debe almacenarse en Git.

Los archivos que sí deben mantenerse en el repositorio son:

```text
package.json
package-lock.json
```

Después de obtener nuevos cambios desde Git se recomienda ejecutar:

```bash
npm ci
```

especialmente si las dependencias del proyecto fueron modificadas.

---

## Flujo recomendado de Git

Antes de comenzar a trabajar:

```bash
git pull
npm ci
```

Antes de subir cambios:

```bash
npm run lint
npm run build
```

Después:

```bash
git status
git add .
git commit
git push
```

Cada integrante debe desarrollar en su rama correspondiente y posteriormente integrar los cambios mediante Pull Request.

---

## Carrito de compras

El carrito utiliza una arquitectura centralizada:

```text
                   CartProvider
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
ProductoDetalle      Carrito     ContadorCarrito
```

Esto permite mantener una única fuente de estado y evitar accesos repetidos a LocalStorage desde diferentes componentes.

---

## Autenticación

La autenticación simulada funciona mediante:

```text
                 AuthProvider
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
   Registro         Login          Perfil
       │              │              │
       └──────────────┼──────────────┘
                      ↓
                  LocalStorage
```

El sistema permite diferenciar:

```text
Visitante
Cliente
Administrador
```

---

## Flujo de compra

El flujo implementado actualmente es:

```text
Catálogo
   ↓
Producto
   ↓
Carrito
   ↓
Aceptar términos
   ↓
Checkout
   ↓
Confirmar compra
   ↓
Guardar compra
   ↓
Vaciar carrito
   ↓
Compra exitosa
```

Los usuarios autenticados reciben sus datos automáticamente desde el perfil.

Los visitantes pueden realizar una compra ingresando manualmente sus datos.

---

## Métodos de pago

Actualmente el checkout contiene métodos de pago simulados:

- Transferencia bancaria.
- Tarjeta bancaria simulada.

No se realizan cargos reales ni se almacenan datos bancarios del usuario.

---

## Despacho

El precio mostrado durante el carrito y checkout corresponde únicamente al total de los productos.

El costo de despacho no se calcula automáticamente en esta versión.

El despacho deberá coordinarse posteriormente utilizando la información ingresada por el comprador.

---

## Diseño responsive

El proyecto utiliza Bootstrap para adaptar las vistas a distintos tamaños de pantalla.

Se utilizan, entre otros:

- Grid system.
- Containers.
- Breakpoints.
- Flexbox.
- Formularios responsive.
- Navbar y Offcanvas.
- Cards.
- Buttons.
- Alerts.
- Badges.
- Utilities de spacing.
- Utilities de display.

La aplicación está diseñada para funcionar en dispositivos de escritorio, tablets y dispositivos móviles.

---

## Funcionalidades pendientes

Las siguientes funcionalidades todavía se encuentran pendientes de desarrollo:

- Vista de ofertas.
- Administración de productos.
- CRUD de productos.
- Administración de usuarios.
- CRUD de usuarios.
- Protección de rutas administrativas.
- Pruebas unitarias con Jasmine.
- Configuración de Karma.
- Al menos 10 pruebas unitarias.
- Uso de mocks.
- Análisis de cobertura.
- Documento de cobertura de testing.
- Actualización final del documento ERS.

---

## Testing

La evaluación requiere la implementación de pruebas unitarias frontend utilizando **Jasmine y Karma**.

Esta etapa aún se encuentra pendiente.

El objetivo será desarrollar al menos 10 pruebas que validen diferentes comportamientos del proyecto.

Entre los posibles casos de prueba se encuentran:

1. Renderizado de productos.
2. Visualización del nombre de un producto.
3. Visualización del precio de un producto.
4. Filtrado por categoría.
5. Búsqueda de productos.
6. Producto inexistente.
7. Agregar productos al carrito.
8. Modificar cantidades del carrito.
9. Eliminar productos del carrito.
10. Calcular subtotal.
11. Registro con correo duplicado.
12. Inicio de sesión inválido.
13. Recuperación de contraseña.
14. Validaciones del checkout.
15. Persistencia simulada.

La selección final se definirá durante la etapa de testing.

---

## Documentación pendiente para la evaluación

Además del código fuente actualizado, la evaluación requiere:

- Repositorio GitHub público.
- Proyecto frontend comprimido.
- Documento ERS actualizado.
- Documento de cobertura de testing.

---

## Buenas prácticas aplicadas

Durante el desarrollo se han aplicado prácticas como:

- Componentes reutilizables.
- Separación de responsabilidades.
- Hooks personalizados.
- Estado global mediante Context.
- Rutas dinámicas.
- Formularios controlados.
- Validaciones.
- Persistencia centralizada.
- Uso de servicios.
- Uso de utilidades.
- Diseño responsive.
- Control de versiones mediante Git.
- Trabajo colaborativo mediante ramas y Pull Requests.

---

## Integrantes

Proyecto desarrollado por un equipo de 3 estudiantes.

- Integrante 1: `MARCO ANTONIO CARRASCO ZABALAGA`
- Integrante 2: `FABIAN ALEJANDRO CORNEJO MORALES`
- Integrante 3: `ACXEL ANDRES GONZALEZ OSORIO`

Asignatura:

**DSY1104 - Desarrollo Fullstack II**

---

## Repositorio

Repositorio público del proyecto:

```text
https://github.com/AcxelGonzalez/Rectabagsweb-React.git
```

---

## Estado actual del proyecto

Actualmente se encuentran completados los principales módulos públicos de la tienda:

```text
React / Vite                  ✅
React Router                  ✅
Componentes reutilizables     ✅
Bootstrap responsive          ✅
Catálogo                      ✅
Búsqueda                      ✅
Detalle de productos          ✅
Stock                         ✅
Carrito                       ✅
Persistencia carrito          ✅
Registro                      ✅
Login                         ✅
Logout                        ✅
Recuperar contraseña          ✅
Roles                         ✅
Perfil                        ✅
Checkout                      ✅
Compra exitosa/error          ✅
Persistencia de compras       ✅
Contacto                      ✅

Ofertas                       ⏳
Administración                ⏳
CRUD                          ⏳
Jasmine + Karma               ⏳
Testing                       ⏳
Cobertura                     ⏳
Documentación final           ⏳
```

---

## Estado académico

El proyecto se encuentra actualmente en desarrollo para la **Evaluación Parcial N°2 de DSY1104 - Desarrollo Fullstack II**.

La siguiente etapa de desarrollo se concentrará en completar las funcionalidades administrativas y posteriormente implementar el proceso de pruebas unitarias requerido para la evaluación.