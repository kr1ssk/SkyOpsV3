# Informe de pruebas y cobertura — SkyOps

## Objetivo

Comprobar las reglas de compra y las interacciones principales de la
aplicación, incluyendo validaciones, filtros, formularios y persistencia.

## Herramientas

Jasmine define las pruebas; Karma las ejecuta en Google Chrome.
Testing Library renderiza los componentes y permite interactuar con ellos.
Istanbul y karma-coverage generan el informe de cobertura.

## Pruebas de lógica

| ID | Caso |
| --- | --- |
| B01 | Aplicación del descuento |
| B02 | Agregar un producto |
| B03 | Incrementar una cantidad |
| B04 | Impedir superar el stock |
| B05 | Rechazar cantidades decimales |
| B06 | Quitar un producto |
| B07 | Calcular el total con descuentos |
| B08 | Aprobar: descontar stock y vaciar carrito |
| B09 | Rechazar: conservar stock y carrito |
| B10 | Validar checkout |
| B11 | Validar stock y precio |
| B12 | Validar contacto |

## Pruebas de componentes

| ID | Caso |
| --- | --- |
| C01 | Mostrar y comunicar el error de Campo |
| C02 | Agregar desde la tarjeta |
| C03 | Deshabilitar productos sin stock |
| C04 | Mostrar resumen y total |
| C05 | Buscar en el catálogo |
| C06 | Quitar desde el manifiesto |
| C07 | Impedir checkout con datos vacíos |
| C08 | Crear un producto desde administración |
| C09 | Registrar una consulta válida |
| C10 | Mostrar página para ruta inexistente |
| C11 | Guardar el carrito con el proveedor |
| C12 | Filtrar ofertas |
| C13 | Editar un producto |
| C14 | Confirmar eliminación de un producto |

## Mocks

Un Context simulado aísla las páginas de la persistencia real.
jasmine.createSpy comprueba las llamadas a las funciones.

La prueba del proveedor simula getItem y setItem con spyOn.
La prueba de eliminación simula window.confirm.
Jasmine restaura los spies y cleanup desmonta los componentes entre casos.

## Verificación local del 11 de octubre de 2026

La sintaxis de los archivos JavaScript y JSX fue comprobada con el parser
Babel. Los 12 casos de negocio se verificaron mediante assert de Node.js.
Esta comprobación no reemplaza la ejecución de Jasmine y Karma.

La instalación local de npm falló con EBADF al escribir en el entorno de
trabajo. No se generaron porcentajes de cobertura ni se confirmó el build
localmente. La verificación completa queda a cargo de la ejecución automática.

## Ejecución y resultados

Comando: npm test.

La suite contiene 26 casos: 12 de lógica y 14 de componentes.
La ejecución completa y sus resultados se registran en GitHub Actions:
https://github.com/kr1ssk/SkyOpsV3/actions

Estado de ejecución y porcentajes: pendientes de confirmar.
No se considera que las pruebas pasan solamente por estar escritas.

## Cobertura

El informe local se encuentra en coverage/index.html después de npm test.
En GitHub Actions se publica como artefacto llamado cobertura-skyops.

La cobertura incluye los módulos importados por las pruebas.
App importa las páginas para que también se instrumenten.
main.jsx se excluye por ser el punto de montaje.

| Métrica | Resultado |
| --- | --- |
| Sentencias | Pendiente de ejecución |
| Ramas | Pendiente de ejecución |
| Funciones | Pendiente de ejecución |
| Líneas | Pendiente de ejecución |

## Verificación manual

- Revisar catálogo, categorías y ofertas.
- Agregar hasta alcanzar el stock y comprobar el bloqueo.
- Cambiar cantidades y quitar productos.
- Aprobar una compra, comprobar stock e historial.
- Rechazar una compra y comprobar que se conserva el carrito.
- Recargar y comprobar la persistencia.
- Crear, editar y eliminar productos.
- Revisar navegación, mensajes y formularios en móvil.

Estas comprobaciones visuales y sus capturas quedan pendientes de ejecución.

## Compilación

Comando: npm run build.

El flujo automático ejecuta la compilación después de las pruebas.
