import { useState } from "react";
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormularioUsuario from "../components/FormularioUsuario.jsx";
import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { formatoPrecio } from "../utils/negocio.js";

const vacio = { id: null, nombre: "", correo: "", clave: "", rol: "cliente", direccion: "", licencia: "" };
export default function AdminUsuarios() {
  const { datos, guardarUsuario, borrarUsuario } = useSkyOps();
  const [seleccionado, setSeleccionado] = useState(null);
  const [editar, setEditar] = useState(false);
  const [error, setError] = useState("");
  const historial = datos.pedidos.filter(p => p.entrega.usuarioId === seleccionado?.id);
  function seleccionar(u, edicion) { setSeleccionado(u); setEditar(edicion); setError(""); }
  function eliminar(id) {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try { borrarUsuario(id); seleccionar(null, false); }
    catch (problema) { setError(problema.message); }
  }
  return <>
    <h1>Administración de usuarios</h1>
    {error && <Alert variant="danger" role="alert">{error}</Alert>}
    <Row className="g-4"><Col xs={12} lg={5}>
      <h2 className="h4">{seleccionado ? (editar ? "Editar usuario" : "Detalle del usuario") : "Nuevo usuario"}</h2>
      {!seleccionado || editar ? <FormularioUsuario key={seleccionado?.id || "nuevo"} roles
        inicial={seleccionado ? { ...seleccionado, clave: "" } : vacio}
        onGuardar={guardarUsuario} /> : <>
          <p><strong>Nombre:</strong> {seleccionado.nombre}</p><p><strong>Correo:</strong> {seleccionado.correo}</p>
          <p><strong>Rol:</strong> {seleccionado.rol}</p><p><strong>Dirección:</strong> {seleccionado.direccion || "Sin registrar"}</p>
          <h3 className="h5">Historial de compras</h3>
          {historial.length === 0 ? <p>Sin compras registradas.</p> : <ul>{historial.map(p => <li key={p.id}><Link to={"/resultado/" + p.id}>{p.estado} · {formatoPrecio(p.total)}</Link></li>)}</ul>}
        </>}
      {seleccionado && <Button className="mt-3" variant="outline-secondary" onClick={() => seleccionar(null, false)}>Nuevo usuario</Button>}
    </Col><Col xs={12} lg={7}>
      <Table responsive striped><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead>
        <tbody>{datos.usuarios.map(u => <tr key={u.id}><td>{u.nombre}</td><td>{u.correo}</td><td>{u.rol}</td><td><div className="d-flex gap-2 flex-wrap">
          <Button size="sm" onClick={() => seleccionar(u, false)}>Ver</Button>
          <Button size="sm" variant="outline-primary" onClick={() => seleccionar(u, true)}>Editar</Button>
          <Button size="sm" variant="outline-danger" onClick={() => eliminar(u.id)}>Eliminar</Button>
        </div></td></tr>)}</tbody>
      </Table>
    </Col></Row>
  </>;
}
