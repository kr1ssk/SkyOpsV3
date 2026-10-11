import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

import Campo from "../components/Campo.jsx";
import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { validarContacto } from "../utils/validaciones.js";

export default function Contacto() {
  const { guardarContacto } = useSkyOps();

  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor });
    setEnviado(false);
  }

  function enviar(event) {
    event.preventDefault();

    const nuevosErrores = validarContacto(formulario);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    guardarContacto({
      nombre: formulario.nombre.trim(),
      correo: formulario.correo.trim(),
      mensaje: formulario.mensaje.trim(),
    });

    setFormulario({ nombre: "", correo: "", mensaje: "" });
    setEnviado(true);
  }

  return (
    <section className="formulario-contacto">
      <h1>Contacto</h1>

      <p>Registra una consulta sobre los repuestos o su entrega.</p>

      {enviado && (
        <Alert variant="success">
          Tu consulta quedó guardada en este navegador.
        </Alert>
      )}

      <Form onSubmit={enviar} noValidate>
        <Campo
          id="contacto-nombre"
          label="Nombre"
          value={formulario.nombre}
          onChange={(e) => cambiar("nombre", e.target.value)}
          error={errores.nombre}
        />

        <Campo
          id="contacto-correo"
          label="Correo electrónico"
          type="email"
          value={formulario.correo}
          onChange={(e) => cambiar("correo", e.target.value)}
          error={errores.correo}
        />

        <Campo
          id="contacto-mensaje"
          label="Mensaje"
          as="textarea"
          value={formulario.mensaje}
          onChange={(e) => cambiar("mensaje", e.target.value)}
          error={errores.mensaje}
        />

        <Button type="submit">Enviar consulta</Button>
      </Form>
    </section>
  );
}