import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext.jsx";

export default function Inicio() {
  const { datos, usuario } = useSkyOps();

  const ofertas = datos.productos.filter(
    (producto) => producto.descuento > 0
  ).length;

  const pendientes = datos.pedidos.filter(
    (pedido) => pedido.estado === "Pendiente" && (usuario?.rol === "admin" || pedido.entrega.usuarioId === usuario?.id)
  ).length;

  return (
    <>
      <section className="hero mb-4">
        <p className="text-uppercase">Soporte a operaciones AOG</p>

        <h1>Repuestos para mantener tu flota en operación</h1>

        <p>
          Consulta el catálogo, prepara un manifiesto y solicita
          la entrega de repuestos aeronáuticos.
        </p>

        <Button as={Link} to="/catalogo" variant="light">
          Explorar catálogo
        </Button>
      </section>

      <Row className="g-3">
        <Col xs={12} md={4}>
          <Card body className="h-100">
            <h2 className="h5">Repuestos disponibles</h2>
            <p className="numero">{datos.productos.length}</p>
            <Link to="/catalogo">Ver productos</Link>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card body className="h-100">
            <h2 className="h5">Productos en oferta</h2>
            <p className="numero">{ofertas}</p>
            <Link to="/ofertas">Ver ofertas</Link>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card body className="h-100">
            <h2 className="h5">Pedidos pendientes</h2>
            <p className="numero">{pendientes}</p>
            <Link to={usuario?.rol === "admin" ? "/admin/ordenes" : usuario ? "/perfil" : "/login"}>{usuario ? "Ver pedidos" : "Iniciar sesión"}</Link>
          </Card>
        </Col>
      </Row>
    </>
  );
}