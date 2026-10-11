import { useState } from "react";
import { Alert, Button, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useSkyOps } from "../context/SkyOpsContext";
import {
  calcularTotal,
  formatoPrecio,
  obtenerLineas,
} from "../utils/negocio";

export default function Manifiesto() {
  const {
    datos,
    actualizarCantidad,
    eliminarDelCarrito,
  } = useSkyOps();

  const [error, setError] = useState("");

  const lineas = obtenerLineas(datos.productos, datos.carrito);
  const total = calcularTotal(datos.productos, datos.carrito);

  function cambiar(id, cantidad) {
    setError("");

    try {
      actualizarCantidad(id, Number(cantidad));
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <>
      <h1>Manifiesto de compra</h1>

      <p>Revisa los repuestos y sus cantidades antes de continuar.</p>

      {error && <Alert variant="danger" role="alert">{error}</Alert>}

      {lineas.length === 0 ? (
        <Alert variant="info">
          El manifiesto está vacío.{" "}
          <Link to="/catalogo">Explorar catálogo</Link>
        </Alert>
      ) : (
        <>
          <Table responsive striped>
            <thead>
              <tr>
                <th>Repuesto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {lineas.map((linea) => (
                <tr key={linea.id}>
                  <td>
                    {linea.nombre}
                    <small className="d-block">{linea.pn}</small>
                  </td>

                  <td>{formatoPrecio(linea.precioUnitario)}</td>

                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      max={linea.stock}
                      step="1"
                      value={linea.cantidad}
                      aria-label={`Cantidad de ${linea.nombre}`}
                      className="cantidad"
                      onChange={(e) => cambiar(linea.id, e.target.value)}
                    />
                  </td>

                  <td>{formatoPrecio(linea.subtotal)}</td>

                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminarDelCarrito(linea.id)}
                    >
                      Quitar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <p className="h4 text-end">
            Total: {formatoPrecio(total)}
          </p>

          <div className="d-flex gap-2 justify-content-end flex-wrap">
            <Button as={Link} to="/catalogo" variant="outline-primary">
              Seguir comprando
            </Button>

            <Button as={Link} to="/checkout">
              Continuar al checkout
            </Button>
          </div>
        </>
      )}
    </>
  );
}