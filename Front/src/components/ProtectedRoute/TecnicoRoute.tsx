import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function TecnicoRoute({ children }: Props) {
  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "null"
  );

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (usuario.tipo_usuario !== "tecnico") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default TecnicoRoute;