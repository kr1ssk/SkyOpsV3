import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import Campo from "./Campo.jsx";
import { validarUsuario } from "../data/repositorio.js";

export default function FormularioUsuario({ inicial, onGuardar, roles = false, registro = false }) {
  const [formulario, setFormulario] = useState(inicial);
  const [repetir, setRepetir] = useState("");
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  function cambiar(campo, valor) { setFormulario({ ...formulario, [campo]: valor }); }
  function enviar(e) {
    e.preventDefault();
    setError(""); setMensaje("");
    const nuevos = validarUsuario(formulario, formulario.id === null);
    if (registro && formulario.clave !== repetir) nuevos.repetir = "Las contraseñas no coinciden.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;
    try { onGuardar(formulario); setMensaje("Datos guardados."); }
    catch (problema) { setError(problema.message); }
  }
  return <Form onSubmit={enviar} noValidate>
    <Campo id="usuario-nombre" label="Nombre completo" value={formulario.nombre} onChange={e => cambiar("nombre", e.target.value)} error={errores.nombre} />
    <Campo id="usuario-correo" label="Correo de la cuenta" type="email" value={formulario.correo} onChange={e => cambiar("correo", e.target.value)} error={errores.correo} />
    <Campo id="usuario-clave" label={formulario.id === null ? "Contraseña" : "Nueva contraseña (opcional)"} type="password" value={formulario.clave} onChange={e => cambiar("clave", e.target.value)} error={errores.clave} />
    {registro && <Campo id="repetir-clave" label="Repetir contraseña" type="password" value={repetir} onChange={e => setRepetir(e.target.value)} error={errores.repetir} />}
    <Campo id="usuario-direccion" label="Dirección de entrega" value={formulario.direccion} onChange={e => cambiar("direccion", e.target.value)} />
    <Campo id="usuario-licencia" label="Licencia del responsable" value={formulario.licencia} onChange={e => cambiar("licencia", e.target.value)} />
    {roles && <Form.Group className="mb-3" controlId="usuario-rol">
      <Form.Label>Rol</Form.Label>
      <Form.Select value={formulario.rol} onChange={e => cambiar("rol", e.target.value)}>
        <option value="cliente">Cliente</option><option value="admin">Administrador</option>
      </Form.Select>
    </Form.Group>}
    {error && <Alert variant="danger" role="alert">{error}</Alert>}
    {mensaje && <Alert variant="success">{mensaje}</Alert>}
    <Button type="submit">{registro ? "Crear cuenta" : "Guardar usuario"}</Button>
  </Form>;
}
