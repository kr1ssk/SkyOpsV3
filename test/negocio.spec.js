import { crearDatosIniciales } from "../src/data/semilla";

import {
  agregarAlCarrito,
  calcularTotal,
  cambiarCantidad,
  precioFinal,
  procesarCompra,
  quitarDelCarrito,
} from "../src/utils/negocio";

import {
  validarCheckout,
  validarContacto,
  validarProducto,
} from "../src/utils/validaciones";

describe("Funciones de negocio de SkyOps", () => {
  let datos;

  const entrega = {
    matricula: "CC-BFA",
    ingeniero: "Cristian Rivera",
    licencia: "AA-1234",
    correo: "ingeniero@example.com",
    direccion: "Hangar 2 aeropuerto",
    destino: "SCL",
    tipoEntrega: "Despacho a aeropuerto",
    declaracion: true,
  };

  beforeEach(() => {
    datos = crearDatosIniciales();
  });

  it("B01 aplica el descuento del producto", () => {
    expect(precioFinal(datos.productos[0])).toBe(765000);
  });

  it("B02 agrega un producto al carrito", () => {
    const carrito = agregarAlCarrito(datos.productos, [], 1);

    expect(carrito).toEqual([
      { productoId: 1, cantidad: 1 },
    ]);
  });

  it("B03 aumenta la cantidad al agregar el mismo producto", () => {
    const carrito = agregarAlCarrito(
      datos.productos,
      [{ productoId: 1, cantidad: 1 }],
      1
    );

    expect(carrito[0].cantidad).toBe(2);
  });

  it("B04 impide superar el stock", () => {
    expect(() =>
      agregarAlCarrito(
        datos.productos,
        [{ productoId: 2, cantidad: 1 }],
        2
      )
    ).toThrowError("No hay más unidades disponibles.");
  });

  it("B05 rechaza una cantidad decimal", () => {
    expect(() =>
      cambiarCantidad(
        datos.productos,
        [{ productoId: 1, cantidad: 1 }],
        1,
        1.5
      )
    ).toThrowError();
  });

  it("B06 elimina un producto del carrito", () => {
    const carrito = quitarDelCarrito(
      [{ productoId: 1, cantidad: 1 }],
      1
    );

    expect(carrito.length).toBe(0);
  });

  it("B07 calcula el total con descuentos", () => {
    const carrito = [
      { productoId: 1, cantidad: 2 },
      { productoId: 2, cantidad: 1 },
    ];

    expect(calcularTotal(datos.productos, carrito)).toBe(2780000);
  });

  it("B08 una compra aprobada descuenta stock y vacía el carrito", () => {
    datos.carrito = [{ productoId: 1, cantidad: 2 }];

    const resultado = procesarCompra(datos, entrega, true);

    expect(resultado.datos.productos[0].stock).toBe(2);
    expect(resultado.datos.carrito.length).toBe(0);
    expect(resultado.pedido.estado).toBe("Pendiente");

    // Los datos recibidos no se modifican directamente.
    expect(datos.productos[0].stock).toBe(4);
  });

  it("B09 una compra rechazada conserva stock y carrito", () => {
    datos.carrito = [{ productoId: 1, cantidad: 1 }];

    const resultado = procesarCompra(datos, entrega, false);

    expect(resultado.datos.productos[0].stock).toBe(4);
    expect(resultado.datos.carrito.length).toBe(1);
    expect(resultado.pedido.estado).toBe("Rechazado");
  });

  it("B10 valida los datos del checkout", () => {
    expect(validarCheckout(entrega)).toEqual({});

    const errores = validarCheckout({
      ...entrega,
      matricula: "incorrecta",
      declaracion: false,
    });

    expect(errores.matricula).toBeDefined();
    expect(errores.declaracion).toBeDefined();
  });

  it("B11 rechaza stock y precio inválidos", () => {
    const errores = validarProducto({
      ...datos.productos[0],
      stock: -1,
      precio: 0,
    });

    expect(errores.stock).toBeDefined();
    expect(errores.precio).toBeDefined();
  });

  it("B12 valida el formulario de contacto", () => {
    const errores = validarContacto({
      nombre: "Ana",
      correo: "correo-invalido",
      mensaje: "Hola",
    });

    expect(errores.correo).toBeDefined();
    expect(errores.mensaje).toBeDefined();
  });
});