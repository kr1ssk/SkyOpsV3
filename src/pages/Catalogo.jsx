import { useState } from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

import TarjetaProducto from "../components/TarjetaProducto";
import { useSkyOps } from "../context/SkyOpsContext";

export default function Catalogo() {
  const { datos, agregarProducto } = useSkyOps();
  const [params, setParams] = useSearchParams();

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const busqueda = params.get("q") || "";
  const categoria = params.get("categoria") || "";
  const soloOfertas = params.get("ofertas") === "si";

  const categorias = [
    ...new Set(datos.productos.map((p) => p.categoria)),
  ];

  function cambiarFiltro(clave, valor) {
    const nuevosParams = new URLSearchParams(params);

    if (valor) {
      nuevosParams.set(clave, valor);
    } else {
      nuevosParams.delete(clave);
    }

    setParams(nuevosParams, { replace: true });
  }

  function agregar(id) {
    setMensaje("");
    setError("");

    try {
      agregarProducto(id);
      setMensaje("Producto agregado al manifiesto.");
    } catch (problema) {
      setError(problema.message);
    }
  }

  const productos = datos.productos.filter((producto) => {
    const texto = `${producto.nombre} ${producto.pn}`.toLowerCase();

    return (
      texto.includes(busqueda.toLowerCase()) &&
      (!categoria || producto.categoria === categoria) &&
      (!soloOfertas || producto.descuento > 0)
    );
  });

  return (
    <>
      <h1>Catálogo de repuestos</h1>

      <p>Busca por nombre, número de parte o categoría ATA.</p>

      <Row className="g-3 mb-4">
        <Col xs={12} md={6}>
          <Form.Label htmlFor="buscar">Buscar repuesto</Form.Label>
          <Form.Control
            id="buscar"
            type="search"
            value={busqueda}
            onChange={(e) => cambiarFiltro("q", e.target.value)}
          />
        </Col>

        <Col xs={12} md={4}>
          <Form.Label htmlFor="categoria">Categoría</Form.Label>
          <Form.Select
            id="categoria"
            value={categoria}
            onChange={(e) => cambiarFiltro("categoria", e.target.value)}
          >
            <option value="">Todas las categorías</option>

            {categorias.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={12} md={2} className="d-flex align-items-end">
          <Form.Check
            id="solo-ofertas"
            label="Solo ofertas"
            checked={soloOfertas}
            onChange={(e) =>
              cambiarFiltro("ofertas", e.target.checked ? "si" : "")
            }
          />
        </Col>
      </Row>

      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger" role="alert">{error}</Alert>}

      {productos.length === 0 ? (
        <Alert variant="info">
          No hay productos que coincidan con la búsqueda.
        </Alert>
      ) : (
        <Row className="g-4">
          {productos.map((producto) => (
            <Col xs={12} md={6} lg={4} key={producto.id}>
              <TarjetaProducto
                producto={producto}
                onAgregar={agregar}
              />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}