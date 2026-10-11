import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { publicaciones } from "../data/publicaciones.js";
export default function Blog() {
  return <><h1>Blog de SkyOps</h1><Row className="g-3">
    {publicaciones.map(p => <Col xs={12} md={6} key={p.id}><Card body className="h-100">
      <h2 className="h4">{p.titulo}</h2><p>{p.resumen}</p>
      <Button as={Link} to={"/blog/" + p.id}>Leer publicación</Button>
    </Card></Col>)}
  </Row></>;
}
