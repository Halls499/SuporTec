import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function TecnicoRoute({ children }: Props) {
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  } catch (error) {
    console.error("Erro ao ler dados do usuário no localStorage:", error);
    usuario = null;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.tipo_usuario !== "tecnico") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default TecnicoRoute;