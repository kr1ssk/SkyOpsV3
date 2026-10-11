# SkyOpsV3

Proyecto académico de **Fullstack II (DSY1104), Duoc UC**.

Migración de SkyOpsV2 a React. Permite consultar repuestos aeronáuticos,
preparar un manifiesto de compra y completar un checkout simulado.

## Integrantes

- Agustín Boeri.
- Cristian Rivera.

## Ejecutar el proyecto

Requisitos: Node.js 24 y npm. Google Chrome para ejecutar las pruebas.

```bash
npm install
npm run dev
```

Abrir la dirección que indique Vite en la terminal.

## Comprobar el proyecto

```bash
npm test
npm run build
```

Las pruebas generan el informe `coverage/index.html`.
`npm run preview` permite revisar la compilación.

## Funcionalidades

- Catálogo con búsqueda, categorías y ofertas.
- Detalle de repuestos y certificación.
- Manifiesto con cantidades, subtotales y control de stock.
- Checkout con validación del responsable y datos de entrega.
- Resultado de compra aprobada o rechazada.
- Bitácora de pedidos con filtro por estado.
- Administración del catálogo: crear, consultar, editar y eliminar.
- Consulta de flota y formulario de contacto.
- Persistencia de datos mediante localStorage.
- Diseño responsivo con Bootstrap y React Bootstrap.

## Estructura

```text
public/assets/img/   Imágenes originales de SkyOpsV2
src/components/      Componentes reutilizables
src/context/         Estado compartido y persistencia
src/data/            Productos y flota iniciales
src/pages/           Páginas de la aplicación
src/utils/           Reglas de compra y validaciones
test/                Pruebas de lógica y componentes
docs/                ERS e informe de pruebas
```

## Tecnologías

React, Vite, React Router, Bootstrap, React Bootstrap, Jasmine y Karma.

## Datos y alcance

Los datos iniciales están en `src/data/semilla.js`.
Los precios son ejemplos académicos. Las imágenes se recuperaron de
[SkyOpsV2](https://github.com/kr1ssk/SkyOpsV2/tree/04efbe37a9f3fcf1a834c32cb853c5b34beeee9b/assets/img).

Los cambios se guardan con la clave `skyops_v3` de localStorage.
La compra y el pago son simulados. Contacto registra consultas en el
navegador y no envía correo. Resolver un pedido no certifica una aeronave.

## Documentación

- [ERS V2](docs/ERS-V2.md).
- [Informe de pruebas y cobertura](docs/COBERTURA-TESTING.md).

GitHub Actions ejecuta las pruebas y la compilación en cada actualización.
La cobertura queda disponible como artefacto de la ejecución.
