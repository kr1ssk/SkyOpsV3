import {
  Alert,
  Container,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { Link, NavLink, Outlet } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext.jsx";

export default function Layout() {
  const { datos, usuario, errorAlmacenamiento } = useSkyOps();

  const cantidad = datos.carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  return (
    <div className="app">
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            SkyOps
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="menu-skyops" />

          <Navbar.Collapse id="menu-skyops">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/" end eventKey="inicio">
                Inicio
              </Nav.Link>

              <Nav.Link as={NavLink} to="/catalogo" eventKey="catalogo">
                Catálogo
              </Nav.Link>

              <Nav.Link as={NavLink} to="/categorias" eventKey="categorias">
                Categorías
              </Nav.Link>

              <Nav.Link as={NavLink} to="/flota" eventKey="flota">
                Flota
              </Nav.Link>

              <Nav.Link as={NavLink} to="/manifiesto" eventKey="manifiesto">
                Manifiesto ({cantidad})
              </Nav.Link>

              <Nav.Link as={NavLink} to="/ofertas" eventKey="ofertas">Ofertas</Nav.Link>
              <NavDropdown title="Información" id="menu-informacion">
                <NavDropdown.Item as={Link} to="/nosotros">Nosotros</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/blog">Blog</NavDropdown.Item>
              </NavDropdown>
              {usuario?.rol === "admin" && <Nav.Link as={NavLink} to="/admin" eventKey="admin">Administración</Nav.Link>}
              <Nav.Link as={NavLink} to={usuario ? "/perfil" : "/login"} eventKey="cuenta">{usuario ? "Mi perfil" : "Iniciar sesión"}</Nav.Link>
              <Nav.Link as={NavLink} to="/contacto" eventKey="contacto">
                Contacto
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container as="main" className="py-4 flex-grow-1">
        {errorAlmacenamiento && (
          <Alert variant="danger" role="alert">
            {errorAlmacenamiento}
          </Alert>
        )}

        <Outlet />
      </Container>

      <footer className="footer">
        <Container>
          <strong>SkyOps</strong>
          <p className="mb-0">
            Repuestos aeronáuticos · Proyecto Fullstack II
          </p>
        </Container>
      </footer>
    </div>
  );
}