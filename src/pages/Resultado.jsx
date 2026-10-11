import { Alert, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import ResumenManifiesto from "../components/ResumenManifiesto";
import { useSkyOps } from "../context/SkyOpsContext";

export default function Resultado() {
  const { id } = useParams();
  const { datos } = useSkyOps();

  const pedido = datos.pedidos.find((p) => p.id === id);

  if (!pedido) {
    return (
      <>
        <h1>Pedido no encontrado</h1>
        <Link to="/bitacora">Ver bitácora</Link>
      </>
    );
  }

  const rechazada = pedido.estado === "Rechazado";

  return (
    <>
      <h1>
        {rechazada ? "Compra rechazada" : "Compra confirmada"}
      </h1>

      <Alert variant={rechazada ? "danger" : "success"}>
        {rechazada
          ? "El pago simulado fue rechazado. Los productos siguen en el manifiesto y el stock no cambió."
          : "La compra fue registrada y el stock fue actualizado."}
      </Alert>

      <p><strong>Folio:</strong> {pedido.id}</p>
      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(pedido.fecha).toLocaleString("es-CL")}
      </p>
      <p><strong>Estado:</strong> {pedido.estado}</p>
      <p><strong>Aeronave:</strong> {pedido.entrega.matricula}</p>
      <p><strong>Responsable:</strong> {pedido.entrega.ingeniero}</p>
      <p><strong>Entrega:</strong> {pedido.entrega.tipoEntrega}</p>
      <p><strong>Dirección:</strong> {pedido.entrega.direccion}</p>
      <p><strong>Destino:</strong> {pedido.entrega.destino}</p>

      <ResumenManifiesto lineas={pedido.lineas} total={pedido.total} />

      <div className="d-flex gap-2 flex-wrap">
        <Button as={Link} to="/bitacora">Ver bitácora</Button>

        {rechazada && (
          <Button as={Link} to="/checkout" variant="outline-primary">
            Reintentar compra
          </Button>
        )}
      </div>
    </>
  );
}