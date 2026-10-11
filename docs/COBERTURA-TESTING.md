# Documento de testing y cobertura - SkyOpsV3
## 1. Objetivo y alcance
Comprobar las funcionalidades principales del frontend de la Evaluación Parcial 2 con Jasmine y Karma.
La suite final contiene **10 pruebas de componentes**, conforme a la referencia 10/10 de la rúbrica.
El 12% de la pauta es la ponderación del indicador IE2.2.1, no una cantidad de pruebas.

Se verifican renderizado, props, cambios de estado, eventos, formularios, DOM y persistencia.
Las pruebas utilizan App, componentes y SkyOpsProvider reales. No se sustituyen las operaciones de negocio por spies.
Los mocks se limitan a localStorage y window.confirm para controlar el entorno.

## 2. Configuración
- JavaScript/JSX, React, React Bootstrap y React Router.
- Jasmine: describe, it y expect para definir casos y resultados.
- Karma: ejecuta las pruebas en ChromeHeadless.
- Webpack y Babel: procesan JSX para las pruebas.
- Istanbul: mide sentencias, ramas, funciones y líneas.
- React Testing Library: renderiza componentes y simula eventos de usuario.
- MemoryRouter: permite probar rutas sin modificar la dirección del navegador.
- afterEach(cleanup): desmonta componentes entre casos.
- Cada prueba comienza con datos iniciales independientes.

Archivos: karma.conf.cjs, test/index.js y test/componentes.spec.jsx.
Las imágenes se sirven desde public/assets/img durante las pruebas.

## 3. Ejecutar y reproducir
En la carpeta del proyecto, con Node.js 24 y Chrome instalados:

```powershell
npm ci
npm test
npm run build
```

Si Chrome está instalado en una ubicación diferente, indicar su ruta:

```powershell
$env:CHROME_BIN = "C:\Program Files\Google\Chrome\Application\chrome.exe"
npm test
```

Abrir coverage/index.html para revisar cobertura por carpeta, archivo y línea.
El resultado también está en coverage/coverage-summary.json.
La compilación y cobertura se conservan como artefactos de GitHub Actions.

## 4. Casos y resultados
| Caso | Qué comprueba | Resultado esperado | ERS |
| --- | --- | --- | --- |
| C01 | Renderizado de tarjetas con datos, búsqueda, categoría, ofertas, detalle y agregar | Solo se muestran productos que cumplen filtros; agregar cambia el manifiesto | RF02, RF03, RF05, RF06 |
| C02 | Cambiar cantidades, calcular total, superar stock y quitar | Total de dos actuadores: $1.530.000; cantidad 99 rechazada; quitar vacía el carrito | RF06 |
| C03 | Registro vacío/válido, login incorrecto/correcto, perfil y cierre de sesión | Errores visibles, cuenta cliente guardada, perfil actualizado y sesión eliminada | RF12, RF13, RF14 |
| C04 | Acceso administrativo de visitante y cliente | Visitante pasa a login; cliente pasa a perfil | RF27 |
| C05 | Checkout vacío, datos precargados y aprobación | No compra datos inválidos; aprobación descuenta stock, vacía manifiesto y vincula usuario | RF07, RF08, RF09, RF11 |
| C06 | Compra rechazada y reintento | Conserva stock y manifiesto y vuelve al checkout | RF10, RF11 |
| C07 | Crear, consultar, editar y eliminar producto desde el formulario | Producto guardado, precio actualizado, detalle visible y eliminación confirmada | RF15 |
| C08 | Crear, renombrar y eliminar categoría, y proteger categorías utilizadas | Renombrar actualiza productos; eliminar categoría utilizada muestra error | RF16 |
| C09 | Crear, mostrar, editar y eliminar usuario | Datos actualizados, detalle e historial vacío visibles; cuenta activa protegida | RF17 |
| C10 | Resolver pedido, desmontar/montar y calcular reporte y stock crítico | Estado persiste; rechazados no suman ventas/unidades; stock crítico visible | RF18, RF20, RF21, RF26 |

Los diez casos aprobaron. Cada caso agrupa comprobaciones del mismo flujo; no son diez capturas ni diez pruebas de que una página simplemente abre.

## 5. Mocks y análisis
localStorage.getItem y setItem se simulan para conservar datos durante cada caso sin contaminar el navegador de otras pruebas.
Se comprueba el contenido guardado, por ejemplo carrito, stock, usuario y estado del pedido.
window.confirm se simula con una respuesta afirmativa en los casos de eliminación.
La implementación de Context, CRUD, compra y reportes se ejecuta realmente.

Se incluyen casos positivos y negativos: formulario vacío, credenciales incorrectas, cantidad mayor al stock, acceso con rol cliente, categoría utilizada y eliminación de la propia cuenta.
Los resultados se verifican tanto en el DOM como en el estado persistido; un mensaje de éxito por sí solo no demuestra que cambien los datos.

## 6. Evidencia de ejecución
Fecha: 11 de octubre de 2026.
Código verificado: a1cc812377bee0f7b342825efded60f0bf2ebaf3.
Entorno de GitHub Actions: Ubuntu 24.04, Node.js 24.21.0 y ChromeHeadless 154.

- **TOTAL: 10 SUCCESS**.
- **npm run build: correcto**.
- [Ejecución verificable y artefactos](https://github.com/kr1ssk/SkyOpsV3/actions/runs/38170208905).

| Métrica | Cubierto / total | Porcentaje |
| --- | --- | --- |
| Sentencias | 468 / 603 | 77,61% |
| Ramas | 319 / 423 | 75,41% |
| Funciones | 176 / 225 | 78,22% |
| Líneas | 409 / 519 | 78,80% |

main.jsx se excluye de la instrumentación porque contiene el arranque de la aplicación; se comprueba al abrir la compilación.
Las demás vistas importadas por App se incluyen aunque una prueba no las abra. No se excluyen archivos para aumentar artificialmente el porcentaje.
La rúbrica no establece un porcentaje mínimo numérico de cobertura.

## 7. Qué significan estos porcentajes
- Sentencias: instrucciones que se ejecutaron.
- Ramas: alternativas de condiciones que se recorrieron.
- Funciones: funciones que fueron llamadas.
- Líneas: líneas ejecutables que se ejecutaron.

Estos valores no son una calificación ni una medida de ausencia de errores.
Que las diez pruebas pasen indica que sus resultados esperados se cumplieron.
No significa que todas las funciones o situaciones estén probadas.

## 8. Límites identificados
La suite de diez casos prioriza los flujos principales, sin afirmar cobertura exhaustiva.
No automatiza todos los errores posibles de CRUD, cambios de rol, almacenamiento corrupto o sin espacio, ni toda la validación de contacto.
Las páginas informativas y parte de la flota no se ejecutan en estos diez casos y aparecen con baja o nula cobertura.
Estas limitaciones son visibles en el informe y pueden afectar el nivel del indicador de cobertura de la rúbrica.

Ejemplos de líneas cubiertas: Checkout 96,87%; Manifiesto 100%; Login/Registro 100%; Context 85,96%; repositorio 87,69%.
Inicio, Nosotros, Blog, DetalleBlog, Contacto, Categorias y Dashboard no se ejercitan en la suite final. La revisión manual no modifica la cobertura de Jasmine/Karma.
No se declara que 78,80% sea una cobertura completa.

## 9. Revisión manual de la compilación
Se abrió la compilación generada por GitHub Actions en un servidor local y se revisó en el navegador.

| Vista o acción | Tamaño | Resultado observado |
| --- | --- | --- |
| Catálogo e imágenes | 393 x 852 | Tarjetas en una columna, menú colapsable, tres imágenes cargadas y sin desbordamiento horizontal de la página |
| Manifiesto y checkout | 768 x 1024 | Tabla y formulario legibles; formulario/resumen apilados; sin desbordamiento horizontal |
| Administración de productos | 1366 x 900 | Formulario y listado en columnas; acciones visibles; sin desbordamiento horizontal |
| Administración de productos | 393 x 852 | Formulario y listado apilados; navegación de módulos adaptable |
| Login administrativo | Navegador local | Credenciales demo abren perfil y muestran acceso a administración |
| Blog y ambas publicaciones | Móvil | Dos publicaciones y sus respectivos detalles accesibles |
| Contacto | Móvil | Vacío muestra errores; consulta ficticia válida muestra confirmación de guardado local |

Estas comprobaciones son manuales y no se cuentan como pruebas unitarias.
No reemplazan la revisión en dispositivos físicos ni validan seguridad de producción.

## 10. Demostración para la presentación
1. Explicar estructura de React, un componente con props y un formulario con estado.
2. Mostrar catálogo, filtros, manifiesto y checkout aprobado/rechazado.
3. Ingresar con admin@skyops.cl / Skyops123 y mostrar CRUD, órdenes, stock crítico y reporte.
4. Ejecutar npm test y explicar C01-C10, mocks y resultados.
5. Abrir coverage/index.html y explicar un archivo con líneas no cubiertas.
6. Mostrar Bootstrap en móvil/escritorio, la ERS y los commits.

Presentación: 15 minutos más 5 de preguntas. Cada integrante debe entender el código y sus cambios.
No se simula validación docente ni se declara una nota garantizada.
