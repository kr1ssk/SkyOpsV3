import { useState } from "react";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { formatoPrecio } from "../utils/negocio.js";

export default function Bitacora() {
  const { datos, resolverPedido } = useSkyOps();
  const [estado, setEstado] = useState("");

  const pedidos = datos.pedidos.filter(
    (pedido) => !estado || pedido.estado === estado
  );

  return (
    <>
      <h1>Bitácora de pedidos</h1>

      <Form.Group className="mb-3 filtro" controlId="estado-pedido">
        <Form.Label>Filtrar por estado</Form.Label>

        <Form.Select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Resuelto">Resuelto</option>
          <option value="Rechazado">Rechazado</option>
        </Form.Select>
      </Form.Group>

      {pedidos.length === 0 ? (
        <p>No hay pedidos para mostrar.</p>
      ) : (
        <Table responsive striped>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Aeronave</th>
              <th>Destino</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>
                  {new Date(pedido.fecha).toLocaleDateString("es-CL")}
                </td>

                <td>{pedido.entrega.matricula}</td>
                <td>{pedido.entrega.destino}</td>
                <td>{formatoPrecio(pedido.total)}</td>

                <td>
                  <Badge
                    bg={
                      pedido.estado === "Rechazado"
                        ? "danger"
                        : pedido.estado === "Resuelto"
                        ? "success"
                        : "warning"
                    }
                    text={pedido.estado === "Pendiente" ? "dark" : "light"}
                  >
                    {pedido.estado}
                  </Badge>
                </td>

                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      as={Link}
                      to={`/resultado/${pedido.id}`}
                      size="sm"
                      variant="outline-primary"
                    >
                      Ver resumen
                    </Button>

                    {pedido.estado === "Pendiente" && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => resolverPedido(pedido.id)}
                      >
                        Marcar resuelto
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}