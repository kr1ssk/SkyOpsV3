# Especificación de Requisitos de Software - SkyOps
## Control de versiones
| Fecha | Versión | Modificación |
| --- | --- | --- |
| 11-10-2026 | 2.0 | Migración a React, catálogo, manifiesto y compra simulada. |
| 11-10-2026 | 2.1 | Vistas del anexo, cuentas, administración y ampliación del testing. |

Autores del proyecto: Agustín Boeri y Cristian Rivera.
Estado: propuesta implementada para revisión académica; no implica aprobación del docente.

## 1. Introducción
### 1.1 Propósito
Definir los requisitos de SkyOps para la Evaluación Parcial 2 de DSY1104, Desarrollo Fullstack II, Duoc UC. Dirigido al equipo y al docente.
### 1.2 Alcance
Continuar el caso SkyOps de la Unidad 1 como una tienda de repuestos aeronáuticos. El profesor autorizó el cambio de caso, según lo indicado por el equipo. Se conservan catálogo, flota y manifiesto, y se incorporan las vistas del anexo adaptadas al negocio.
Las cuentas, el stock, las compras y el pago son simulados. Los datos se almacenan en el navegador.
### 1.3 Definiciones
- AOG: aeronave en tierra.
- ATA: clasificación usada para ordenar componentes por sistema.
- PN: número de parte.
- Manifiesto: carrito de repuestos.
- CRUD: crear, leer, actualizar y eliminar.
- ERS: especificación de requisitos de software.
### 1.4 Referencias
- DSY1104 Evaluación Parcial 2 - Anexo 1 Instrucciones: requisitos y figuras 3 y 10.
- DSY1104 Evaluación Parcial 2_EE_EP_Estudiante: rúbrica del encargo y presentación.
- Plantilla ERS de la Evaluación Parcial 1: organización documental.
- Repositorio del profesor: https://github.com/donkiwicl/full_stack_II
- Proyecto: https://github.com/kr1ssk/SkyOpsV3
Las plantillas y ejemplos de Evaluación 1 no son requisitos específicos de SkyOps. No se cuenta con una ERS completada y aprobada de Evaluación 1 para verificar toda su trazabilidad histórica.
### 1.5 Organización
El documento presenta contexto, interfaces, requisitos verificables, reglas, limitaciones y evidencias de pruebas.

## 2. Descripción general
### 2.1 Perspectiva del producto
Aplicación frontend con React y Vite, navegación mediante React Router y diseño Bootstrap. Un archivo JavaScript contiene los datos iniciales y otro las operaciones CRUD. Context conecta el estado con los componentes y localStorage conserva los cambios.
### 2.2 Funciones
Consulta y búsqueda de repuestos, categorías, ofertas, manifiesto, checkout, comprobante, cuentas, perfil, administración, órdenes, stock crítico, reportes, contacto e información pública.
### 2.3 Usuarios
- Visitante: consulta información y realiza compra simulada sin cuenta.
- Cliente registrado: inicia sesión, modifica su perfil y consulta sus compras.
- Administrador: gestiona productos, categorías, usuarios y pedidos, y consulta reportes.
### 2.4 Restricciones
Código JavaScript y componentes funcionales React, Bootstrap, Jasmine y Karma. No se necesita una pasarela de pagos ni un proveedor de autenticación externo. Solo datos ficticios.
### 2.5 Supuestos y dependencias
Navegador moderno, Node.js 24 y npm para desarrollo; Chrome para las pruebas.
La implementación sigue la fuente de datos simulada indicada en el cuerpo del anexo. La frase final sobre integración con backend requiere aclaración docente; no se afirma cumplir una integración con un servidor.
### 2.6 Evolución
Las integraciones reales quedan fuera de esta entrega; no se implementan funciones futuras.

## 3. Requisitos específicos
### 3.1 Interfaces externas
#### 3.1.1 Usuario
Navbar adaptable, formularios con etiquetas y mensajes, tarjetas y tablas responsivas. Panel administrativo con navegación por módulos. Móvil, tablet y escritorio.
#### 3.1.2 Hardware
Sin dispositivos especiales.
#### 3.1.3 Software
React, React Router, Bootstrap, React Bootstrap, Vite, Jasmine, Karma y Chrome. Persistencia bajo la clave localStorage `skyops_v3`.
#### 3.1.4 Comunicación
No hay API de negocio ni envío de correos. Los cambios se mantienen en el navegador y origen donde se utiliza la aplicación.

### 3.2 Requisitos funcionales
Todos los requisitos de esta tabla pertenecen a la versión 2.1. La aceptación se comprueba con los archivos de pruebas y el recorrido manual documentado en el informe de testing.

| ID | Actor | Requisito y criterio de aceptación | Implementación |
| --- | --- | --- | --- |
| RF01 | Todos | Inicio muestra la propuesta SkyOps y permite acceder al catálogo. | Inicio |
| RF02 | Todos | Catálogo busca por nombre o PN y filtra por categoría. | Catalogo |
| RF03 | Todos | Detalle muestra PN, descripción, precio, stock y certificación; ID inexistente informa el error. | Detalle |
| RF04 | Todos | Categorías muestran cantidad y conducen a sus repuestos. | Categorias |
| RF05 | Todos | Ofertas muestra únicamente productos con descuento mayor a cero. | Ofertas, Catalogo |
| RF06 | Todos | Agregar, cambiar cantidad y quitar actualiza el manifiesto y total sin superar stock. | Manifiesto, negocio |
| RF07 | Todos | Checkout valida responsable, matrícula, licencia, correo, dirección, aeropuerto y entrega. No permite confirmar datos inválidos. | Checkout |
| RF08 | Cliente/admin | Checkout precarga nombre, correo, licencia y dirección desde el perfil. | Checkout |
| RF09 | Todos | Compra aprobada registra pedido, descuenta stock y vacía manifiesto. | negocio, Context |
| RF10 | Todos | Compra rechazada registra intento y conserva stock y manifiesto. | negocio |
| RF11 | Todos | Resultado muestra comprobante con folio, fecha, entrega, líneas y total; permite reintentar si se rechaza. | Resultado |
| RF12 | Visitante | Registro valida nombre, correo único, clave de al menos 8 caracteres con letras y números, y confirmación; asigna rol cliente. | Registro, FormularioUsuario |
| RF13 | Cliente/admin | Login acepta credenciales registradas, rechaza las incorrectas y permite cerrar sesión. | Login, Context |
| RF14 | Cliente/admin | Perfil permite editar datos; historial muestra solo pedidos vinculados a esa cuenta. | Perfil |
| RF15 | Admin | Crear, mostrar, editar y eliminar producto; impide PN duplicado y cambios incompatibles con el manifiesto. | Admin, repositorio |
| RF16 | Admin | Crear, editar y eliminar categorías; renombrar actualiza productos, eliminar una utilizada se rechaza. | AdminCategorias, repositorio |
| RF17 | Admin | Crear, consultar, editar y eliminar usuarios; muestra historial e impide quitar al último admin o eliminar la propia cuenta. | AdminUsuarios, repositorio |
| RF18 | Admin | Consultar órdenes, filtrar estado, abrir comprobante y marcar pendientes como resueltas. | Bitacora |
| RF19 | Admin | Dashboard calcula productos, usuarios, pendientes, ventas y stock crítico desde los datos. | Dashboard |
| RF20 | Admin | Stock crítico lista repuestos con 2 unidades o menos, incluyendo agotados. | StockCritico |
| RF21 | Admin | Reportes calcula intentos, aprobados, rechazados, pendientes, unidades y ventas; excluye rechazados de ventas/unidades. | Reportes, reportes |
| RF22 | Todos | Nosotros explica propuesta y alcance académico. | Nosotros |
| RF23 | Todos | Blog lista dos publicaciones y permite abrir cada detalle. | Blog, DetalleBlog |
| RF24 | Todos | Contacto valida nombre, correo y mensaje y guarda consulta localmente. | Contacto |
| RF25 | Todos | Flota consulta aeronaves y permite preparar entrega con matrícula. | Flota |
| RF26 | Todos | Recargar conserva datos y sesión; almacenamiento inválido recupera semilla; fallo de escritura se comunica. | Context |
| RF27 | Visitante/cliente | Las rutas de administración redirigen a login o perfil según el rol. | Acceso |

### 3.3 Requisitos no funcionales
#### 3.3.1 Rendimiento
Operar con el pequeño conjunto de datos académico sin recargas completas para cada cambio de vista.
#### 3.3.2 Seguridad
Las rutas y operaciones administrativas comprueban la sesión y rol para demostrar el flujo. Esto no ofrece seguridad de un sistema real: los datos y contraseñas de prueba están en JavaScript/localStorage y pueden modificarse desde el navegador. No usar credenciales ni información personal reales.
#### 3.3.3 Fiabilidad
Validar entradas antes de cambiar datos, evitar stock negativo, PN/correos duplicados y eliminación de categorías utilizadas. Cada pedido conserva los precios y cantidades de la compra.
#### 3.3.4 Disponibilidad
Disponible cuando se ejecuta el frontend y el navegador permite cargar los archivos. No se compromete disponibilidad de un servicio productivo.
#### 3.3.5 Mantenibilidad
Componentes con responsabilidades claras; reglas separadas en archivos JavaScript; props, estado y Context; package-lock versionado; pruebas reproducibles con npm test.
#### 3.3.6 Portabilidad y accesibilidad
Bootstrap con columnas adaptables, tablas responsivas, navegación colapsable, etiquetas vinculadas a campos y errores visibles.

### 3.4 Reglas adicionales
1. Stock entero no negativo; precio entero positivo.
2. Cantidades enteras entre 1 y el stock disponible.
3. Descuento entre 0 y 100; precio final redondeado a CLP.
4. Un producto del manifiesto no se elimina ni reduce su stock por debajo de la cantidad solicitada.
5. Una categoría tiene formato ATA seguido de dos dígitos.
6. Una compra aprobada queda Pendiente; un administrador puede marcarla Resuelta. Una Rechazada no se resuelve.
7. El comprobante es académico; no es una boleta tributaria.
8. La certificación mostrada es un dato de ejemplo. La aplicación no certifica repuestos ni aeronaves.
9. No hay pagos reales, correos enviados ni sincronización entre navegadores.

## 4. Validación y entrega
Las evidencias, resultados de ejecución, límites de cobertura y casos para la demostración se mantienen en [COBERTURA-TESTING.md](COBERTURA-TESTING.md).
Se entrega repositorio público, ZIP sin node_modules, esta ERS y el informe de pruebas. La exposición dura 15 minutos más 5 de preguntas.
La plantilla incluye instancias de revisión: la validación docente debe registrar fecha y observaciones cuando ocurra, sin simular firmas ni aprobación.
