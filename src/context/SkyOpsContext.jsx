import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { crearDatosIniciales } from "../data/semilla.js";
import {
  agregarAlCarrito,
  cambiarCantidad,
  quitarDelCarrito,
  procesarCompra,
} from "../utils/negocio.js";
import { guardarProducto as guardarProductoEnDatos, borrarProducto as borrarProductoEnDatos } from "../data/repositorio.js";
import { validarCheckout } from "../utils/validaciones.js";

export const SkyOpsContext = createContext(null);
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
    setDatos(guardarProductoEnDatos(datos, producto));
  }

  function borrarProducto(productoId) {
    setDatos(borrarProductoEnDatos(datos, productoId));
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