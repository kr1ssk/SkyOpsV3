import { Link, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import Categorias from "./pages/Categorias";
import Detalle from "./pages/Detalle";
import Manifiesto from "./pages/Manifiesto";
import Checkout from "./pages/Checkout";
import Resultado from "./pages/Resultado";
import Flota from "./pages/Flota";
import Bitacora from "./pages/Bitacora";
import Admin from "./pages/Admin";
import Contacto from "./pages/Contacto";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="catalogo/:id" element={<Detalle />} />
        <Route path="manifiesto" element={<Manifiesto />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="resultado/:id" element={<Resultado />} />
        <Route path="flota" element={<Flota />} />
        <Route path="bitacora" element={<Bitacora />} />
        <Route path="admin" element={<Admin />} />
        <Route path="contacto" element={<Contacto />} />

        <Route
          path="*"
          element={
            <section>
              <h1>Página no encontrada</h1>
              <Link to="/">Volver al inicio</Link>
            </section>
          }
        />
      </Route>
    </Routes>
  );
}