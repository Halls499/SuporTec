import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function PrivateRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  } catch (error) {
    console.error("Erro ao ler dados do usuário no localStorage:", error);
    usuario = null;
  }

  // 🔒 Se não houver token OU usuário salvo, redireciona para a tela de login
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
