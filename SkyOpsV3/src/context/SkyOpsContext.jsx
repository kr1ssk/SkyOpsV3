import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { crearDatosIniciales } from "../data/semilla";
import {
  agregarAlCarrito,
  cambiarCantidad,
  quitarDelCarrito,
  procesarCompra,
} from "../utils/negocio";
import { validarProducto, validarCheckout } from "../utils/validaciones";

const SkyOpsContext = createContext(null);
const CLAVE = "skyops_v3";

function leerDatos() {
  try {
    const guardados = localStorage.getItem(CLAVE);

    if (!guardados) {
      return crearDatosIniciales();
    }

    const datos = JSON.parse(guardados);

    const listas = [
      "productos",
      "flota",
      "carrito",
      "pedidos",
      "contactos",
    ];

    if (!listas.every((lista) => Array.isArray(datos[lista]))) {
      return crearDatosIniciales();
    }

    return datos;
  } catch {
    return crearDatosIniciales();
  }
}

export function SkyOpsProvider({ children }) {
  const [datos, setDatos] = useState(leerDatos);
  const [errorAlmacenamiento, setErrorAlmacenamiento] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(datos));
      setErrorAlmacenamiento("");
    } catch {
      setErrorAlmacenamiento(
        "No se pudieron guardar los cambios en el navegador."
      );
    }
  }, [datos]);

  function agregarProducto(productoId) {
    const carrito = agregarAlCarrito(
      datos.productos,
      datos.carrito,
      productoId
    );

    setDatos({ ...datos, carrito });
  }

  function actualizarCantidad(productoId, cantidad) {
    const carrito = cambiarCantidad(
      datos.productos,
      datos.carrito,
      productoId,
      cantidad
    );

    setDatos({ ...datos, carrito });
  }

  function eliminarDelCarrito(productoId) {
    const carrito = quitarDelCarrito(datos.carrito, productoId);

    setDatos({ ...datos, carrito });
  }

  function confirmarCompra(entrega, aprobada) {
    const errores = validarCheckout(entrega);

    if (Object.keys(errores).length > 0) {
      throw new Error("Revisa los datos de entrega.");
    }

    const entregaNormalizada = {
      ...entrega,
      matricula: entrega.matricula.trim().toUpperCase(),
      licencia: entrega.licencia.trim().toUpperCase(),
      ingeniero: entrega.ingeniero.trim(),
      correo: entrega.correo.trim(),
      direccion: entrega.direccion.trim(),
    };

    const resultado = procesarCompra(
      datos,
      entregaNormalizada,
      aprobada
    );

    setDatos(resultado.datos);

    return resultado.pedido;
  }

  function guardarProducto(producto) {
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

    setDatos({ ...datos, productos });
  }

  function borrarProducto(productoId) {
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

    setDatos({ ...datos, productos });
  }

  function resolverPedido(pedidoId) {
    const pedidos = datos.pedidos.map((pedido) =>
      pedido.id === pedidoId && pedido.estado === "Pendiente"
        ? { ...pedido, estado: "Resuelto" }
        : pedido
    );

    setDatos({ ...datos, pedidos });
  }

  function guardarContacto(contacto) {
    const nuevo = {
      ...contacto,
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
    };

    setDatos({
      ...datos,
      contactos: [nuevo, ...datos.contactos],
    });
  }

  return (
    <SkyOpsContext.Provider
      value={{
        datos,
        errorAlmacenamiento,
        agregarProducto,
        actualizarCantidad,
        eliminarDelCarrito,
        confirmarCompra,
        guardarProducto,
        borrarProducto,
        resolverPedido,
        guardarContacto,
      }}
    >
      {children}
    </SkyOpsContext.Provider>
  );
}

export function useSkyOps() {
  return useContext(SkyOpsContext);
}