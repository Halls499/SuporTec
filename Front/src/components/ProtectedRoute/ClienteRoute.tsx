import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function ClienteRoute({ children }: Props) {
  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "null"
  );

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (usuario.tipo_usuario !== "cliente") {
    return <Navigate to="/dashboard-tecnico" />;
  }

  return children;
}

export default ClienteRoute;