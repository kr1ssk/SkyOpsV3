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

import Acceso from "./components/Acceso.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Perfil from "./pages/Perfil.jsx";

import Nosotros from "./pages/Nosotros.jsx";
import Blog from "./pages/Blog.jsx";
import DetalleBlog from "./pages/DetalleBlog.jsx";
import Ofertas from "./pages/Ofertas.jsx";

import AdminCategorias from "./pages/AdminCategorias.jsx";
import AdminUsuarios from "./pages/AdminUsuarios.jsx";

import LayoutAdmin from "./components/LayoutAdmin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import StockCritico from "./pages/StockCritico.jsx";
import Reportes from "./pages/Reportes.jsx";

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

        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route element={<Acceso />}><Route path="perfil" element={<Perfil />} /></Route>
        <Route element={<Acceso admin />}>
          <Route path="admin" element={<LayoutAdmin />}>
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<Admin />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="ordenes" element={<Bitacora />} />
            <Route path="stock" element={<StockCritico />} />
            <Route path="reportes" element={<Reportes />} />
          </Route>
          <Route path="bitacora" element={<Bitacora />} />
        </Route>
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<DetalleBlog />} />
        <Route path="ofertas" element={<Ofertas />} />
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