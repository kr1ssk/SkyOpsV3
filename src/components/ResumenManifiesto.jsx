import { Table } from "react-bootstrap";
import { formatoPrecio } from "../utils/negocio";

export default function ResumenManifiesto({ lineas, total }) {
  return (
    <section aria-label="Resumen de productos">
      <Table responsive striped>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {lineas.map((linea) => (
            <tr key={linea.id}>
              <td>{linea.nombre}</td>
              <td>{linea.cantidad}</td>
              <td>{formatoPrecio(linea.precioUnitario)}</td>
              <td>{formatoPrecio(linea.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p className="h5 text-end">
        Total: {formatoPrecio(total)}
      </p>
    </section>
  );
}