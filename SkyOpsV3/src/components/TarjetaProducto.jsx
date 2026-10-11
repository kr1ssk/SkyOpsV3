import { Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { formatoPrecio, precioFinal } from "../utils/negocio";

export default function TarjetaProducto({ producto, onAgregar }) {
  return (
    <Card className="h-100 tarjeta-producto">
      {producto.imagen && (
        <Card.Img
          variant="top"
          src={`assets/img/${producto.imagen}`}
          alt={producto.nombre}
          className="imagen-producto"
        />
      )}

      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="secondary">{producto.categoria}</Badge>

          {producto.descuento > 0 && (
            <Badge bg="danger" className="ms-2">
              Oferta {producto.descuento}%
            </Badge>
          )}
        </div>

        <Card.Title as="h2" className="h5">
          {producto.nombre}
        </Card.Title>

        <p className="text-secondary">{producto.pn}</p>

        {producto.descuento > 0 && (
          <del className="text-secondary">
            {formatoPrecio(producto.precio)}
          </del>
        )}

        <p className="precio">{formatoPrecio(precioFinal(producto))}</p>

        <p>Stock: {producto.stock}</p>

        <div className="mt-auto d-flex gap-2 flex-wrap">
          <Button
            as={Link}
            to={`/catalogo/${producto.id}`}
            variant="outline-primary"
          >
            Ver detalle
          </Button>

          <Button
            disabled={producto.stock === 0}
            onClick={() => onAgregar(producto.id)}
          >
            Agregar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}