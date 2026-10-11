import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext.jsx";

export default function Flota() {
  const { datos } = useSkyOps();

  return (
    <>
      <h1>Flota</h1>

      <p>Consulta las aeronaves registradas en SkyOps.</p>

      <Row className="g-3">
        {datos.flota.map((avion) => (
          <Col xs={12} md={6} lg={3} key={avion.matricula}>
            <Card body className="h-100">
              <h2 className="h4">{avion.matricula}</h2>
              <p>{avion.modelo} · {avion.aerolinea}</p>
              <p>{avion.ubicacion}</p>

              <p>
                <Badge bg={avion.estado === "AOG" ? "danger" : "success"}>
                  {avion.estado}
                </Badge>
              </p>

              <Button
                as={Link}
                to={`/checkout?matricula=${avion.matricula}`}
                variant="outline-primary"
              >
                Preparar entrega
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}