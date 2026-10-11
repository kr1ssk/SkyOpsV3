import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Campo from "../components/Campo.jsx";
import ResumenManifiesto from "../components/ResumenManifiesto.jsx";
import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { calcularTotal, obtenerLineas } from "../utils/negocio.js";
import { validarCheckout } from "../utils/validaciones.js";

export default function Checkout() {
  const { datos, usuario, confirmarCompra } = useSkyOps();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [entrega, setEntrega] = useState({
    matricula: params.get("matricula") || "",
    ingeniero: usuario?.nombre || "",
    licencia: usuario?.licencia || "",
    correo: usuario?.correo || "",
    direccion: usuario?.direccion || "",
    destino: "",
    tipoEntrega: "",
    declaracion: false,
  });

  const [resultadoSimulado, setResultadoSimulado] = useState("aprobada");
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");

  const lineas = obtenerLineas(datos.productos, datos.carrito);
  const total = calcularTotal(datos.productos, datos.carrito);

  function cambiar(campo, valor) {
    setEntrega({ ...entrega, [campo]: valor });
  }

  function enviar(event) {
    event.preventDefault();
    setError("");

    const nuevosErrores = validarCheckout(entrega);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    try {
      const pedido = confirmarCompra(
        entrega,
        resultadoSimulado === "aprobada"
      );

      navigate(`/resultado/${pedido.id}`);
    } catch (problema) {
      setError(problema.message);
    }
  }

  if (datos.carrito.length === 0) {
    return (
      <>
        <h1>Checkout</h1>
        <Alert variant="info">
          Agrega repuestos antes de continuar.{" "}
          <Link to="/catalogo">Ir al catálogo</Link>
        </Alert>
      </>
    );
  }

  return (
    <>
      <h1>Checkout</h1>

      <p>Completa los datos del responsable y la entrega.</p>

      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Form onSubmit={enviar} noValidate>
            <Campo
              id="matricula"
              label="Matrícula de aeronave"
              value={entrega.matricula}
              onChange={(e) => cambiar("matricula", e.target.value)}
              error={errores.matricula}
            />

            <Campo
              id="ingeniero"
              label="Nombre y apellido del ingeniero"
              value={entrega.ingeniero}
              onChange={(e) => cambiar("ingeniero", e.target.value)}
              error={errores.ingeniero}
            />

            <Campo
              id="licencia"
              label="Licencia del ingeniero"
              value={entrega.licencia}
              onChange={(e) => cambiar("licencia", e.target.value)}
              error={errores.licencia}
            />

            <Campo
              id="correo"
              label="Correo electrónico"
              type="email"
              value={entrega.correo}
              onChange={(e) => cambiar("correo", e.target.value)}
              error={errores.correo}
            />

            <Campo
              id="direccion"
              label="Dirección de entrega o retiro"
              value={entrega.direccion}
              onChange={(e) => cambiar("direccion", e.target.value)}
              error={errores.direccion}
            />

            <Form.Group className="mb-3" controlId="destino">
              <Form.Label>Aeropuerto de destino</Form.Label>

              <Form.Select
                value={entrega.destino}
                onChange={(e) => cambiar("destino", e.target.value)}
                isInvalid={Boolean(errores.destino)}
              >
                <option value="">Selecciona un aeropuerto</option>
                <option value="SCL">SCL · Santiago</option>
                <option value="ANF">ANF · Antofagasta</option>
                <option value="CCP">CCP · Concepción</option>
                <option value="IQQ">IQQ · Iquique</option>
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                {errores.destino}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="tipo-entrega">
              <Form.Label>Forma de entrega</Form.Label>

              <Form.Select
                value={entrega.tipoEntrega}
                onChange={(e) => cambiar("tipoEntrega", e.target.value)}
                isInvalid={Boolean(errores.tipoEntrega)}
              >
                <option value="">Selecciona una opción</option>
                <option value="Retiro en bodega">Retiro en bodega</option>
                <option value="Despacho a aeropuerto">
                  Despacho a aeropuerto
                </option>
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                {errores.tipoEntrega}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Check
              id="declaracion"
              label="Confirmo que revisaré la documentación y certificación de los repuestos."
              checked={entrega.declaracion}
              onChange={(e) => cambiar("declaracion", e.target.checked)}
              isInvalid={Boolean(errores.declaracion)}
              feedback={errores.declaracion}
              feedbackType="invalid"
              className="mb-3"
            />

            <Form.Group className="mb-3" controlId="simulacion">
              <Form.Label>Resultado del pago simulado</Form.Label>

              <Form.Select
                value={resultadoSimulado}
                onChange={(e) => setResultadoSimulado(e.target.value)}
              >
                <option value="aprobada">Compra aprobada</option>
                <option value="rechazada">Compra rechazada</option>
              </Form.Select>

              <Form.Text>
                Esta opción permite demostrar ambos resultados.
              </Form.Text>
            </Form.Group>

            {error && <Alert variant="danger" role="alert">{error}</Alert>}

            <Button type="submit">Confirmar compra</Button>
          </Form>
        </Col>

        <Col xs={12} lg={6}>
          <h2 className="h4">Resumen del manifiesto</h2>
          <ResumenManifiesto lineas={lineas} total={total} />
          <p className="text-secondary">
            El total incluye los descuentos publicados. No se aplica
            un cargo adicional de entrega en esta simulación.
          </p>
        </Col>
      </Row>
    </>
  );
}