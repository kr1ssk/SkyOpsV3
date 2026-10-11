export function formatoPrecio(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function precioFinal(producto) {
  return Math.round(
    producto.precio * (1 - producto.descuento / 100)
  );
}

// El carrito guarda el ID y la cantidad.
// Aquí agregamos la información del producto.
export function obtenerLineas(productos, carrito) {
  return carrito.map((item) => {
    const producto = productos.find((p) => p.id === item.productoId);

    return {
      ...producto,
      cantidad: item.cantidad,
      precioUnitario: precioFinal(producto),
      subtotal: precioFinal(producto) * item.cantidad,
    };
  });
}

export function calcularTotal(productos, carrito) {
  const lineas = obtenerLineas(productos, carrito);

  return lineas.reduce((total, linea) => total + linea.subtotal, 0);
}

export function agregarAlCarrito(productos, carrito, productoId) {
  const producto = productos.find((p) => p.id === productoId);

  if (!producto) {
    throw new Error("El producto no existe.");
  }

  const item = carrito.find((p) => p.productoId === productoId);
  const cantidadActual = item ? item.cantidad : 0;

  if (cantidadActual + 1 > producto.stock) {
    throw new Error("No hay más unidades disponibles.");
  }

  if (item) {
    return carrito.map((p) =>
      p.productoId === productoId
        ? { ...p, cantidad: p.cantidad + 1 }
        : p
    );
  }

  return [...carrito, { productoId, cantidad: 1 }];
}

export function cambiarCantidad(
  productos,
  carrito,
  productoId,
  cantidad
) {
  const producto = productos.find((p) => p.id === productoId);

  if (
    !producto ||
    !Number.isInteger(cantidad) ||
    cantidad < 1 ||
    cantidad > producto.stock
  ) {
    throw new Error("La cantidad debe estar entre 1 y el stock disponible.");
  }

  return carrito.map((item) =>
    item.productoId === productoId
      ? { ...item, cantidad }
      : item
  );
}

export function quitarDelCarrito(carrito, productoId) {
  return carrito.filter((item) => item.productoId !== productoId);
}

// Es una simulación de compra para el proyecto académico.
export function procesarCompra(datos, entrega, aprobada) {
  if (datos.carrito.length === 0) {
    throw new Error("El manifiesto está vacío.");
  }

  // Comprobamos nuevamente el stock antes de comprar.
  datos.carrito.forEach((item) => {
    const producto = datos.productos.find(
      (p) => p.id === item.productoId
    );

    if (
      !producto ||
      !Number.isInteger(item.cantidad) ||
      item.cantidad < 1 ||
      item.cantidad > producto.stock
    ) {
      throw new Error("El stock cambió. Revisa el manifiesto.");
    }
  });

  const pedido = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    entrega: { ...entrega },
    lineas: obtenerLineas(datos.productos, datos.carrito),
    total: calcularTotal(datos.productos, datos.carrito),
    estado: aprobada ? "Pendiente" : "Rechazado",
  };

  if (!aprobada) {
    return {
      pedido,
      datos: {
        ...datos,
        pedidos: [pedido, ...datos.pedidos],
      },
    };
  }

  const productos = datos.productos.map((producto) => {
    const item = datos.carrito.find(
      (p) => p.productoId === producto.id
    );

    return item
      ? { ...producto, stock: producto.stock - item.cantidad }
      : producto;
  });

  return {
    pedido,
    datos: {
      ...datos,
      productos,
      carrito: [],
      pedidos: [pedido, ...datos.pedidos],
    },
  };
}