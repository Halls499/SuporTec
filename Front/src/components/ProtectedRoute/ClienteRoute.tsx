import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function ClienteRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  } catch (error) {
    console.error("Erro ao ler dados do usuário no localStorage:", error);
    usuario = null;
  }

  // 🔒 1. Valida se o token existe E se o usuário está no localStorage
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 2. Garante que apenas usuários com o tipo "cliente" acessem
  if (usuario.tipo_usuario !== "cliente") {
    return <Navigate to="/dashboard-tecnico" replace />;
  }

  return <>{children}</>;
}

export default ClienteRoute;
