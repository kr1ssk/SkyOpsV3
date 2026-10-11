import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App.jsx";
import { SkyOpsProvider } from "../src/context/SkyOpsContext.jsx";
import { crearDatosIniciales } from "../src/data/semilla.js";

describe("Flujos y vistas del anexo", () => {
  let datos, guardar;
  beforeEach(() => {
    datos = crearDatosIniciales();
    spyOn(localStorage, "getItem").and.callFake(() => JSON.stringify(datos));
    guardar = spyOn(localStorage, "setItem").and.stub();
  });
  afterEach(cleanup);
  function mostrar(ruta, administrador = false) {
    if (administrador) datos.sesionId = "admin-demo";
    render(<MemoryRouter initialEntries={[ruta]}><SkyOpsProvider><App /></SkyOpsProvider></MemoryRouter>);
  }
  function escribir(etiqueta, valor) {
    fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
  }
  function ultimosDatos() { return JSON.parse(guardar.calls.mostRecent().args[1]); }
  function completarCheckout() {
    escribir("Matrícula de aeronave", "CC-BFA");
    escribir("Nombre y apellido del ingeniero", "Ana Pérez");
    escribir("Licencia del ingeniero", "AA-1234");
    escribir("Correo electrónico", "ana@example.com");
    escribir("Dirección de entrega o retiro", "Hangar aeropuerto");
    escribir("Aeropuerto de destino", "SCL");
    escribir("Forma de entrega", "Retiro en bodega");
    fireEvent.click(screen.getByLabelText(/Confirmo que revisaré/));
  }
  it("F01 visitante no puede abrir administración", () => {
    mostrar("/admin");
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Dashboard de SkyOps" })).toBeNull();
  });
  it("F02 cliente no puede abrir administración", () => {
    datos.usuarios.push({ id: "cliente", nombre: "Ana Pérez", correo: "ana@example.com", clave: "Prueba123", rol: "cliente", direccion: "", licencia: "" });
    datos.sesionId = "cliente";
    mostrar("/admin/usuarios");
    expect(screen.getByRole("heading", { name: "Mi perfil" })).toBeTruthy();
  });
  it("F03 registro inválido muestra errores sin guardar", () => {
    mostrar("/registro");
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    expect(screen.getByText("Ingresa el nombre.")).toBeTruthy();
    expect(ultimosDatos().usuarios.length).toBe(1);
  });
  it("F04 registra cliente y permite iniciar sesión", () => {
    mostrar("/registro");
    escribir("Nombre completo", "Ana Pérez"); escribir("Correo de la cuenta", "ana@example.com");
    escribir("Contraseña", "Prueba123"); escribir("Repetir contraseña", "Prueba123");
    escribir("Dirección de entrega", "Hangar aeropuerto"); escribir("Licencia del responsable", "AA-1234");
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeTruthy();
    escribir("Correo de la cuenta", "ana@example.com"); escribir("Contraseña", "Prueba123");
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(screen.getByRole("heading", { name: "Mi perfil" })).toBeTruthy();
    expect(ultimosDatos().sesionId).toBe(ultimosDatos().usuarios[1].id);
  });
  it("F05 login inválido muestra un error", () => {
    mostrar("/login");
    escribir("Correo de la cuenta", "admin@skyops.cl"); escribir("Contraseña", "incorrecta");
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(screen.getByRole("alert").textContent).toContain("incorrectos");
  });
  it("F06 checkout autocompleta los datos de la cuenta", () => {
    datos.usuarios[0].direccion = "Hangar aeropuerto"; datos.usuarios[0].licencia = "AA-1234";
    datos.carrito = [{ productoId: 1, cantidad: 1 }];
    mostrar("/checkout", true);
    expect(screen.getByLabelText("Nombre y apellido del ingeniero").value).toBe("Administrador SkyOps");
    expect(screen.getByLabelText("Dirección de entrega o retiro").value).toBe("Hangar aeropuerto");
    expect(screen.getByLabelText("Licencia del ingeniero").value).toBe("AA-1234");
  });
  it("F07 checkout aprobado muestra comprobante y actualiza los datos", () => {
    datos.carrito = [{ productoId: 1, cantidad: 1 }];
    mostrar("/checkout");
    completarCheckout();
    fireEvent.click(screen.getByRole("button", { name: "Confirmar compra" }));
    expect(screen.getByRole("heading", { name: "Compra confirmada" })).toBeTruthy();
    expect(ultimosDatos().productos[0].stock).toBe(3);
    expect(ultimosDatos().carrito.length).toBe(0);
  });
  it("F08 checkout rechazado permite reintentar sin descontar stock", () => {
    datos.carrito = [{ productoId: 1, cantidad: 1 }];
    mostrar("/checkout"); completarCheckout();
    escribir("Resultado del pago simulado", "rechazada");
    fireEvent.click(screen.getByRole("button", { name: "Confirmar compra" }));
    expect(screen.getByRole("heading", { name: "Compra rechazada" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reintentar compra" })).toBeTruthy();
    expect(ultimosDatos().productos[0].stock).toBe(4);
  });
  it("F09 dashboard y reportes reflejan compras", () => {
    datos.pedidos = [{ id: "p1", estado: "Pendiente", total: 100, lineas: [{ cantidad: 2 }], entrega: {} }];
    mostrar("/admin", true);
    expect(screen.getByRole("heading", { name: "Dashboard de SkyOps" })).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: "Reportes" }));
    const fila = screen.getByText("Unidades vendidas").closest("tr");
    expect(within(fila).getByText("2")).toBeTruthy();
  });
  it("F10 stock crítico incluye agotados y pocas unidades", () => {
    datos.productos[0].stock = 0;
    mostrar("/admin/stock", true);
    expect(screen.getByRole("heading", { name: "Stock crítico" })).toBeTruthy();
    expect(screen.getByText("Actuador de Superficie de Control")).toBeTruthy();
    expect(screen.getByText("Álabe de Turbina")).toBeTruthy();
  });
  it("F11 crea y edita categoría desde su formulario", () => {
    mostrar("/admin/categorias", true);
    escribir("Nombre de categoría", "ATA 28");
    fireEvent.click(screen.getByRole("button", { name: "Guardar categoría" }));
    expect(ultimosDatos().categorias.length).toBe(4);
    fireEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]);
    escribir("Nombre de categoría", "ATA 29");
    fireEvent.click(screen.getByRole("button", { name: "Guardar categoría" }));
    expect(ultimosDatos().productos[0].categoria).toBe("ATA 29");
  });
  it("F12 impide eliminar categoría con productos asociados", () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar("/admin/categorias", true);
    fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(screen.getByRole("alert").textContent).toContain("productos asociados");
  });
  it("F13 crea, muestra y edita usuario", () => {
    mostrar("/admin/usuarios", true);
    escribir("Nombre completo", "Ana Pérez"); escribir("Correo de la cuenta", "ana@example.com");
    escribir("Contraseña", "Prueba123");
    fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
    expect(ultimosDatos().usuarios.length).toBe(2);
    fireEvent.click(screen.getAllByRole("button", { name: "Ver" })[1]);
    expect(screen.getByRole("heading", { name: "Detalle del usuario" })).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Editar" })[1]);
    escribir("Nombre completo", "Ana Rivera");
    fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
    expect(ultimosDatos().usuarios[1].nombre).toBe("Ana Rivera");
  });
  it("F14 muestra nosotros, blog y las dos publicaciones", () => {
    mostrar("/nosotros");
    expect(screen.getByRole("heading", { name: "Nosotros" })).toBeTruthy();
    cleanup();
    mostrar("/blog");
    expect(screen.getAllByRole("button", { name: "Leer publicación" }).length).toBe(2);
    fireEvent.click(screen.getAllByRole("button", { name: "Leer publicación" })[0]);
    expect(screen.getByRole("heading", { name: "Cómo buscar un repuesto por categoría ATA" })).toBeTruthy();
  });
  it("F15 ofertas excluye productos sin descuento", () => {
    mostrar("/ofertas");
    expect(screen.getByRole("heading", { name: "Ofertas de repuestos" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Actuador de Tren Principal" })).toBeNull();
  });
  it("F16 guarda perfil y permite cerrar sesión", () => {
    mostrar("/perfil", true);
    escribir("Nombre completo", "Administrador Actualizado");
    fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
    expect(ultimosDatos().usuarios[0].nombre).toBe("Administrador Actualizado");
    fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeTruthy();
    expect(ultimosDatos().sesionId).toBeNull();
  });
  it("F17 muestra categoría y detalle de producto", () => {
    mostrar("/categorias");
    fireEvent.click(screen.getAllByRole("button", { name: "Ver repuestos" })[0]);
    expect(screen.getByRole("heading", { name: "Actuador de Superficie de Control" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Álabe de Turbina" })).toBeNull();
  });
  it("F18 muestra un pedido y permite resolverlo", () => {
    datos.pedidos = [{ id: "p1", fecha: "2026-10-11T12:00:00Z", estado: "Pendiente", total: 100, lineas: [], entrega: { matricula: "CC-BFA", destino: "SCL" } }];
    mostrar("/admin/ordenes", true);
    fireEvent.click(screen.getByRole("button", { name: "Marcar resuelto" }));
    expect(ultimosDatos().pedidos[0].estado).toBe("Resuelto");
    fireEvent.click(screen.getByRole("button", { name: "Ver resumen" }));
    expect(screen.getByRole("heading", { name: "Compra confirmada" })).toBeTruthy();
  });
});
