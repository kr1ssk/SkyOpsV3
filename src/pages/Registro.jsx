import { Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import FormularioUsuario from "../components/FormularioUsuario.jsx";
import { useSkyOps } from "../context/SkyOpsContext.jsx";

export default function Registro() {
  const { registrarUsuario } = useSkyOps();
  const navigate = useNavigate();
  function guardar(usuario) { registrarUsuario(usuario); navigate("/login"); }
  return <Col xs={12} md={8} lg={6}>
    <h1>Registro de usuario</h1>
    <p>Crea una cuenta de demostración para guardar tus datos de entrega. Usa datos ficticios.</p>
    <FormularioUsuario registro inicial={{ id: null, nombre: "", correo: "", clave: "", rol: "cliente", direccion: "", licencia: "" }} onGuardar={guardar} />
    <p className="mt-3"><Link to="/login">Ya tengo cuenta</Link></p>
  </Col>;
}
