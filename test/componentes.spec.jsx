import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App.jsx";
import { SkyOpsProvider } from "../src/context/SkyOpsContext.jsx";
import { crearDatosIniciales } from "../src/data/semilla.js";

// Las pruebas usan el estado real. Solo simulamos almacenamiento y confirmación.
describe("Diez pruebas de componentes de SkyOps", () => {
  let datos, guardado;
  beforeEach(() => {
    datos = crearDatosIniciales();
    guardado = null;
    spyOn(localStorage, "getItem").and.callFake(() => guardado || JSON.stringify(datos));
    spyOn(localStorage, "setItem").and.callFake((clave, valor) => { guardado = valor; });
  });
  afterEach(cleanup);
  function mostrar(ruta, admin = false) {
    if (admin) datos.sesionId = "admin-demo";
    return render(<MemoryRouter initialEntries={[ruta]}><SkyOpsProvider><App /></SkyOpsProvider></MemoryRouter>);
  }
  function escribir(etiqueta, valor) {
    fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
  }
  function actuales() { return JSON.parse(guardado); }
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
  it("C01 renderiza productos, filtra categoría y ofertas y abre detalle", () => {
    mostrar("/catalogo");
    expect(screen.getAllByRole("button", { name: "Agregar" }).length).toBe(3);
    escribir("Buscar repuesto", "Tren Principal");
    expect(screen.getByRole("heading", { name: "Actuador de Tren Principal" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Álabe de Turbina" })).toBeNull();
    escribir("Buscar repuesto", "");
    escribir("Categoría", "ATA 27");
    expect(screen.queryByRole("heading", { name: "Actuador de Tren Principal" })).toBeNull();
    cleanup(); mostrar("/ofertas");
    expect(screen.queryByRole("heading", { name: "Actuador de Tren Principal" })).toBeNull();
    cleanup(); mostrar("/catalogo/1");
    expect(screen.getByRole("heading", { name: "Actuador de Superficie de Control" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Agregar al manifiesto" }));
    expect(actuales().carrito[0]).toEqual({ productoId: 1, cantidad: 1 });
  });
  it("C02 actualiza cantidades y total del manifiesto y permite quitar", () => {
    datos.carrito = [{ productoId: 1, cantidad: 1 }];
    mostrar("/manifiesto");
    const cantidad = screen.getByRole("spinbutton");
    fireEvent.change(cantidad, { target: { value: "2" } });
    expect(actuales().carrito[0].cantidad).toBe(2);
    expect(screen.getByText(/Total:/).textContent.replace(/[^0-9]/g, "")).toBe("1530000");
    fireEvent.change(cantidad, { target: { value: "99" } });
    expect(screen.getByRole("alert").textContent).toContain("stock");
    expect(actuales().carrito[0].cantidad).toBe(2);
    fireEvent.click(screen.getByRole("button", { name: "Quitar" }));
    expect(actuales().carrito.length).toBe(0);
  });
  it("C03 valida registro y login, guarda perfil y cierra sesión", () => {
    mostrar("/registro");
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    expect(screen.getByText("Ingresa el nombre.")).toBeTruthy();
    expect(actuales().usuarios.length).toBe(1);
    escribir("Nombre completo", "Ana Pérez"); escribir("Correo de la cuenta", "ana@example.com");
    escribir("Contraseña", "Prueba123"); escribir("Repetir contraseña", "Prueba123");
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    escribir("Correo de la cuenta", "ana@example.com"); escribir("Contraseña", "incorrecta");
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(screen.getByRole("alert").textContent).toContain("incorrectos");
    escribir("Contraseña", "Prueba123");
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(screen.getByRole("heading", { name: "Mi perfil" })).toBeTruthy();
    escribir("Dirección de entrega", "Hangar aeropuerto");
    fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
    expect(actuales().usuarios[1].direccion).toBe("Hangar aeropuerto");
    fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(actuales().sesionId).toBeNull();
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeTruthy();
  });
  it("C04 restringe rutas administrativas según sesión y rol", () => {
    mostrar("/admin");
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeTruthy();
    cleanup();
    datos.usuarios.push({ id: "cliente", nombre: "Ana Pérez", correo: "ana@example.com", clave: "Prueba123", rol: "cliente", direccion: "", licencia: "" });
    datos.sesionId = "cliente"; guardado = null;
    mostrar("/admin/usuarios");
    expect(screen.getByRole("heading", { name: "Mi perfil" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Administración de usuarios" })).toBeNull();
  });
  it("C05 valida checkout, precarga perfil y confirma compra descontando stock", () => {
    datos.usuarios[0].direccion = "Hangar aeropuerto"; datos.usuarios[0].licencia = "AA-1234";
    datos.carrito = [{ productoId: 1, cantidad: 1 }];
    mostrar("/checkout", true);
    expect(screen.getByLabelText("Dirección de entrega o retiro").value).toBe("Hangar aeropuerto");
    expect(screen.getByLabelText("Licencia del ingeniero").value).toBe("AA-1234");
    fireEvent.click(screen.getByRole("button", { name: "Confirmar compra" }));
    expect(screen.getByText("Usa el formato CC-BFA.")).toBeTruthy();
    expect(actuales().pedidos.length).toBe(0);
    completarCheckout();
    fireEvent.click(screen.getByRole("button", { name: "Confirmar compra" }));
    expect(screen.getByRole("heading", { name: "Compra confirmada" })).toBeTruthy();
    expect(actuales().productos[0].stock).toBe(3);
    expect(actuales().carrito.length).toBe(0);
    expect(actuales().pedidos[0].entrega.usuarioId).toBe("admin-demo");
  });
  it("C06 compra rechazada conserva stock y permite reintentar", () => {
    datos.carrito = [{ productoId: 1, cantidad: 1 }];
    mostrar("/checkout"); completarCheckout();
    escribir("Resultado del pago simulado", "rechazada");
    fireEvent.click(screen.getByRole("button", { name: "Confirmar compra" }));
    expect(screen.getByRole("heading", { name: "Compra rechazada" })).toBeTruthy();
    expect(actuales().productos[0].stock).toBe(4);
    expect(actuales().carrito.length).toBe(1);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar compra" }));
    expect(screen.getByRole("heading", { name: "Checkout" })).toBeTruthy();
  });
  it("C07 crea, muestra, edita y elimina un producto desde administración", () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar("/admin/productos", true);
    fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
    expect(screen.getByText("Ingresa el número de parte.")).toBeTruthy();
    escribir("Nombre", "Filtro aeronáutico"); escribir("Número de parte", "PN-001");
    escribir("Categoría ATA", "ATA 27"); escribir("Descripción", "Filtro para mantenimiento.");
    escribir("Ubicación", "Bodega SCL"); escribir("Stock", "3"); escribir("Precio en CLP", "50000");
    fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
    expect(actuales().productos.length).toBe(4);
    const fila = screen.getByText("Filtro aeronáutico").closest("tr");
    fireEvent.click(within(fila).getByRole("button", { name: "Editar" }));
    escribir("Precio en CLP", "60000");
    fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
    expect(actuales().productos[3].precio).toBe(60000);
    fireEvent.click(within(screen.getByText("Filtro aeronáutico").closest("tr")).getByRole("button", { name: "Ver" }));
    expect(screen.getByRole("heading", { name: "Filtro aeronáutico" })).toBeTruthy();
    cleanup(); mostrar("/admin/productos");
    fireEvent.click(within(screen.getByText("Filtro aeronáutico").closest("tr")).getByRole("button", { name: "Eliminar" }));
    expect(actuales().productos.length).toBe(3);
  });
  it("C08 crea, renombra y elimina categorías y protege las utilizadas", () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar("/admin/categorias", true);
    escribir("Nombre de categoría", "ATA 28");
    fireEvent.click(screen.getByRole("button", { name: "Guardar categoría" }));
    let fila = screen.getByText("ATA 28", { selector: "td" }).closest("tr");
    fireEvent.click(within(fila).getByRole("button", { name: "Editar" }));
    escribir("Nombre de categoría", "ATA 29");
    fireEvent.click(screen.getByRole("button", { name: "Guardar categoría" }));
    fila = screen.getByText("ATA 29", { selector: "td" }).closest("tr");
    fireEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));
    expect(actuales().categorias.length).toBe(3);
    fireEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]);
    escribir("Nombre de categoría", "ATA 30");
    fireEvent.click(screen.getByRole("button", { name: "Guardar categoría" }));
    expect(actuales().productos[0].categoria).toBe("ATA 30");
    fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(screen.getByRole("alert").textContent).toContain("productos asociados");
  });
  it("C09 crea, consulta, edita y elimina usuarios y protege la propia cuenta", () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrar("/admin/usuarios", true);
    escribir("Nombre completo", "Ana Pérez"); escribir("Correo de la cuenta", "ana@example.com"); escribir("Contraseña", "Prueba123");
    fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
    expect(actuales().usuarios.length).toBe(2);
    fireEvent.click(screen.getAllByRole("button", { name: "Ver" })[1]);
    expect(screen.getByRole("heading", { name: "Detalle del usuario" })).toBeTruthy();
    expect(screen.getByText("Sin compras registradas.")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Editar" })[1]);
    escribir("Nombre completo", "Ana Rivera");
    fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
    expect(actuales().usuarios[1].nombre).toBe("Ana Rivera");
    fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[1]);
    expect(actuales().usuarios.length).toBe(1);
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(screen.getByRole("alert").textContent).toContain("propia cuenta");
  });
  it("C10 persiste pedidos, permite resolverlos y calcula reportes sin rechazados", () => {
    datos.pedidos = [
      { id: "p1", fecha: "2026-10-11T12:00:00Z", estado: "Pendiente", total: 100, lineas: [{ cantidad: 2 }], entrega: { matricula: "CC-BFA", destino: "SCL" } },
      { id: "p2", fecha: "2026-10-11T12:00:00Z", estado: "Rechazado", total: 999, lineas: [{ cantidad: 3 }], entrega: { matricula: "CC-BFA", destino: "SCL" } }
    ];
    const vista = mostrar("/admin/ordenes", true);
    fireEvent.click(screen.getByRole("button", { name: "Marcar resuelto" }));
    expect(actuales().pedidos[0].estado).toBe("Resuelto");
    vista.unmount();
    mostrar("/admin/reportes");
    expect(within(screen.getByText("Unidades vendidas").closest("tr")).getByText("2")).toBeTruthy();
    expect(within(screen.getByText("Total de ventas simuladas").closest("tr")).getByText("$100")).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: "Stock crítico" }));
    expect(screen.getByText("Álabe de Turbina")).toBeTruthy();
  });
});
