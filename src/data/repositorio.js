import { validarProducto } from "../utils/validaciones.js";

export function leerProductos(datos) {
  return datos.productos;
}

  export function guardarProducto(datos, producto) {
    const errores = validarProducto(producto);

    if (Object.keys(errores).length > 0) {
      throw new Error("Revisa los datos del producto.");
    }

    const pn = producto.pn.trim().toUpperCase();

    const repetido = datos.productos.some(
      (p) => p.pn.toUpperCase() === pn && p.id !== producto.id
    );

    if (repetido) {
      throw new Error("Ya existe un producto con ese número de parte.");
    }

    const itemCarrito = datos.carrito.find(
      (item) => item.productoId === producto.id
    );

    if (itemCarrito && producto.stock < itemCarrito.cantidad) {
      throw new Error(
        "El stock no puede ser menor a la cantidad del manifiesto."
      );
    }

    const productoGuardado = {
      ...producto,
      nombre: producto.nombre.trim(),
      pn,
      categoria: producto.categoria.trim(),
      descripcion: producto.descripcion.trim(),
      ubicacion: producto.ubicacion.trim(),
      imagen: producto.imagen.trim(),
    };

    let productos;

    if (producto.id === null) {
      productos = [
        ...datos.productos,
        { ...productoGuardado, id: crypto.randomUUID() },
      ];
    } else {
      productos = datos.productos.map((p) =>
        p.id === producto.id ? productoGuardado : p
      );
    }

    return { ...datos, productos };
  }

  export function borrarProducto(datos, productoId) {
    const enCarrito = datos.carrito.some(
      (item) => item.productoId === productoId
    );

    if (enCarrito) {
      throw new Error(
        "Quita el producto del manifiesto antes de eliminarlo."
      );
    }

    const productos = datos.productos.filter(
      (p) => p.id !== productoId
    );

    return { ...datos, productos };
  }

