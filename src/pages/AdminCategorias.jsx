import { useState } from "react";
import { Alert, Button, Col, Form, Row, Table } from "react-bootstrap";
import Campo from "../components/Campo.jsx";
import { useSkyOps } from "../context/SkyOpsContext.jsx";

export default function AdminCategorias() {
  const { datos, guardarCategoria, borrarCategoria } = useSkyOps();
  const [formulario, setFormulario] = useState({ id: null, nombre: "" });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  function enviar(e) {
    e.preventDefault(); setError(""); setMensaje("");
    try { guardarCategoria(formulario); setFormulario({ id: null, nombre: "" }); setMensaje("Categoría guardada."); }
    catch (problema) { setError(problema.message); }
  }
  function eliminar(id) {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    setError(""); setMensaje("");
    try { borrarCategoria(id); setFormulario({ id: null, nombre: "" }); setMensaje("Categoría eliminada."); }
    catch (problema) { setError(problema.message); }
  }
  return <>
    <h1>Administración de categorías</h1>
    {error && <Alert variant="danger" role="alert">{error}</Alert>}
    {mensaje && <Alert variant="success">{mensaje}</Alert>}
    <Row className="g-4"><Col xs={12} lg={4}>
      <h2 className="h4">{formulario.id === null ? "Nueva categoría" : "Editar categoría"}</h2>
      <Form onSubmit={enviar} noValidate>
        <Campo id="categoria-nombre" label="Nombre de categoría" value={formulario.nombre} onChange={e => setFormulario({ ...formulario, nombre: e.target.value })} />
        <p className="small">Usa el formato ATA 27. Al editar se actualizan los productos asociados.</p>
        <Button type="submit">Guardar categoría</Button>
        <Button variant="outline-secondary" className="ms-2" onClick={() => setFormulario({ id: null, nombre: "" })}>Cancelar</Button>
      </Form>
    </Col><Col xs={12} lg={8}>
      <Table responsive striped><thead><tr><th>Categoría</th><th>Productos</th><th>Acciones</th></tr></thead>
        <tbody>{datos.categorias.map(c => <tr key={c.id}><td>{c.nombre}</td><td>{datos.productos.filter(p => p.categoria === c.nombre).length}</td><td>
          <Button size="sm" className="me-2" onClick={() => { setFormulario(c); setError(""); setMensaje(""); }}>Editar</Button>
          <Button size="sm" variant="outline-danger" onClick={() => eliminar(c.id)}>Eliminar</Button>
        </td></tr>)}</tbody>
      </Table>
    </Col></Row>
  </>;
}
