import { act, cleanup, renderHook } from "@testing-library/react";
import { SkyOpsProvider, useSkyOps } from "../src/context/SkyOpsContext.jsx";
import { crearDatosIniciales } from "../src/data/semilla.js";

describe("Estado y persistencia reales", () => {
  let guardado;
  const entrega = { matricula: "cc-bfa", ingeniero: "Ana Pérez", licencia: "aa-1234", correo: "ana@example.com", direccion: "Hangar aeropuerto", destino: "SCL", tipoEntrega: "Retiro en bodega", declaracion: true };
  const cliente = { nombre: "Ana Pérez", correo: "ana@example.com", clave: "Prueba123", direccion: "Hangar aeropuerto", licencia: "AA-1234" };
  beforeEach(() => {
    guardado = null;
    spyOn(localStorage, "getItem").and.callFake(() => guardado);
    spyOn(localStorage, "setItem").and.callFake((clave, valor) => { guardado = valor; });
  });
  afterEach(cleanup);
  function montar(datos) {
    if (datos) guardado = JSON.stringify(datos);
    return renderHook(() => useSkyOps(), { wrapper: SkyOpsProvider });
  }
  function admin() {
    const datos = crearDatosIniciales(); datos.sesionId = "admin-demo"; return montar(datos);
  }
  it("P01 recupera carrito y sesión al volver a montar", () => {
    const h = admin();
    act(() => h.result.current.agregarProducto(1));
    h.unmount();
    const nuevo = montar();
    expect(nuevo.result.current.datos.carrito).toEqual([{ productoId: 1, cantidad: 1 }]);
    expect(nuevo.result.current.usuario.rol).toBe("admin");
  });
  it("P02 aumenta, cambia y elimina cantidades", () => {
    const h = montar();
    act(() => h.result.current.agregarProducto(1));
    act(() => h.result.current.agregarProducto(1));
    expect(h.result.current.datos.carrito[0].cantidad).toBe(2);
    act(() => h.result.current.actualizarCantidad(1, 3));
    expect(h.result.current.datos.carrito[0].cantidad).toBe(3);
    act(() => h.result.current.eliminarDelCarrito(1));
    expect(h.result.current.datos.carrito.length).toBe(0);
  });
  it("P03 compra aprobada actualiza stock, normaliza datos y vincula usuario", () => {
    const h = admin();
    act(() => h.result.current.agregarProducto(1));
    let pedido;
    act(() => { pedido = h.result.current.confirmarCompra(entrega, true); });
    expect(pedido.entrega.matricula).toBe("CC-BFA");
    expect(pedido.entrega.usuarioId).toBe("admin-demo");
    expect(h.result.current.datos.productos[0].stock).toBe(3);
    expect(h.result.current.datos.carrito.length).toBe(0);
    expect(JSON.parse(guardado).pedidos[0].id).toBe(pedido.id);
    act(() => h.result.current.resolverPedido(pedido.id));
    expect(h.result.current.datos.pedidos[0].estado).toBe("Resuelto");
  });
  it("P04 compra rechazada conserva stock y manifiesto", () => {
    const h = montar();
    act(() => h.result.current.agregarProducto(1));
    act(() => h.result.current.confirmarCompra(entrega, false));
    expect(h.result.current.datos.productos[0].stock).toBe(4);
    expect(h.result.current.datos.carrito.length).toBe(1);
    expect(h.result.current.datos.pedidos[0].estado).toBe("Rechazado");
  });
  it("P05 no registra checkout inválido", () => {
    const h = montar();
    expect(() => h.result.current.confirmarCompra({ ...entrega, direccion: "" }, true)).toThrowError();
    expect(h.result.current.datos.pedidos.length).toBe(0);
  });
  it("P06 crea, edita y elimina producto mediante el proveedor", () => {
    const h = admin();
    act(() => h.result.current.guardarProducto({ ...h.result.current.datos.productos[0], id: null, pn: "PN-PRUEBA" }));
    const nuevo = h.result.current.datos.productos[3];
    act(() => h.result.current.guardarProducto({ ...nuevo, stock: 9 }));
    expect(h.result.current.datos.productos[3].stock).toBe(9);
    act(() => h.result.current.borrarProducto(nuevo.id));
    expect(h.result.current.datos.productos.length).toBe(3);
  });
  it("P07 bloquea modificaciones administrativas de un visitante", () => {
    const h = montar();
    expect(() => h.result.current.borrarProducto(1)).toThrowError();
    expect(() => h.result.current.guardarCategoria({ id: null, nombre: "ATA 28" })).toThrowError();
    expect(() => h.result.current.actualizarPerfil(cliente)).toThrowError();
  });
  it("P08 registra, inicia sesión, actualiza perfil y cierra sesión", () => {
    const h = montar();
    act(() => h.result.current.registrarUsuario(cliente));
    act(() => h.result.current.iniciarSesion(cliente.correo, cliente.clave));
    expect(h.result.current.usuario.rol).toBe("cliente");
    act(() => h.result.current.actualizarPerfil({ ...cliente, clave: "", nombre: "Ana Rivera", rol: "admin" }));
    expect(h.result.current.usuario.nombre).toBe("Ana Rivera");
    expect(h.result.current.usuario.rol).toBe("cliente");
    act(() => h.result.current.cerrarSesion());
    expect(h.result.current.usuario).toBeNull();
  });
  it("P09 gestiona categorías desde el proveedor", () => {
    const h = admin();
    act(() => h.result.current.guardarCategoria({ id: null, nombre: "ATA 28" }));
    const c = h.result.current.datos.categorias[3];
    act(() => h.result.current.guardarCategoria({ ...c, nombre: "ATA 29" }));
    expect(h.result.current.datos.categorias[3].nombre).toBe("ATA 29");
    act(() => h.result.current.borrarCategoria(c.id));
    expect(h.result.current.datos.categorias.length).toBe(3);
  });
  it("P10 gestiona usuarios desde el proveedor", () => {
    const h = admin();
    act(() => h.result.current.guardarUsuario({ ...cliente, id: null, rol: "cliente" }));
    const u = h.result.current.datos.usuarios[1];
    act(() => h.result.current.guardarUsuario({ ...u, nombre: "Ana Rivera", clave: "" }));
    expect(h.result.current.datos.usuarios[1].nombre).toBe("Ana Rivera");
    act(() => h.result.current.borrarUsuario(u.id));
    expect(h.result.current.datos.usuarios.length).toBe(1);
  });
  it("P11 guarda consulta con identificador y fecha", () => {
    const h = montar();
    act(() => h.result.current.guardarContacto({ nombre: "Ana", correo: "ana@example.com", mensaje: "Consulta de disponibilidad" }));
    expect(h.result.current.datos.contactos[0].id).toBeDefined();
    expect(JSON.parse(guardado).contactos.length).toBe(1);
  });
  it("P12 recupera datos iniciales ante JSON inválido", () => {
    guardado = "{invalido";
    const h = montar();
    expect(h.result.current.datos.productos.length).toBe(3);
  });
  it("P13 recupera datos iniciales si faltan listas", () => {
    const h = montar({ productos: [] });
    expect(h.result.current.datos.productos.length).toBe(3);
  });
  it("P14 migra datos anteriores conservando stock y pedidos", () => {
    const viejo = crearDatosIniciales();
    viejo.productos[0].stock = 2;
    delete viejo.usuarios; delete viejo.categorias; delete viejo.sesionId;
    const h = montar(viejo);
    expect(h.result.current.datos.productos[0].stock).toBe(2);
    expect(h.result.current.datos.usuarios[0].rol).toBe("admin");
    expect(h.result.current.datos.categorias.length).toBe(3);
  });
  it("P15 informa fallo al guardar y sigue mostrando la aplicación", () => {
    localStorage.setItem.and.throwError("Sin espacio");
    const h = montar();
    expect(h.result.current.errorAlmacenamiento).toContain("No se pudieron guardar");
    expect(h.result.current.datos.productos.length).toBe(3);
  });
});
