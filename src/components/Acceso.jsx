import { Navigate, Outlet } from "react-router-dom";
import { useSkyOps } from "../context/SkyOpsContext.jsx";

export default function Acceso({ admin = false }) {
  const { usuario } = useSkyOps();
  if (!usuario) return <Navigate to="/login" replace />;
  if (admin && usuario.rol !== "admin") return <Navigate to="/perfil" replace />;
  return <Outlet />;
}
