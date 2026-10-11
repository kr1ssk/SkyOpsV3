import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { STOCK_CRITICO } from "../utils/reportes.js";
export default function StockCritico() {
  const { datos } = useSkyOps();
  const productos = datos.productos.filter(p => p.stock <= STOCK_CRITICO);
  return <><h1>Stock crítico</h1><p>Repuestos con {STOCK_CRITICO} unidades o menos, incluyendo los agotados.</p>
    {productos.length === 0 ? <p>No hay productos con stock crítico.</p> : <Table responsive striped>
      <thead><tr><th>Producto</th><th>Número de parte</th><th>Stock</th><th>Detalle</th></tr></thead>
      <tbody>{productos.map(p => <tr key={p.id}><td>{p.nombre}</td><td>{p.pn}</td><td>{p.stock}</td><td><Link to={"/catalogo/" + p.id}>Ver producto</Link></td></tr>)}</tbody>
    </Table>}
  </>;
}
