# SkyOpsV3

Proyecto académico de **Fullstack II (DSY1104), Duoc UC**.
Integrantes: Agustín Boeri y Cristian Rivera.

Tienda simulada de repuestos aeronáuticos, adaptada desde SkyOpsV2.
React, Vite, React Router, Bootstrap, React Bootstrap, Jasmine y Karma.

## Ejecutar en tu PC
Requisitos: Node.js 24, npm y Google Chrome para las pruebas.
Desde la carpeta que contiene package.json:

```powershell
git pull --ff-only
npm ci
npm test
npm run build
npm run dev
```

Si descargaste el ZIP, comienza en `npm ci`.
Abre la dirección que muestre Vite. Detén el servidor con Ctrl+C.
`npm run preview` permite revisar la compilación de producción.

## Cuenta de demostración
- Correo: **admin@skyops.cl**
- Contraseña: **Skyops123**

El registro crea cuentas con rol cliente. La cuenta administradora permite gestionar el catálogo, categorías y usuarios.
Todas las cuentas y contraseñas son ficticias y se guardan en el navegador. No usar datos ni claves reales.

## Funcionalidades del anexo
- Inicio, catálogo, detalle, categorías y ofertas.
- Nosotros, blog con dos publicaciones y sus detalles, contacto.
- Registro, login, cierre de sesión y perfil editable.
- Historial de compras de cada cuenta y datos de perfil precargados en checkout.
- Manifiesto: cantidades, descuentos, subtotales y control de stock.
- Checkout: datos del responsable, dirección, aeropuerto y forma de entrega.
- Compra aprobada/rechazada y comprobante con resumen.
- Dashboard administrativo, CRUD de productos, categorías y usuarios.
- Órdenes y comprobantes, stock crítico y reportes calculados.
- Consulta de flota conservada del caso SkyOps.
- Persistencia con localStorage y diseño responsivo con Bootstrap.

No hay pagos reales ni correo enviado. El comprobante no constituye una boleta tributaria.
La certificación de un repuesto es un dato de ejemplo y debe verificarse fuera de esta aplicación.

## Estructura
```text
public/assets/img/   Imágenes recuperadas de SkyOpsV2
src/components/      Campos, tarjetas, resumen, formularios y layouts
src/context/         Estado compartido, sesión y persistencia
src/data/            Semilla, publicaciones y funciones CRUD
src/pages/           Vistas públicas y administrativas
src/utils/           Compra, validaciones y reportes
test/                Diez pruebas de componentes
docs/                ERS e informe de testing
```

Los datos se guardan bajo la clave `skyops_v3`. Se conservan los productos y pedidos guardados por versiones anteriores.
El almacenamiento depende del navegador y del origen (dirección/puerto). No se sincroniza entre equipos.

## Pruebas
`npm test` ejecuta **10 pruebas de componentes** con Jasmine y Karma, usando el proveedor real de datos.
Se simulan únicamente localStorage y las confirmaciones del navegador.
Los casos cubren catálogo, manifiesto, cuentas, acceso, compra, administración y persistencia/reportes.

El informe se genera en `coverage/index.html`. La cobertura mide código ejecutado; no es la nota ni prueba que no existan errores.
Los resultados y límites están en [el informe de testing](docs/COBERTURA-TESTING.md).

## Documentación y entrega
- [ERS V2](docs/ERS-V2.md).
- [Documento de testing y cobertura](docs/COBERTURA-TESTING.md).
- [Repositorio público](https://github.com/kr1ssk/SkyOpsV3).

GitHub Actions instala las versiones de package-lock, ejecuta pruebas y compila.
Conserva cobertura y frontend compilado como artefactos descargables.
Los cambios exclusivamente en Markdown no repiten las pruebas.

La fuente de datos es simulada, según el cuerpo del anexo. La frase final sobre integración con backend requiere confirmación docente y no se declara implementada.
Las imágenes originales provienen de [SkyOpsV2](https://github.com/kr1ssk/SkyOpsV2/tree/04efbe37a9f3fcf1a834c32cb853c5b34beeee9b/assets/img).

## Resultado verificado

Diez pruebas aprobadas, compilación correcta y cobertura de líneas de 78,80%.
[Evidencia final](https://github.com/kr1ssk/SkyOpsV3/actions/runs/38170208905).
La cobertura y sus limitaciones se detallan en el informe de testing.
