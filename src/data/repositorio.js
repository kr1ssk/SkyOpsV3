import { validarProducto } from "../utils/validaciones.js";

export function leerProductos(datos) {
  return datos.productos;
}

  export function guardarProducto(datos, producto) {
    const errores = validarProducto(producto);

    if (Object.keys(errores).length > 0) {
      throw new Error("Revisa los datos del producto.");
    }

    if (datos.categorias && !datos.categorias.some(c => c.nombre === producto.categoria.trim().toUpperCase())) {
      throw new Error("Selecciona una categoría registrada.");
    }
    if (producto.id !== null && !datos.productos.some(p => p.id === producto.id)) throw new Error("El producto no existe.");

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
      categoria: producto.categoria.trim().toUpperCase(),
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


export function validarUsuario(usuario, nuevaClave = true) {
  const errores = {};
  if (!usuario.nombre?.trim()) errores.nombre = "Ingresa el nombre.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.correo?.trim() || "")) errores.correo = "Ingresa un correo válido.";
  if ((nuevaClave || usuario.clave) && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(usuario.clave || "")) errores.clave = "Usa al menos 8 caracteres con letras y números.";
  if (!["cliente", "admin"].includes(usuario.rol)) errores.rol = "Selecciona un rol válido.";
  return errores;
}

export function guardarUsuario(datos, usuario) {
  if (Object.keys(validarUsuario(usuario, usuario.id === null)).length) throw new Error("Revisa los datos del usuario.");
  const correo = usuario.correo.trim().toLowerCase();
  if (datos.usuarios.some(u => u.correo === correo && u.id !== usuario.id)) throw new Error("Ese correo ya está registrado.");
  const anterior = datos.usuarios.find(u => u.id === usuario.id);
  if (usuario.id !== null && !anterior) throw new Error("El usuario no existe.");
  if (anterior?.rol === "admin" && usuario.rol !== "admin" && datos.usuarios.filter(u => u.rol === "admin").length === 1) throw new Error("Debe quedar al menos un administrador.");
  const guardado = { id: usuario.id ?? crypto.randomUUID(), nombre: usuario.nombre.trim(), correo,
    clave: usuario.clave || anterior.clave, rol: usuario.rol,
    direccion: usuario.direccion?.trim() || "", licencia: usuario.licencia?.trim() || "" };
  const usuarios = anterior ? datos.usuarios.map(u => u.id === guardado.id ? guardado : u) : [...datos.usuarios, guardado];
  return { ...datos, usuarios };
}

export function borrarUsuario(datos, id) {
  if (datos.sesionId === id) throw new Error("No puedes eliminar tu propia cuenta.");
  const usuario = datos.usuarios.find(u => u.id === id);
  if (!usuario) throw new Error("El usuario no existe.");
  if (usuario.rol === "admin" && datos.usuarios.filter(u => u.rol === "admin").length === 1) throw new Error("Debe quedar al menos un administrador.");
  return { ...datos, usuarios: datos.usuarios.filter(u => u.id !== id) };
}

export function iniciarSesion(datos, correo, clave) {
  const usuario = datos.usuarios.find(u => u.correo === correo.trim().toLowerCase() && u.clave === clave);
  if (!usuario) throw new Error("Correo o contraseña incorrectos.");
  return { ...datos, sesionId: usuario.id };
}

export function guardarCategoria(datos, categoria) {
  const nombre = categoria.nombre.trim().toUpperCase();
  if (!/^ATA \d{2}$/.test(nombre)) throw new Error("Usa el formato ATA 27.");
  if (datos.categorias.some(c => c.nombre === nombre && c.id !== categoria.id)) throw new Error("La categoría ya existe.");
  const anterior = datos.categorias.find(c => c.id === categoria.id);
  if (categoria.id !== null && !anterior) throw new Error("La categoría no existe.");
  const nueva = { id: categoria.id ?? crypto.randomUUID(), nombre };
  return { ...datos,
    categorias: anterior ? datos.categorias.map(c => c.id === nueva.id ? nueva : c) : [...datos.categorias, nueva],
    productos: anterior ? datos.productos.map(p => p.categoria === anterior.nombre ? { ...p, categoria: nombre } : p) : datos.productos };
}

export function borrarCategoria(datos, id) {
  const categoria = datos.categorias.find(c => c.id === id);
  if (!categoria) throw new Error("La categoría no existe.");
  if (datos.productos.some(p => p.categoria === categoria.nombre)) throw new Error("La categoría tiene productos asociados.");
  return { ...datos, categorias: datos.categorias.filter(c => c.id !== id) };
}
