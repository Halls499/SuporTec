import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function ClienteRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    // 👈 Removido o "(error)" daqui para o TypeScript parar de reclamar
    usuario = null;
  }

  console.log("Usuário lido no ClienteRoute:", usuario);
  console.log("Tipo do usuário é:", usuario?.tipo_usuario);

  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.tipo_usuario !== "cliente") {
    return <Navigate to="/dashboard-tecnico" replace />;
  }

  return <>{children}</>;
}

export default ClienteRoute;