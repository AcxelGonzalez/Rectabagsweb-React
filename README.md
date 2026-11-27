# RectaBags React

Tienda y panel administrativo de RectaBags para DSY1104 Desarrollo Fullstack II,
Evaluación Parcial 3 y EFT. React consulta una API Spring Boot; PostgreSQL conserva
categorías, productos, usuarios, boletas y detalles. El navegador conserva el
carrito, el JWT y una copia de los datos de sesión.

Revisión del 27/11/2026. Código comprobado: React `b398846` y backend `92eb5fd`.

## Equipo y repositorios

Marco Carrasco Zabalaga, Acxel González Osorio y Fabián Cornejo Morales.
Docente: Freddy Campos Orellana.

- [Frontend](https://github.com/AcxelGonzalez/Rectabagsweb-React/tree/Desarrollo-Marco-Carrasco-Zabalaga), rama `Desarrollo-Marco-Carrasco-Zabalaga`.
- [Backend](https://github.com/fabcornejom/rectabags_backend/tree/desarrollo-marco), rama `desarrollo-marco`.

Cada integrante trabaja en su rama con commits descriptivos; la incorporación a
la rama compartida debe coordinarse con el equipo.

## Instalación y ejecución

Se utilizan React 19, React Router 7, Vite 8, Bootstrap 5 y Axios. Se requiere
Node.js y npm compatibles con el lockfile y esas herramientas. El backend requiere
Java 17 o compatible y PostgreSQL; el entorno verificado utiliza PostgreSQL 19.

1. Obtenga ambos repositorios en carpetas independientes.
2. Prepare la base y el usuario `rectabags` siguiendo el README del backend.
3. En el backend, copie `config/application-local.properties.example` como
   `config/application-local.properties`. Defina `DB_PASSWORD` con su contraseña
   de PostgreSQL y `JWT_SECRET` con una clave aleatoria del entorno. También pueden
   proporcionarse mediante variables de entorno. El archivo particular está
   ignorado por Git; conserve las referencias a variables en los archivos versionados.
4. Si conserva una base anterior, revise las migraciones del backend para ubicación
   opcional y límites del instructivo. No borre la base.
5. Ejecute `./mvnw.cmd spring-boot:run` desde el backend. Swagger queda en
   `http://localhost:8080/swagger-ui/index.html`.
6. Desde este frontend ejecute `npm ci` y elija desarrollo o vista previa:

```powershell
# Desarrollo: http://localhost:5173
npm run dev -- --port 5173 --strictPort

# Vista previa: http://localhost:4173
npm run build
npm run preview -- --port 4173 --strictPort
```

El backend debe permanecer encendido. Para detener los servidores use `Ctrl+C`.

## URL de API y CORS

`src/services/api.js` lee `VITE_API_URL`, con `http://localhost:8080/api/v1`
como valor predeterminado. Para otra dirección, copie `.env.example` como
`.env.local` y ajuste la URL completa:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

Los archivos particulares `.env` y `.env.*` están ignorados; se publica únicamente
`.env.example`. Las variables `VITE_*` son visibles en el navegador: no guardar
contraseñas, claves JWT ni otros secretos allí. Reinicie Vite después de cambiarlas.
La URL queda incorporada al compilar; un cambio posterior requiere otro build.

Spring permite `http://localhost:5173` y `http://localhost:4173` por defecto.
`CORS_ALLOWED_ORIGINS` permite sustituir la lista por orígenes exactos autorizados,
sin rutas ni barra final. No use `*`; reinicie el backend al cambiarla.
`localhost` y `127.0.0.1` son distintos. Sin `--strictPort`, Vite puede elegir otro
puerto cuando el previsto está ocupado; ese origen también necesitaría autorización.

## Roles y cuentas de demostración

| Perfil | Acceso |
|---|---|
| Visitante | Tienda pública, registro, login y compra como invitado. |
| CLIENTE | Tienda, perfil, sus compras y sus boletas. |
| VENDEDOR | Consulta del panel, productos y órdenes con sus detalles. |
| ADMIN | Mantenedores, órdenes, cambios de estado, reportes y cierre. |

El login entrega un JWT. El backend obtiene el ID desde el token y vuelve a
consultar el usuario para aplicar permisos. React protege las vistas y Spring
Security las operaciones. Un cliente no puede consultar boletas ajenas o de invitado.

| Correo | Contraseña de demostración | Rol |
|---|---|---|
| admin@duoc.cl | Admin123! | ADMIN |
| vendedor@duoc.cl | Vend123! | VENDEDOR |
| cliente@gmail.com | Cli123! | CLIENTE |

Estas cuentas se inicializan en el backend si no existen; no son autenticación simulada en React.

## Funciones actuales

- Catálogo, ofertas, búsqueda y filtros por categorías de la API. Carga, error,
  vacío y elemento inexistente se distinguen y permiten reintentar cuando corresponde.
- Carrito persistente por usuario, fusión del carrito invitado al iniciar sesión,
  cantidades enteras y sincronización con precio y stock disponibles.
- Checkout autenticado o invitado con confirmación. React envía identificadores y
  cantidades; el backend calcula precios, guarda detalles históricos y descuenta
  stock transaccionalmente. Un rechazo conserva el carrito. El pago es de demostración.
- Perfil con edición de nombre, apellido y contacto, e historial de compras. RUN,
  correo y rol no se editan desde el perfil. La fecha de nacimiento del registro
  es opcional y actualmente no se persiste.
- ADMIN puede crear usuarios en `/admin/usuarios/nuevo`, listar, editar y eliminar.
  No puede eliminarse ni cambiar su propio rol. La API impide eliminar cuentas con compras.
- CRUD de productos y categorías para ADMIN. El borrado de productos es lógico;
  una categoría con productos asociados, incluso inactivos, no puede eliminarse.
- Boletas con precios y nombres históricos, folio completo adaptable a móvil y
  desplazamiento horizontal limitado al contenedor de su tabla.
- Reportes del periodo abierto. Canceladas y cerradas no suman ventas; las
  canceladas abiertas sí aparecen en el conteo por estado.
- Contacto valida nombre/correo hasta 100 y comentario hasta 500. Es una
  demostración local y no envía mensajes a un servidor.
- Navegación adaptable, `h1` en Inicio, nota de Registro con contraste 5,97:1 y
  ayudas/errores de `CampoFormulario` asociados a controles. Son correcciones
  concretas; no acreditan una certificación integral de accesibilidad.

Importes: `1000 → $1.000`, `1000.50 → $1.000,50`. El **ticket promedio** se calcula como ventas del periodo divididas por compras,
con dos decimales y redondeo comercial (`HALF_UP`) solo al final. Ejemplo: ventas
de $1.000 y $1.001 dan un promedio de $1.000,50. Es un indicador de gestión;
no se le aplica la regla de redondeo de pagos en efectivo.
[Referencia del Banco Central](https://www.billetesymonedas.cl/Monedas/ReglaRedondeo).

## Estados y cierre

| Estado actual | Cambios permitidos |
|---|---|
| PENDIENTE | PAGADA o CANCELADA |
| PAGADA | ENVIADA o CANCELADA |
| ENVIADA | ENTREGADA |
| ENTREGADA / CANCELADA | Finales |

Solo ADMIN cambia estados. Cancelar devuelve stock una vez; repetir el estado
actual no vuelve a modificarlo y una cancelada no se reactiva. VENDEDOR consulta
sin selector. El cierre fecha todas las boletas abiertas, incluidas las que están
en proceso, conserva sus historiales y bloquea posteriores cambios de estado.

## Verificación

```powershell
npm test
npm run test:coverage
npm run lint
npm run build
```

Al 27/11/2026: **288 pruebas de React en 21 archivos aprobadas**, lint y build
correctos. El backend aprobó **110 pruebas**. La medición V8 del frontend registró:

| Medida | Cobertura |
|---|---|
| Instrucciones | 63,85% (869/1361) |
| Ramas | 53,03% (611/1152) |
| Funciones | 61,68% (256/415) |
| Líneas | 64,36% (820/1274) |

La cobertura incluye `src` y excluye `src/tests`; no mide Java. Vitest utiliza
jsdom y dobles de API. JUnit/Mockito y PostgreSQL comprueban el backend.
Las pruebas locales heredadas de compras y estadísticas siguen presentes, pero
no acreditan las reglas ni la persistencia actuales del servidor.

Se verificaron catálogo, login y permisos por HTTP real desde 5173 y 4173,
configurando la API en 8081: 401 sin sesión, 403 para CLIENTE en usuarios y rechazo
de un origen ajeno. Esa comprobación usó lecturas y login, sin crear registros.

El 27/11/2026 se actualizó ESLint de 10.11.0 a 10.16.0 y sus dependencias
transitivas para resolver los tres avisos moderados. La reinstalación con
`npm ci`, las 288 pruebas, lint y build fueron correctos; `npm audit` informa
cero vulnerabilidades conocidas en las dependencias instaladas.

## Pendientes y límites

- Recuperación de contraseña: pantalla sin endpoint; informa que no está disponible.
- Blog: listado existente; dos detalles pendientes de confirmación docente.
- Fecha de nacimiento sin persistencia, pendiente de decisión.
- Pruebas integradas: usan la base configurada para desarrollo; faltan conexión y
  datos aislados. Algunas esperan que no haya otras órdenes abiertas.
- Build con aviso de tamaño de aproximadamente 551 kB. Rendimiento y disponibilidad
  no medidos; no se acredita compatibilidad completa entre navegadores.
- Pagos bancarios reales, publicación de reseñas, envío de contacto y despliegue
  público HTTPS no están implementados. Las valoraciones son datos de presentación.

## Documentación de entrega

`docs/` contiene manual, ERS, cobertura, APIs e integración, las dos planillas y
evidencias. Las capturas del 26/11 corresponden a aquella ejecución; las revisiones
posteriores se identifican por fecha y por uso de API real o simulada. Los informes
privados de auditoría no están incluidos en este repositorio.
