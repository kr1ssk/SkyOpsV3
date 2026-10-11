# Especificación de Requisitos de Software — SkyOps V2

## Propósito y alcance

Adaptar el proyecto de la Unidad 1 a React y al flujo de compra de la
Evaluación Parcial 2 de Fullstack II, manteniendo la temática aeronáutica.

El sistema usa datos simulados en JavaScript y almacenamiento local.
Su catálogo corresponde a repuestos asociados a categorías ATA.

## Requisitos funcionales

| ID | Requisito | Página o archivo |
| --- | --- | --- |
| RF01 | Consultar el catálogo y el detalle de repuestos | Catalogo, Detalle |
| RF02 | Buscar por nombre y número de parte | Catalogo |
| RF03 | Filtrar por categoría y ofertas | Catalogo, Categorias |
| RF04 | Mostrar precios y descuentos | TarjetaProducto, Detalle |
| RF05 | Agregar, cambiar cantidades y quitar repuestos | Manifiesto |
| RF06 | Calcular subtotales y total | negocio.js |
| RF07 | Validar datos del responsable y de entrega | Checkout |
| RF08 | Seleccionar retiro en bodega o despacho a aeropuerto | Checkout |
| RF09 | Simular una compra aprobada o rechazada y mostrar su resumen | Checkout, Resultado |
| RF10 | Actualizar stock y vaciar el manifiesto al aprobar | negocio.js |
| RF11 | Conservar stock y manifiesto al rechazar | negocio.js |
| RF12 | Consultar pedidos y filtrar por estado | Bitacora |
| RF13 | Marcar un pedido pendiente como resuelto | Bitacora |
| RF14 | Crear, consultar, modificar y eliminar productos | Admin |
| RF15 | Validar productos y evitar números de parte duplicados | validaciones.js, Context |
| RF16 | Consultar las aeronaves registradas | Flota |
| RF17 | Validar y registrar consultas de contacto | Contacto |
| RF18 | Mantener los datos después de recargar | SkyOpsContext |

## Requisitos no funcionales

- Utilizar componentes funcionales de React.
- Manejar información mediante props y estado.
- Compartir carrito y catálogo mediante Context.
- Adaptar la presentación con Bootstrap.
- Asociar etiquetas a campos y comunicar errores de validación.
- Probar componentes y reglas de negocio con Jasmine y Karma.
- Generar y documentar cobertura de código.

## Reglas de negocio

1. Las cantidades son enteros positivos y no superan el stock.
2. El stock es entero y no negativo; el precio es entero y positivo.
3. El descuento está entre 0 y 100 y el precio final se redondea a pesos.
4. El número de parte no se repite.
5. Un producto presente en el manifiesto no puede eliminarse.
6. Su stock no puede reducirse por debajo de la cantidad del manifiesto.
7. Una compra aprobada descuenta stock y vacía el manifiesto.
8. Una compra rechazada conserva el stock y el manifiesto.
9. Cada pedido conserva sus productos, cantidades y precios.
10. Resolver un pedido cambia su estado y no la certificación de la flota.

## Formularios

Checkout solicita matrícula, nombre y apellido, licencia, correo,
dirección, aeropuerto, forma de entrega y confirmación de revisión.

Administración valida datos descriptivos, stock, precio, descuento
y nombre opcional del archivo de imagen.

Contacto solicita nombre, correo y un mensaje de al menos 20 caracteres.

## Limitaciones

- El pago se simula; no existe una pasarela real.
- Los datos se guardan por navegador y origen.
- No se incluye un servidor backend ni autenticación.
- El contacto se registra localmente.
- Los precios son ejemplos.
- La aplicación no valida ni emite certificaciones aeronáuticas.

## Entrega y evidencias

Repositorio: https://github.com/kr1ssk/SkyOpsV3

Integrantes: Agustín Boeri y Cristian Rivera.

El informe de pruebas registra los resultados verificables.
Las capturas de uso y de vista móvil deben obtenerse de la aplicación
en ejecución para la presentación. La versión ZIP debe incluir el
frontend sin node_modules.
