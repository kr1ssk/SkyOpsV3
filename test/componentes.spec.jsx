import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import Campo from "../src/components/Campo";
import TarjetaProducto from "../src/components/TarjetaProducto";
import ResumenManifiesto from "../src/components/ResumenManifiesto";
import { SkyOpsContext, SkyOpsProvider } from "../src/context/SkyOpsContext";
import { crearDatosIniciales } from "../src/data/semilla";

describe("Componentes de SkyOps", () => {
  let contexto;

  beforeEach(() => {
    contexto = {
      datos: crearDatosIniciales(),
      errorAlmacenamiento: "",
      agregarProducto: jasmine.createSpy("agregarProducto"),
      actualizarCantidad: jasmine.createSpy("actualizarCantidad"),
      eliminarDelCarrito: jasmine.createSpy("eliminarDelCarrito"),
      confirmarCompra: jasmine.createSpy("confirmarCompra"),
      guardarProducto: jasmine.createSpy("guardarProducto"),
      borrarProducto: jasmine.createSpy("borrarProducto"),
      resolverPedido: jasmine.createSpy("resolverPedido"),
      guardarContacto: jasmine.createSpy("guardarContacto"),
    };
  });

  afterEach(cleanup);

  function mostrarPagina(ruta) {
    render(
      <MemoryRouter initialEntries={[ruta]}>
        <SkyOpsContext.Provider value={contexto}>
          <App />
        </SkyOpsContext.Provider>
      </MemoryRouter>
    );
  }

  function escribir(etiqueta, valor) {
    fireEvent.change(screen.getByLabelText(etiqueta), {
      target: { value: valor },
    });
  }

  it("C01 muestra y comunica el error de un campo", () => {
    render(<Campo id="campo-prueba" label="Nombre" value=""
      onChange={() => {}} error="Ingresa un nombre." />);
    expect(screen.getByText("Ingresa un nombre.")).toBeTruthy();
    expect(screen.getByLabelText("Nombre").getAttribute("aria-invalid")).toBe("true");
  });

  it("C02 agrega un producto desde su tarjeta", () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={contexto.datos.productos[0]}
          onAgregar={contexto.agregarProducto} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "Agregar" }));
    expect(contexto.agregarProducto).toHaveBeenCalledWith(1);
  });

  it("C03 deshabilita agregar cuando no hay stock", () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={{ ...contexto.datos.productos[0], stock: 0 }}
          onAgregar={contexto.agregarProducto} />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: "Agregar" }).disabled).toBeTrue();
  });

  it("C04 muestra productos y total en el resumen", () => {
    render(<ResumenManifiesto lineas={[
      { id: 1, nombre: "Actuador de prueba", cantidad: 2,
        precioUnitario: 100, subtotal: 200 }
    ]} total={200} />);
    expect(screen.getByText("Actuador de prueba")).toBeTruthy();
    expect(screen.getByText(/Total:/).textContent).toContain("200");
  });

  it("C05 filtra el catálogo por nombre", () => {
    mostrarPagina("/catalogo");
    escribir("Buscar repuesto", "Tren Principal");
    expect(screen.getByRole("heading", { name: "Actuador de Tren Principal" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Álabe de Turbina" })).toBeNull();
  });

  it("C06 permite quitar un producto del manifiesto", () => {
    contexto.datos.carrito = [{ productoId: 1, cantidad: 1 }];
    mostrarPagina("/manifiesto");
    fireEvent.click(screen.getByRole("button", { name: "Quitar" }));
    expect(contexto.eliminarDelCarrito).toHaveBeenCalledWith(1);
  });

  it("C07 impide confirmar un checkout con datos vacíos", () => {
    contexto.datos.carrito = [{ productoId: 1, cantidad: 1 }];
    mostrarPagina("/checkout");
    fireEvent.click(screen.getByRole("button", { name: "Confirmar compra" }));
    expect(screen.getByText("Usa el formato CC-BFA.")).toBeTruthy();
    expect(contexto.confirmarCompra).not.toHaveBeenCalled();
  });

  it("C08 envía un producto válido desde administración", () => {
    mostrarPagina("/admin");
    escribir("Nombre", "Filtro aeronáutico");
    escribir("Número de parte", "PN-001");
    escribir("Categoría ATA", "ATA 28");
    escribir("Descripción", "Filtro para mantenimiento.");
    escribir("Ubicación", "Bodega SCL");
    escribir("Stock", "3");
    escribir("Precio en CLP", "50000");
    fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
    expect(contexto.guardarProducto).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: null, nombre: "Filtro aeronáutico", stock: 3, precio: 50000,
      })
    );
  });

  it("C09 guarda una consulta válida", () => {
    mostrarPagina("/contacto");
    escribir("Nombre", "Ana Pérez");
    escribir("Correo electrónico", "ana@example.com");
    escribir("Mensaje", "Necesito consultar la disponibilidad de un repuesto.");
    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));
    expect(contexto.guardarContacto).toHaveBeenCalled();
    expect(screen.getByText("Tu consulta quedó guardada en este navegador.")).toBeTruthy();
  });

  it("C10 muestra la página de una ruta inexistente", () => {
    mostrarPagina("/ruta-inexistente");
    expect(screen.getByRole("heading", { name: "Página no encontrada" })).toBeTruthy();
  });

  it("C11 guarda el carrito mediante localStorage", () => {
    spyOn(localStorage, "getItem").and.returnValue(null);
    const guardar = spyOn(localStorage, "setItem").and.stub();
    render(
      <MemoryRouter initialEntries={["/catalogo"]}>
        <SkyOpsProvider><App /></SkyOpsProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Agregar" })[0]);
    const ultima = guardar.calls.mostRecent().args;
    expect(ultima[0]).toBe("skyops_v3");
    expect(JSON.parse(ultima[1]).carrito).toEqual([{ productoId: 1, cantidad: 1 }]);
  });

  it("C12 filtra las ofertas del catálogo", () => {
    mostrarPagina("/catalogo?ofertas=si");
    expect(screen.getByRole("heading", { name: "Álabe de Turbina" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Actuador de Tren Principal" })).toBeNull();
  });

  it("C13 permite editar un producto existente", () => {
    mostrarPagina("/admin");
    fireEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]);
    escribir("Precio en CLP", "900000");
    fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
    expect(contexto.guardarProducto).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: 1, precio: 900000 })
    );
  });

  it("C14 solicita confirmación antes de eliminar un producto", () => {
    spyOn(window, "confirm").and.returnValue(true);
    mostrarPagina("/admin");
    fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(contexto.borrarProducto).toHaveBeenCalledWith(1);
  });
});
