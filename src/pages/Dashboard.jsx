import { Card, Col, Row } from "react-bootstrap";
import { useSkyOps } from "../context/SkyOpsContext.jsx";
import { resumirPedidos, STOCK_CRITICO } from "../utils/reportes.js";
import { formatoPrecio } from "../utils/negocio.js";
export default function Dashboard() {
  const { datos } = useSkyOps();
  const resumen = resumirPedidos(datos.pedidos);
  const indicadores = [
    ["Productos", datos.productos.length], ["Usuarios", datos.usuarios.length],
    ["Pedidos pendientes", resumen.pendientes], ["Ventas simuladas", formatoPrecio(resumen.ingresos)],
    ["Repuestos con stock crítico", datos.productos.filter(p => p.stock <= STOCK_CRITICO).length]
  ];
  return <><h1>Dashboard de SkyOps</h1><p>Resumen de los datos guardados en este navegador.</p>
    <Row className="g-3">{indicadores.map(([nombre, valor]) => <Col xs={12} sm={6} lg={4} key={nombre}><Card body>
      <h2 className="h5">{nombre}</h2><p className="numero mb-0">{valor}</p>
    </Card></Col>)}</Row>
  </>;
}
