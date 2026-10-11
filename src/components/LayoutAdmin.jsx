import { Nav } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
export default function LayoutAdmin() {
  return <>
    <Nav variant="pills" className="gap-2 mb-4 flex-wrap" aria-label="Administración">
      <Nav.Link as={NavLink} to="/admin" end>Dashboard</Nav.Link>
      <Nav.Link as={NavLink} to="/admin/productos">Productos</Nav.Link>
      <Nav.Link as={NavLink} to="/admin/ordenes">Órdenes</Nav.Link>
      <Nav.Link as={NavLink} to="/admin/stock">Stock crítico</Nav.Link>
      <Nav.Link as={NavLink} to="/admin/categorias">Categorías</Nav.Link>
      <Nav.Link as={NavLink} to="/admin/usuarios">Usuarios</Nav.Link>
      <Nav.Link as={NavLink} to="/admin/reportes">Reportes</Nav.Link>
      <Nav.Link as={NavLink} to="/perfil">Perfil</Nav.Link>
    </Nav>
    <Outlet />
  </>;
}
