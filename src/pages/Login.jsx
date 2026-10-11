import { useState } from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Campo from "../components/Campo.jsx";
import { useSkyOps } from "../context/SkyOpsContext.jsx";

export default function Login() {
  const { iniciarSesion } = useSkyOps();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  function enviar(e) {
    e.preventDefault();
    try { iniciarSesion(correo, clave); navigate("/perfil"); }
    catch (problema) { setError(problema.message); }
  }
  return <Col xs={12} md={7} lg={5}>
    <h1>Iniciar sesión</h1>
    <p className="text-secondary">Cuenta de demostración: admin@skyops.cl · Skyops123</p>
    <Form onSubmit={enviar} noValidate>
      <Campo id="login-correo" label="Correo de la cuenta" type="email" value={correo} onChange={e => setCorreo(e.target.value)} />
      <Campo id="login-clave" label="Contraseña" type="password" value={clave} onChange={e => setClave(e.target.value)} />
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Button type="submit">Ingresar</Button>
    </Form>
    <p className="mt-3">¿No tienes cuenta? <Link to="/registro">Registrarse</Link></p>
  </Col>;
}
