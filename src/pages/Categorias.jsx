import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext.jsx";

export default function Categorias() {
  const { datos } = useSkyOps();

  const categorias = datos.categorias.map(c => c.nombre);

  return (
    <>
      <h1>Categorías</h1>

      <p>Explora los repuestos según su categoría ATA.</p>

      {categorias.length === 0 && <p>No hay categorías disponibles.</p>}

      <Row className="g-3">
        {categorias.map((categoria) => {
          const cantidad = datos.productos.filter(
            (producto) => producto.categoria === categoria
          ).length;

          return (
            <Col xs={12} md={4} key={categoria}>
              <Card body className="h-100">
                <h2 className="h4">{categoria}</h2>
                <p>{cantidad} repuesto(s)</p>

                <Button
                  as={Link}
                  to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                >
                  Ver repuestos
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}