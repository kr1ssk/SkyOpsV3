import { useState } from "react";
import { Alert, Badge, Button, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { formatoPrecio, precioFinal } from "../utils/negocio.js";

export default function Detalle() {
  const { id } = useParams();
  const { datos, agregarProducto } = useSkyOps();

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const producto = datos.productos.find(
    (p) => String(p.id) === id
  );

  if (!producto) {
    return (
      <>
        <h1>Producto no encontrado</h1>
        <Link to="/catalogo">Volver al catálogo</Link>
      </>
    );
  }

  function agregar() {
    setMensaje("");
    setError("");

    try {
      agregarProducto(producto.id);
      setMensaje("Producto agregado al manifiesto.");
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <>
      <Link to="/catalogo">Volver al catálogo</Link>

      <Row className="g-4 mt-2">
        <Col xs={12} md={5}>
          {producto.imagen && (
            <img
              src={`assets/img/${producto.imagen}`}
              alt={producto.nombre}
              className="imagen-detalle"
            />
          )}
        </Col>

        <Col xs={12} md={7}>
          <Badge bg="secondary">{producto.categoria}</Badge>

          <h1 className="mt-2">{producto.nombre}</h1>

          <p>{producto.descripcion}</p>
          <p><strong>Número de parte:</strong> {producto.pn}</p>
          <p><strong>Ubicación:</strong> {producto.ubicacion}</p>
          <p><strong>Stock:</strong> {producto.stock}</p>

          <p>
            <strong>Certificación:</strong>{" "}
            {producto.certificado ? "Disponible" : "Pendiente de revisión"}
          </p>

          {producto.descuento > 0 && (
            <p>
              <del>{formatoPrecio(producto.precio)}</del>{" "}
              <Badge bg="danger">Oferta {producto.descuento}%</Badge>
            </p>
          )}

          <p className="precio">
            {formatoPrecio(precioFinal(producto))}
          </p>

          {mensaje && <Alert variant="success">{mensaje}</Alert>}
          {error && <Alert variant="danger" role="alert">{error}</Alert>}

          <Button
            onClick={agregar}
            disabled={producto.stock === 0}
          >
            Agregar al manifiesto
          </Button>
        </Col>
      </Row>
    </>
  );
}