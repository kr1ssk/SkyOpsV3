import { Link, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Inicio from "./pages/Inicio.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Categorias from "./pages/Categorias.jsx";
import Detalle from "./pages/Detalle.jsx";
import Manifiesto from "./pages/Manifiesto.jsx";
import Checkout from "./pages/Checkout.jsx";
import Resultado from "./pages/Resultado.jsx";
import Flota from "./pages/Flota.jsx";
import Bitacora from "./pages/Bitacora.jsx";
import Admin from "./pages/Admin.jsx";
import Contacto from "./pages/Contacto.jsx";

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