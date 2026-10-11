import { Button, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormularioUsuario from "../components/FormularioUsuario.jsx";
import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { formatoPrecio } from "../utils/negocio.js";

export default function Perfil() {
  const { usuario, datos, actualizarPerfil, cerrarSesion } = useSkyOps();
  const pedidos = datos.pedidos.filter(p => p.entrega.usuarioId === usuario.id);
  return <>
    <h1>Mi perfil</h1><p>Bienvenido, {usuario.nombre}. Rol: {usuario.rol}.</p>
    <Col xs={12} md={8} lg={6}>
      <FormularioUsuario inicial={{ ...usuario, clave: "" }} onGuardar={actualizarPerfil} />
    </Col>
    <h2 className="h4 mt-4">Mi historial de compras</h2>
    {pedidos.length === 0 ? <p>Aún no tienes compras registradas.</p> : <Table responsive striped>
      <thead><tr><th>Fecha</th><th>Estado</th><th>Total</th><th>Resumen</th></tr></thead>
      <tbody>{pedidos.map(p => <tr key={p.id}><td>{new Date(p.fecha).toLocaleDateString("es-CL")}</td><td>{p.estado}</td><td>{formatoPrecio(p.total)}</td><td><Link to={"/resultado/" + p.id}>Ver resumen</Link></td></tr>)}</tbody>
    </Table>}
    {usuario.rol === "admin" && <Button as={Link} to="/admin" className="me-2">Administración</Button>}
    <Button variant="outline-secondary" onClick={cerrarSesion}>Cerrar sesión</Button>
  </>;
}
