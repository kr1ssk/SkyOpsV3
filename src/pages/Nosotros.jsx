import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function Nosotros() {
  return <>
    <h1>Nosotros</h1>
    <p>SkyOps es una propuesta de catálogo de repuestos aeronáuticos para apoyar la búsqueda y compra de componentes durante una necesidad AOG: una aeronave que permanece en tierra.</p>
    <h2 className="h4">Nuestra propuesta</h2>
    <p>Consultar repuestos por número de parte y categoría ATA, revisar disponibilidad y preparar un manifiesto de compra con los datos de entrega.</p>
    <p>Este sitio es un proyecto académico de Fullstack II. El stock, las cuentas y las compras son datos de demostración.</p>
    <Button as={Link} to="/contacto">Contactar a SkyOps</Button>
  </>;
}
