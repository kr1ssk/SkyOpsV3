import { Table } from "react-bootstrap";
import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { resumirPedidos } from "../utils/reportes.js";
import { formatoPrecio } from "../utils/negocio.js";
export default function Reportes() {
  const { datos } = useSkyOps();
  const resumen = resumirPedidos(datos.pedidos);
  return <><h1>Reporte de compras</h1><p>Las compras rechazadas no se incluyen en ventas ni en unidades vendidas.</p>
    <Table responsive striped>
      <thead><tr><th>Indicador</th><th>Resultado</th></tr></thead>
      <tbody>
        <tr><td>Intentos de compra</td><td>{resumen.cantidad}</td></tr>
        <tr><td>Compras aprobadas</td><td>{resumen.aprobados}</td></tr>
        <tr><td>Compras rechazadas</td><td>{resumen.rechazados}</td></tr>
        <tr><td>Pedidos pendientes</td><td>{resumen.pendientes}</td></tr>
        <tr><td>Unidades vendidas</td><td>{resumen.unidades}</td></tr>
        <tr><td>Total de ventas simuladas</td><td>{formatoPrecio(resumen.ingresos)}</td></tr>
      </tbody>
    </Table>
    <p className="text-secondary">Este reporte corresponde a datos de demostración; no es un documento tributario.</p>
  </>;
}
