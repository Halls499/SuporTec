import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function PrivateRoute({ children }: Props) {
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

  return <>{children}</>;
}

export default PrivateRoute;