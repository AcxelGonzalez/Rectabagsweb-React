# RectaBags - Frontend React

Proyecto frontend desarrollado para la tienda online **RectaBags**, emprendimiento orientado a la fabricación de mochilas rolltop y equipamiento de bikepacking.

El proyecto corresponde a la asignatura **DSY1104 - Desarrollo Fullstack II** y representa la migración y ampliación de una versión inicial desarrollada con HTML, CSS, JavaScript y Bootstrap hacia una arquitectura moderna basada en **React**.

---

## Descripción del proyecto

RectaBags es una tienda online orientada a productos para ciclismo, bikepacking y uso urbano.

Durante esta etapa del proyecto se migró el frontend original hacia React, incorporando componentes reutilizables, navegación dinámica, estados locales y globales, persistencia simulada mediante LocalStorage, autenticación de usuarios, carrito de compras, perfil, checkout y pruebas unitarias.

El proyecto utiliza React Context para centralizar funcionalidades globales como autenticación y carrito de compras.

Además, se implementó un entorno de testing utilizando **Jasmine y Karma**, permitiendo ejecutar pruebas automáticamente en ChromeHeadless y generar análisis de cobertura mediante Istanbul.

---

# Tecnologías utilizadas

- React 19
- Vite 8
- React Router DOM
- Bootstrap 5
- JavaScript
- HTML5
- CSS3
- ESLint
- LocalStorage
- Jasmine
- Karma
- ChromeHeadless
- Puppeteer
- esbuild
- Babel
- Istanbul

---

# Funcionalidades implementadas

Actualmente el proyecto incorpora las siguientes funcionalidades.

## Navegación

- Navegación mediante React Router.
- Layout reutilizable.
- Header compartido.
- Footer compartido.
- Menú lateral responsive.
- Navegación para visitantes.
- Navegación para usuarios autenticados.
- Navegación diferenciada según rol.
- Rutas dinámicas.
- Redirecciones mediante React Router.
- Manejo de rutas inexistentes.
- Actualización automática del scroll al cambiar de página.
- Títulos dinámicos en diferentes vistas.

---

## Página principal

- Página Home responsive.
- Hero principal.
- Secciones informativas.
- Acceso al catálogo.
- Secciones reutilizables.
- Integración con redes sociales.
- Enlaces hacia distintas páginas internas.

---

# Catálogo

El catálogo utiliza información centralizada mediante JavaScript.

Funcionalidades actuales:

- Catálogo dinámico de productos.
- Renderizado mediante componentes React.
- Tarjetas reutilizables.
- Filtros por categoría.
- Búsqueda de productos.
- Búsqueda desde el Header.
- Parámetros de búsqueda mediante URL.
- Combinación entre categoría y búsqueda.
- Mensaje cuando no existen resultados.
- Navegación al detalle de cada producto.

Actualmente el catálogo contiene diferentes productos relacionados con bikepacking y ciclismo.

---

## Categorías

Entre las categorías utilizadas en el catálogo se encuentran:

- Mochilas.
- Cilindros.
- Musette.
- Otros productos.

---

# Detalle de productos

Cada producto dispone de una vista dinámica utilizando su identificador.

Funcionalidades:

- Ruta dinámica por producto.
- Galería de imágenes.
- Cambio de imagen principal.
- Selector de cantidades.
- Manejo de stock.
- Control de cantidad máxima.
- Manejo de productos agotados.
- Precio del producto.
- Información adicional.
- Medidas.
- Valoración.
- Opiniones.
- Botón para agregar al carrito.
- Título dinámico en la pestaña del navegador.
- Manejo de productos inexistentes.

---

# Carrito de compras

El carrito utiliza React Context como fuente central de estado.

Se implementaron:

- `CartContext`.
- `CartProvider`.
- Hook personalizado `useCart`.

Funcionalidades:

- Agregar productos.
- Agregar diferentes cantidades.
- Acumular cantidades cuando se agrega nuevamente el mismo producto.
- Aumentar cantidades.
- Disminuir cantidades.
- Evitar cantidades inferiores a 1.
- Limitar cantidades al stock disponible.
- Bloquear productos sin stock.
- Eliminar productos.
- Vaciar completamente el carrito.
- Calcular cantidad total de productos.
- Calcular total de productos.
- Contador dinámico en el Header.
- Persistencia mediante LocalStorage.
- Recuperación del carrito al actualizar el navegador.

---

## Arquitectura del carrito

```text
                    CartProvider
                         │
           ┌─────────────┼─────────────┐
           ↓             ↓             ↓
  ProductoDetalle     Carrito     ContadorCarrito
```

Los diferentes componentes consumen el estado global mediante:

```js
useCart()
```

Esto permite mantener una sola fuente de información para el carrito.

---

# Stock

El proyecto incorpora una utilidad específica para normalizar los valores de stock.

Permite:

- Stock por defecto.
- Respetar stock igual a cero.
- Evitar valores negativos.
- Convertir valores decimales a enteros.
- Manejar valores inválidos.
- Limitar las cantidades agregadas al carrito.

---

# Usuarios y autenticación

La autenticación se encuentra centralizada mediante React Context.

Se implementaron:

- `AuthContext`.
- `AuthProvider`.
- Hook personalizado `useAuth`.

Funcionalidades:

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Persistencia de sesión.
- Recuperación de contraseña.
- Normalización del correo electrónico.
- Normalización del RUT.
- Validación de correo duplicado.
- Validación de RUT duplicado.
- Validación de contraseña.
- Roles de usuario.
- Rol cliente.
- Rol administrador.
- Usuario administrador inicial.
- Header dinámico según estado de autenticación.

---

## Roles

Actualmente existen los siguientes roles:

```text
Visitante
Cliente
Administrador
```

Los usuarios registrados desde el formulario público reciben automáticamente:

```text
rol: cliente
```

Por lo tanto, un usuario no puede asignarse permisos administrativos desde el registro público.

---

# Usuario administrador de prueba

El proyecto incorpora un usuario administrador inicial con fines académicos y de demostración.

```text
Correo:
admin@rectabags.cl

Contraseña:
Admin123!
```

Este usuario existe exclusivamente para pruebas dentro del proyecto.

No corresponde a un sistema de autenticación seguro para producción.

---

# Perfil de usuario

Existe una página protegida para usuarios autenticados.

Permite:

- Visualizar información personal.
- Editar nombre.
- Editar apellido.
- Editar fecha de nacimiento.
- Editar teléfono.
- Editar dirección.
- Actualizar información de región y comuna cuando corresponda.
- Persistir cambios.
- Actualizar inmediatamente la sesión.
- Actualizar datos de la base simulada.
- Mostrar el rol del usuario.

El correo y el RUT no se modifican desde esta vista.

---

# Recuperación de contraseña

El sistema permite actualizar la contraseña de un usuario registrado mediante:

- Correo electrónico.
- RUT.
- Nueva contraseña.
- Confirmación de contraseña.

La nueva contraseña queda almacenada en la base simulada utilizada por el frontend.

---

# Checkout

El proyecto incorpora un flujo funcional de checkout.

Permite:

- Comprar como usuario registrado.
- Comprar como invitado.
- Autocompletar información desde el perfil.
- Ingresar información manualmente.
- Nombre.
- Apellido.
- Correo electrónico.
- Teléfono.
- Dirección.
- Región.
- Comuna.
- Método de pago.
- Resumen del pedido.
- Cantidad total de productos.
- Total de productos.
- Persistencia de compras.
- Identificador único de compra.
- Vaciar automáticamente el carrito después de confirmar la compra.

---

## Flujo de compra

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
Confirmar compra
   ↓
Guardar compra
   ↓
Vaciar carrito
   ↓
Compra exitosa
```

---

# Compra como usuario autenticado

Cuando existe una sesión activa, el Checkout utiliza la información almacenada en el perfil para autocompletar diferentes campos.

Esto permite reutilizar información previamente registrada por el cliente.

---

# Compra como invitado

Un visitante también puede realizar una compra.

En este caso los campos del checkout deben completarse manualmente.

Las compras de invitados se almacenan sin un identificador asociado a una cuenta registrada.

---

# Persistencia de compras

Las compras son almacenadas mediante un servicio específico:

```text
src/services/compraService.js
```

Cada compra genera un identificador similar a:

```text
RB-XXXXXXXXXXXXX
```

El servicio permite:

- Guardar compras.
- Mantener compras anteriores.
- Buscar compras mediante identificador.
- Manejar datos inválidos almacenados en LocalStorage.

---

# Compra exitosa

Después de completar una compra correctamente se muestra una vista de confirmación.

Incluye:

- Número de compra.
- Cantidad de productos.
- Total de productos.
- Información relacionada con el despacho.

La página utiliza el identificador de la compra realizada para consultar la información correspondiente.

Si se intenta ingresar directamente a la ruta sin una compra válida, el usuario es redirigido.

---

# Compra con error

También existe una vista destinada a mostrar errores en caso de que una compra no pueda registrarse correctamente.

---

# Métodos de pago

Actualmente el Checkout incorpora métodos de pago simulados:

- Transferencia bancaria.
- Tarjeta bancaria simulada.

No se realizan cargos reales.

No se almacenan números de tarjeta ni información bancaria real.

---

# Despacho

El total mostrado actualmente corresponde al valor de los productos.

El costo de despacho no es calculado automáticamente en esta versión.

El despacho deberá coordinarse posteriormente utilizando los datos ingresados por el comprador.

---

# Contacto

El proyecto contiene un formulario de contacto desarrollado mediante React.

Incluye:

- Nombre.
- Correo electrónico.
- Asunto.
- Mensaje.
- Campos controlados mediante estado.
- Validaciones HTML.
- Mensaje de confirmación.
- Limpieza automática de los campos.
- Simulación frontend del registro de una consulta.

Actualmente no existe un backend encargado de enviar correos electrónicos reales.

---

# Blog

La aplicación incluye una página de Blog con contenido relacionado con:

- Bikepacking.
- Ciclismo.
- Viajes.
- Productos RectaBags.
- Experiencias de uso.

Los artículos individuales todavía no se encuentran desarrollados.

Los controles correspondientes se presentan deshabilitados para evitar enlaces sin funcionalidad.

---

# Páginas informativas

El proyecto incorpora diferentes vistas informativas:

- Quiénes Somos.
- Impacto Ambiental.
- Blog.
- Contacto.
- Términos de Compra.
- Términos de Registro.

---

# Diseño responsive

El proyecto utiliza Bootstrap para adaptarse a diferentes tamaños de pantalla.

Entre las herramientas utilizadas se encuentran:

- Grid system.
- Containers.
- Breakpoints.
- Flexbox.
- Formularios responsive.
- Navbar.
- Offcanvas.
- Cards.
- Buttons.
- Alerts.
- Badges.
- Utilities de display.
- Utilities de spacing.

La aplicación está pensada para funcionar en:

```text
Escritorio
Tablet
Dispositivo móvil
```

---

# Arquitectura del proyecto

El proyecto utiliza una organización basada en separación de responsabilidades.

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
│   ├── ActualizarTop.jsx
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
├── tests/
│   ├── AuthProvider.spec.js
│   ├── CantidadSelector.spec.js
│   ├── CartProvider.spec.js
│   ├── compraService.spec.js
│   ├── ProductFilter.spec.js
│   └── stock.spec.js
│
├── utils/
│   └── stock.js
│
├── App.jsx
├── index.css
└── main.jsx
```

---

# Persistencia simulada

Mientras el proyecto no dispone de un backend, se utiliza **LocalStorage** para simular persistencia.

Entre las claves utilizadas se encuentran:

```text
recta_carrito_invitado
recta_usuarios
recta_usuario_actual
recta_compras
```

Esta implementación corresponde únicamente a una simulación frontend con fines académicos.

No debe considerarse un sistema seguro de almacenamiento ni autenticación para producción.

---

# Testing

El proyecto incorpora pruebas unitarias utilizando:

- Jasmine.
- Karma.
- ChromeHeadless.
- Puppeteer.
- esbuild.

Las pruebas se ejecutan automáticamente dentro de un navegador Chrome en modo Headless.

Actualmente existen:

```text
44 pruebas unitarias
```

y todas se ejecutan correctamente.

---

## Ejecutar las pruebas

```bash
npm test
```

Resultado actual:

```text
Executed 44 of 44 SUCCESS
TOTAL: 44 SUCCESS
```

---

# Distribución de pruebas

Actualmente la suite se encuentra organizada de la siguiente forma:

```text
stock.spec.js
└── 5 pruebas

ProductFilter.spec.js
└── 3 pruebas

CantidadSelector.spec.js
└── 6 pruebas

compraService.spec.js
└── 6 pruebas

CartProvider.spec.js
└── 10 pruebas

AuthProvider.spec.js
└── 14 pruebas

────────────────────
TOTAL
└── 44 pruebas
```

---

# Áreas cubiertas por las pruebas

Las pruebas actuales validan diferentes aspectos del proyecto.

## Stock

Se comprueba:

- Stock por defecto.
- Stock cero.
- Valores negativos.
- Valores decimales.
- Valores inválidos.

---

## ProductFilter

Se comprueba:

- Renderizado del componente.
- Cantidad de categorías.
- Categoría activa.
- Eventos de selección.
- Función callback recibida mediante props.

---

## CantidadSelector

Se comprueba:

- Cantidad recibida mediante props.
- Aumento de cantidad.
- Disminución de cantidad.
- Límite mínimo.
- Límite máximo.
- Stock disponible.
- Bloqueo del botón cuando se alcanza el máximo.

---

## Servicio de compras

Se comprueba:

- Guardar una compra.
- Persistencia en LocalStorage.
- Mantener compras anteriores.
- Buscar mediante identificador.
- Compra inexistente.
- Identificador vacío.
- Manejo de LocalStorage con información inválida.

---

## CartProvider

Se comprueba:

- Estado inicial.
- Agregar productos.
- Acumular cantidades.
- Respetar stock.
- Rechazar productos agotados.
- Modificar cantidades.
- Eliminar productos.
- Vaciar carrito.
- Calcular cantidad de productos.
- Calcular subtotal.
- Persistencia en LocalStorage.
- Recuperación del carrito almacenado.

---

## AuthProvider

Se comprueba:

- Usuario administrador inicial.
- Registro de clientes.
- Normalización del correo.
- Correos duplicados.
- RUT duplicado.
- Credenciales incorrectas.
- Inicio de sesión.
- Inicio de sesión como administrador.
- Roles.
- Cierre de sesión.
- Recuperación de contraseña.
- Cambio de contraseña.
- Actualización del perfil.
- Persistencia de usuarios.
- Persistencia de sesión.

---

# Mocks y Spies

Las pruebas utilizan herramientas de Jasmine para simular comportamientos externos y observar llamadas a funciones.

Entre ellas:

```js
jasmine.createSpy()
```

y:

```js
spyOn()
```

Por ejemplo, `jasmine.createSpy()` permite simular una función recibida mediante props y comprobar posteriormente si fue ejecutada correctamente.

Esto permite probar componentes de forma aislada sin necesitar ejecutar todos los componentes relacionados.

---

# Cobertura de testing

El proyecto utiliza Istanbul para analizar la cobertura del código ejecutado durante las pruebas.

La instrumentación se realiza mediante Babel durante la ejecución específica de cobertura.

---

## Ejecutar cobertura

```bash
npm run test:coverage
```

Actualmente las 44 pruebas también pasan durante el análisis de cobertura:

```text
Executed 44 of 44 SUCCESS
TOTAL: 44 SUCCESS
```

---

# Resultado actual de cobertura

```text
Statements   : 89.83% (159/177)
Branches     : 73.33% (99/135)
Functions    : 94.73% (54/57)
Lines        : 89.83% (159/177)
```

---

## Significado de las métricas

### Statements

Porcentaje de instrucciones ejecutadas durante las pruebas.

Resultado actual:

```text
89.83%
```

### Branches

Porcentaje de caminos posibles de decisión recorridos.

Incluye elementos como:

```text
if
else
ternarios
operadores condicionales
```

Resultado actual:

```text
73.33%
```

### Functions

Porcentaje de funciones ejecutadas durante las pruebas.

Resultado actual:

```text
94.73%
```

### Lines

Porcentaje de líneas instrumentadas que fueron ejecutadas.

Resultado actual:

```text
89.83%
```

---

# Archivos actualmente instrumentados

El análisis de cobertura incluye:

```text
src/components/products/CantidadSelector.jsx
src/components/products/ProductFilter.jsx
src/context/AuthContext.js
src/context/AuthProvider.jsx
src/context/CartContext.js
src/context/CartProvider.jsx
src/data/usuariosIniciales.js
src/hooks/useAuth.js
src/hooks/useCart.js
src/services/compraService.js
src/utils/stock.js
```

Los porcentajes anteriores corresponden a las unidades incluidas actualmente en la suite de pruebas.

No deben interpretarse como cobertura absoluta de todas las páginas y archivos existentes en el proyecto.

---

# Reporte HTML de cobertura

Al ejecutar:

```bash
npm run test:coverage
```

se genera automáticamente:

```text
coverage/
```

El reporte principal puede encontrarse en:

```text
coverage/html/index.html
```

Este informe permite revisar visualmente:

- Archivos cubiertos.
- Instrucciones ejecutadas.
- Ramas cubiertas.
- Funciones utilizadas.
- Líneas sin ejecutar.

La carpeta:

```text
coverage/
```

no debe subirse al repositorio porque corresponde a archivos generados automáticamente.

---

# Requisitos

Para ejecutar el proyecto se necesita:

- Node.js.
- npm.
- Git.

Se recomienda utilizar una versión reciente y estable de Node.js.

Puedes revisar las versiones instaladas mediante:

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

---

## 2. Ingresar al proyecto

```bash
cd Rectabagsweb-React
```

---

## 3. Instalar dependencias

Se recomienda:

```bash
npm ci
```

También es posible utilizar:

```bash
npm install
```

`npm ci` utiliza exactamente las versiones registradas en:

```text
package-lock.json
```

por lo que resulta útil para mantener entornos consistentes entre diferentes integrantes del equipo.

---

# Ejecutar la aplicación

```bash
npm run dev
```

Vite mostrará una dirección similar a:

```text
http://localhost:5173
```

---

# Ejecutar ESLint

```bash
npm run lint
```

Este comando permite detectar problemas de calidad y sintaxis en el código.

Antes de realizar un Pull Request se recomienda comprobar que termine sin errores.

---

# Ejecutar pruebas

```bash
npm test
```

Actualmente:

```text
44/44 pruebas exitosas
```

---

# Ejecutar pruebas en modo Watch

```bash
npm run test:watch
```

Este comando mantiene Karma activo y vuelve a ejecutar las pruebas cuando detecta cambios.

Para detenerlo:

```text
Ctrl + C
```

---

# Ejecutar cobertura

```bash
npm run test:coverage
```

Este comando ejecuta las pruebas y genera los reportes de cobertura.

---

# Generar build de producción

```bash
npm run build
```

Los archivos compilados se generan dentro de:

```text
dist/
```

Esta carpeta se genera automáticamente y no debe almacenarse en Git.

---

# Vista previa del build

Después de ejecutar:

```bash
npm run build
```

se puede utilizar:

```bash
npm run preview
```

---

# Validación recomendada antes de subir cambios

Antes de integrar cambios al repositorio se recomienda ejecutar:

```bash
npm run lint
npm test
npm run build
```

Cuando se realizan cambios relacionados con las pruebas también puede ejecutarse:

```bash
npm run test:coverage
```

Actualmente los comandos principales finalizan correctamente:

```text
ESLint                    ✅
44 pruebas Jasmine/Karma  ✅
Cobertura                 ✅
Build Vite                ✅
```

---

# Trabajo entre Windows y Linux

El proyecto puede desarrollarse tanto en Windows como Linux.

La carpeta:

```text
node_modules/
```

no debe almacenarse en Git.

Cada integrante debe instalar las dependencias localmente:

```bash
npm ci
```

Los archivos que deben mantenerse versionados son:

```text
package.json
package-lock.json
```

---

# Archivos generados que no deben subirse

Las siguientes carpetas son generadas automáticamente:

```text
node_modules/
dist/
coverage/
```

Deben permanecer excluidas mediante:

```text
.gitignore
```

---

# Flujo recomendado de Git

Antes de comenzar a trabajar:

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

Posteriormente:

```bash
git status
git add .
git commit
git push
```

Cada integrante debe trabajar en su rama correspondiente y posteriormente realizar la integración mediante Pull Request.

---

# Buenas prácticas aplicadas

Durante el desarrollo se han utilizado diferentes prácticas relacionadas con frontend y calidad del software.

Entre ellas:

- Componentes reutilizables.
- Separación de responsabilidades.
- Hooks personalizados.
- React Context.
- Props.
- Estado local.
- Estado global.
- Formularios controlados.
- Rutas dinámicas.
- Persistencia simulada.
- Servicios.
- Utilidades.
- Manejo de errores.
- Validaciones.
- Diseño responsive.
- ESLint.
- Pruebas unitarias.
- Spies.
- Mocks.
- Cobertura.
- Control de versiones.
- Ramas Git.
- Pull Requests.

---

# Funcionalidades pendientes

Las siguientes funcionalidades todavía se encuentran pendientes de desarrollo:

- Vista de ofertas.
- Administración de productos.
- CRUD de productos.
- Administración de usuarios.
- Gestión de usuarios desde administración.
- Protección de rutas administrativas.
- Persistencia administrativa de productos.
- Actualización de pruebas después de incorporar administración.
- Documento final de cobertura de testing.
- Actualización final del documento ERS.
- Preparación de la presentación individual.

---

# Funcionalidades opcionales o futuras

Algunas mejoras podrían incorporarse posteriormente si el alcance y tiempo del proyecto lo permiten:

- Historial de compras del cliente.
- Seguimiento de pedidos.
- Artículos individuales del Blog.
- Regiones y comunas mediante datos dinámicos.
- Backend real.
- Base de datos real.
- API REST.
- Autenticación segura de servidor.
- Procesamiento real de pagos.
- Cálculo automático de despacho.

Estas funcionalidades no forman parte de la implementación frontend simulada actualmente disponible.

---

# Documentación de la evaluación

Además del código fuente, la entrega final requiere preparar documentación complementaria.

Entre los documentos pendientes se encuentran:

- ERS actualizado.
- Documento de cobertura de testing.
- Proyecto comprimido.
- Repositorio GitHub público.
- Preparación de la presentación individual.

---

# Estado actual del proyecto

```text
FRONTEND
────────────────────────────────
React / Vite                  ✅
React Router                  ✅
Componentes reutilizables     ✅
Props y estados               ✅
React Context                 ✅
Bootstrap responsive          ✅
Catálogo                      ✅
Filtros                       ✅
Búsqueda                      ✅
Detalle productos             ✅
Galería                       ✅
Control de stock              ✅
Carrito                       ✅
Persistencia carrito          ✅
Registro                      ✅
Login                         ✅
Logout                        ✅
Recuperación contraseña       ✅
Roles                         ✅
Administrador inicial         ✅
Perfil                        ✅
Checkout                      ✅
Compra invitado               ✅
Compra autenticado            ✅
Compra exitosa/error          ✅
Persistencia compras          ✅
Contacto                      ✅
Páginas informativas          ✅


TESTING
────────────────────────────────
Jasmine                       ✅
Karma                         ✅
ChromeHeadless                ✅
Puppeteer                     ✅
Mocks / Spies                 ✅
Pruebas DOM                   ✅
Pruebas Context               ✅
Pruebas LocalStorage          ✅
44 pruebas                    ✅
44/44 SUCCESS                 ✅
Cobertura JavaScript          ✅
Cobertura JSX                 ✅
Reporte HTML                  ✅

Statements                   89.83%
Branches                     73.33%
Functions                    94.73%
Lines                        89.83%


PENDIENTE
────────────────────────────────
Ofertas                       ⏳
Administración                ⏳
CRUD productos                ⏳
Gestión usuarios              ⏳
Protección Admin              ⏳
Documento cobertura           ⏳
ERS final                     ⏳
Presentación                  ⏳
```

---

# Integrantes

Proyecto desarrollado por un equipo de 3 estudiantes.

- Integrante 1: `NOMBRE`
- Integrante 2: `NOMBRE`
- Integrante 3: `NOMBRE`

Asignatura:

**DSY1104 - Desarrollo Fullstack II**

---

# Repositorio

Repositorio público del proyecto:

```text
AGREGAR_URL_DEL_REPOSITORIO
```

---

# Estado académico

El proyecto se encuentra actualmente en desarrollo para la **Evaluación Parcial N°2 de DSY1104 - Desarrollo Fullstack II**.

La implementación frontend principal se encuentra avanzada y el proyecto ya dispone de un entorno funcional de pruebas unitarias utilizando Jasmine y Karma.

Actualmente se ejecutan:

```text
44 pruebas unitarias
44 pruebas exitosas
```

junto con análisis de cobertura mediante Istanbul.

La siguiente etapa del desarrollo se concentrará en:

```text
Ofertas
↓
Administración
↓
CRUD de productos
↓
Gestión de usuarios
↓
Actualización final de testing
↓
Documento de cobertura
↓
ERS final
↓
Preparación de presentación
```