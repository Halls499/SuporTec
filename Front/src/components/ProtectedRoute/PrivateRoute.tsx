import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function PrivateRoute({ children }: Props) {
  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "null"
  );

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;