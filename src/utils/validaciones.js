export function validarProducto(producto) {
  const errores = {};

  if (producto.nombre.trim().length < 3) {
    errores.nombre = "Escribe un nombre de al menos 3 caracteres.";
  }

  if (!producto.pn.trim()) {
    errores.pn = "Ingresa el número de parte.";
  }

  if (!producto.categoria.trim()) {
    errores.categoria = "Ingresa una categoría.";
  }

  if (!producto.descripcion.trim()) {
    errores.descripcion = "Ingresa una descripción.";
  }

  if (!producto.ubicacion.trim()) {
    errores.ubicacion = "Ingresa la ubicación.";
  }

  if (
    !Number.isInteger(producto.stock) ||
    producto.stock < 0
  ) {
    errores.stock = "El stock debe ser un número entero igual o mayor a 0.";
  }

  if (
    !Number.isInteger(producto.precio) ||
    producto.precio <= 0
  ) {
    errores.precio = "El precio debe ser un número entero mayor a 0.";
  }

  if (
    !Number.isFinite(producto.descuento) ||
    producto.descuento < 0 ||
    producto.descuento > 100
  ) {
    errores.descuento = "El descuento debe estar entre 0 y 100.";
  }

  // La imagen se guarda como nombre de archivo local.
  if (
    producto.imagen &&
    !/^[a-zA-Z0-9_-]+\.(svg|png|jpg|jpeg|webp)$/i.test(producto.imagen)
  ) {
    errores.imagen = "Usa un nombre como repuesto.svg o repuesto.jpg.";
  }

  return errores;
}

export function validarCheckout(datos) {
  const errores = {};

  if (!/^[A-Z]{2}-[A-Z]{3}$/.test(datos.matricula.trim().toUpperCase())) {
    errores.matricula = "Usa el formato CC-BFA.";
  }

  if (datos.ingeniero.trim().split(/\s+/).length < 2) {
    errores.ingeniero = "Ingresa nombre y apellido.";
  }

  if (!/^[A-Z]{2}-\d{4}$/.test(datos.licencia.trim().toUpperCase())) {
    errores.licencia = "Usa el formato AA-1234.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
    errores.correo = "Ingresa un correo válido.";
  }

  if (datos.direccion.trim().length < 5) {
    errores.direccion = "Ingresa una dirección de entrega.";
  }

  if (!["SCL", "ANF", "CCP", "IQQ"].includes(datos.destino)) {
    errores.destino = "Selecciona un aeropuerto.";
  }

  if (!["Retiro en bodega", "Despacho a aeropuerto"].includes(datos.tipoEntrega)) {
    errores.tipoEntrega = "Selecciona una forma de entrega.";
  }

  if (!datos.declaracion) {
    errores.declaracion = "Debes confirmar la revisión de los repuestos.";
  }

  return errores;
}

export function validarContacto(datos) {
  const errores = {};

  if (datos.nombre.trim().length < 3) {
    errores.nombre = "Ingresa tu nombre.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
    errores.correo = "Ingresa un correo válido.";
  }

  if (datos.mensaje.trim().length < 20) {
    errores.mensaje = "Escribe un mensaje de al menos 20 caracteres.";
  }

  return errores;
}