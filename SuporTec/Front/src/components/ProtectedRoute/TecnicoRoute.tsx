import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function TecnicoRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  } catch (error) {
    console.error("Erro ao ler dados do usuário no localStorage:", error);
    usuario = null;
  }

  // 🔒 1. Valida se o token existe E se os dados do usuário estão no localStorage
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 2. Redireciona para o dashboard do cliente se o tipo não for "tecnico"
  if (usuario.tipo_usuario !== "tecnico") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default TecnicoRoute;
