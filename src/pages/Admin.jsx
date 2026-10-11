import { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  Row,
  Table,
} from "react-bootstrap";

import Campo from "../components/Campo.jsx";
import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { formatoPrecio } from "../utils/negocio.js";
import { validarProducto } from "../utils/validaciones.js";

const formularioInicial = {
  id: null,
  nombre: "",
  pn: "",
  categoria: "",
  descripcion: "",
  ubicacion: "",
  stock: "0",
  precio: "",
  descuento: "0",
  certificado: false,
  imagen: "",
};

export default function Admin() {
  const { datos, guardarProducto, borrarProducto } = useSkyOps();

  const [formulario, setFormulario] = useState({ ...formularioInicial });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  function cambiar(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor });
  }

  function limpiar() {
    setFormulario({ ...formularioInicial });
    setErrores({});
  }

  function editar(producto) {
    setFormulario({
      ...producto,
      stock: String(producto.stock),
      precio: String(producto.precio),
      descuento: String(producto.descuento),
    });

    setErrores({});
    setMensaje("");
    setError("");
  }

  function enviar(event) {
    event.preventDefault();
    setMensaje("");
    setError("");

    const producto = {
      ...formulario,
      stock: formulario.stock.trim() === ""
        ? NaN
        : Number(formulario.stock),
      precio: formulario.precio.trim() === ""
        ? NaN
        : Number(formulario.precio),
      descuento: formulario.descuento.trim() === ""
        ? NaN
        : Number(formulario.descuento),
    };

    const nuevosErrores = validarProducto(producto);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    try {
      guardarProducto(producto);

      setMensaje(
        producto.id === null
          ? "Producto creado."
          : "Producto actualizado."
      );

      limpiar();
    } catch (problema) {
      setError(problema.message);
    }
  }

  function eliminar(producto) {
    const confirmado = window.confirm(
      `¿Eliminar ${producto.nombre}?`
    );

    if (!confirmado) {
      return;
    }

    setError("");
    setMensaje("");

    try {
      borrarProducto(producto.id);
      setMensaje("Producto eliminado.");

      if (formulario.id === producto.id) {
        limpiar();
      }
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <>
      <h1>Administración del catálogo</h1>

      <p>Agrega, consulta, modifica y elimina repuestos.</p>

      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger" role="alert">{error}</Alert>}

      <Row className="g-4">
        <Col xs={12} lg={4}>
          <h2 className="h4">
            {formulario.id === null ? "Nuevo producto" : "Editar producto"}
          </h2>

          <Form onSubmit={enviar} noValidate>
            <Campo
              id="producto-nombre"
              label="Nombre"
              value={formulario.nombre}
              onChange={(e) => cambiar("nombre", e.target.value)}
              error={errores.nombre}
            />

            <Campo
              id="producto-pn"
              label="Número de parte"
              value={formulario.pn}
              onChange={(e) => cambiar("pn", e.target.value)}
              error={errores.pn}
            />

            <Form.Group className="mb-3" controlId="producto-categoria">
              <Form.Label>Categoría ATA</Form.Label>
              <Form.Select value={formulario.categoria} onChange={e => cambiar("categoria", e.target.value)} isInvalid={Boolean(errores.categoria)}>
                <option value="">Selecciona una categoría</option>
                {datos.categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.categoria}</Form.Control.Feedback>
            </Form.Group>

            <Campo
              id="producto-descripcion"
              label="Descripción"
              as="textarea"
              value={formulario.descripcion}
              onChange={(e) => cambiar("descripcion", e.target.value)}
              error={errores.descripcion}
            />

            <Campo
              id="producto-ubicacion"
              label="Ubicación"
              value={formulario.ubicacion}
              onChange={(e) => cambiar("ubicacion", e.target.value)}
              error={errores.ubicacion}
            />

            <Campo
              id="producto-stock"
              label="Stock"
              type="number"
              value={formulario.stock}
              onChange={(e) => cambiar("stock", e.target.value)}
              error={errores.stock}
            />

            <Campo
              id="producto-precio"
              label="Precio en CLP"
              type="number"
              value={formulario.precio}
              onChange={(e) => cambiar("precio", e.target.value)}
              error={errores.precio}
            />

            <Campo
              id="producto-descuento"
              label="Descuento (%)"
              type="number"
              value={formulario.descuento}
              onChange={(e) => cambiar("descuento", e.target.value)}
              error={errores.descuento}
            />

            <Campo
              id="producto-imagen"
              label="Nombre del archivo de imagen (opcional)"
              value={formulario.imagen}
              onChange={(e) => cambiar("imagen", e.target.value)}
              error={errores.imagen}
            />

            <p className="small text-secondary">
              Ejemplo: actuador-tren.svg. El archivo debe estar en
              public/assets/img.
            </p>

            <Form.Check
              id="producto-certificado"
              label="Certificación disponible"
              checked={formulario.certificado}
              onChange={(e) => cambiar("certificado", e.target.checked)}
              className="mb-3"
            />

            <div className="d-flex gap-2">
              <Button type="submit">Guardar producto</Button>

              <Button
                type="button"
                variant="outline-secondary"
                onClick={limpiar}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Col>

        <Col xs={12} lg={8}>
          <h2 className="h4">Productos registrados</h2>

          {datos.productos.length === 0 ? (
            <p>No hay productos registrados.</p>
          ) : (
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {datos.productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                      {producto.nombre}
                      <small className="d-block">{producto.pn}</small>
                    </td>

                    <td>{formatoPrecio(producto.precio)}</td>
                    <td>{producto.stock}</td>

                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => editar(producto)}
                        >
                          Editar
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => eliminar(producto)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
}