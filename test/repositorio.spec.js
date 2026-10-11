import { crearDatosIniciales } from "../src/data/semilla.js";
import { guardarProducto, borrarProducto, leerProductos, guardarCategoria, borrarCategoria, guardarUsuario, borrarUsuario, iniciarSesion, validarUsuario } from "../src/data/repositorio.js";
import { resumirPedidos } from "../src/utils/reportes.js";

describe("Repositorio de datos", () => {
  let datos;
  const cliente = { id: null, nombre: "Ana Pérez", correo: "ana@example.com", clave: "Prueba123", rol: "cliente", direccion: "Hangar 2", licencia: "AA-1234" };
  beforeEach(() => { datos = crearDatosIniciales(); });
  it("D01 crea, consulta, edita y elimina un producto sin mutar el original", () => {
    const nuevo = { ...datos.productos[0], id: null, pn: "PN-NUEVO" };
    const creado = guardarProducto(datos, nuevo);
    const id = creado.productos[3].id;
    expect(leerProductos(creado).length).toBe(4);
    const editado = guardarProducto(creado, { ...creado.productos[3], stock: 8 });
    expect(editado.productos[3].stock).toBe(8);
    expect(borrarProducto(editado, id).productos.length).toBe(3);
    expect(datos.productos.length).toBe(3);
  });
  it("D02 rechaza producto inválido, categoría inexistente y PN duplicado", () => {
    expect(() => guardarProducto(datos, { ...datos.productos[0], nombre: "" })).toThrowError();
    expect(() => guardarProducto(datos, { ...datos.productos[0], categoria: "ATA 99" })).toThrowError();
    expect(() => guardarProducto(datos, { ...datos.productos[0], id: null })).toThrowError();
  });
  it("D03 protege cantidades del manifiesto al editar o eliminar", () => {
    datos.carrito = [{ productoId: 1, cantidad: 3 }];
    expect(() => guardarProducto(datos, { ...datos.productos[0], stock: 2 })).toThrowError();
    expect(() => borrarProducto(datos, 1)).toThrowError();
  });
  it("D04 rechaza editar un producto inexistente", () => {
    expect(() => guardarProducto(datos, { ...datos.productos[0], id: "inexistente" })).toThrowError();
  });
  it("D05 crea y elimina una categoría vacía", () => {
    const creado = guardarCategoria(datos, { id: null, nombre: "ata 28" });
    expect(creado.categorias[3].nombre).toBe("ATA 28");
    expect(borrarCategoria(creado, creado.categorias[3].id).categorias.length).toBe(3);
  });
  it("D06 renombra categoría y productos asociados", () => {
    const editado = guardarCategoria(datos, { id: "ATA 27", nombre: "ATA 28" });
    expect(editado.productos[0].categoria).toBe("ATA 28");
    expect(datos.productos[0].categoria).toBe("ATA 27");
  });
  it("D07 rechaza categoría inválida, repetida o inexistente", () => {
    expect(() => guardarCategoria(datos, { id: null, nombre: "Motor" })).toThrowError();
    expect(() => guardarCategoria(datos, { id: null, nombre: "ATA 27" })).toThrowError();
    expect(() => guardarCategoria(datos, { id: "no", nombre: "ATA 28" })).toThrowError();
    expect(() => borrarCategoria(datos, "no")).toThrowError();
  });
  it("D08 impide eliminar una categoría utilizada", () => {
    expect(() => borrarCategoria(datos, "ATA 27")).toThrowError();
  });
  it("D09 registra usuario y normaliza el correo", () => {
    const creado = guardarUsuario(datos, { ...cliente, correo: " ANA@EXAMPLE.COM " });
    expect(creado.usuarios[1].correo).toBe("ana@example.com");
    expect(datos.usuarios.length).toBe(1);
  });
  it("D10 valida nombre, correo, clave y rol", () => {
    expect(Object.keys(validarUsuario({ nombre: "", correo: "", clave: "", rol: "otro" })).length).toBe(4);
    expect(validarUsuario(cliente)).toEqual({});
  });
  it("D11 impide duplicar un correo", () => {
    const creado = guardarUsuario(datos, cliente);
    expect(() => guardarUsuario(creado, cliente)).toThrowError();
  });
  it("D12 edita usuario conservando la clave si no se cambia", () => {
    const creado = guardarUsuario(datos, cliente);
    const u = creado.usuarios[1];
    const editado = guardarUsuario(creado, { ...u, nombre: "Ana Rivera", clave: "" });
    expect(editado.usuarios[1].nombre).toBe("Ana Rivera");
    expect(editado.usuarios[1].clave).toBe("Prueba123");
  });
  it("D13 acepta credenciales válidas y rechaza incorrectas", () => {
    expect(iniciarSesion(datos, "ADMIN@SKYOPS.CL", "Skyops123").sesionId).toBe("admin-demo");
    expect(() => iniciarSesion(datos, "admin@skyops.cl", "incorrecta")).toThrowError();
  });
  it("D14 impide eliminar la cuenta activa o quitar al último administrador", () => {
    datos.sesionId = "admin-demo";
    expect(() => borrarUsuario(datos, "admin-demo")).toThrowError();
    datos.sesionId = null;
    expect(() => borrarUsuario(datos, "admin-demo")).toThrowError();
    expect(() => guardarUsuario(datos, { ...datos.usuarios[0], rol: "cliente" })).toThrowError();
  });
  it("D15 elimina cliente y rechaza usuario inexistente", () => {
    const creado = guardarUsuario(datos, cliente);
    expect(borrarUsuario(creado, creado.usuarios[1].id).usuarios.length).toBe(1);
    expect(() => borrarUsuario(datos, "no")).toThrowError();
    expect(() => guardarUsuario(datos, { ...cliente, id: "no" })).toThrowError();
  });
  it("D16 calcula reportes excluyendo las compras rechazadas", () => {
    const pedidos = [
      { estado: "Pendiente", total: 200, lineas: [{ cantidad: 2 }] },
      { estado: "Resuelto", total: 100, lineas: [{ cantidad: 1 }] },
      { estado: "Rechazado", total: 999, lineas: [{ cantidad: 3 }] }
    ];
    expect(resumirPedidos(pedidos)).toEqual({ cantidad: 3, aprobados: 2, rechazados: 1, pendientes: 1, ingresos: 300, unidades: 3 });
    expect(resumirPedidos([]).ingresos).toBe(0);
  });
});
