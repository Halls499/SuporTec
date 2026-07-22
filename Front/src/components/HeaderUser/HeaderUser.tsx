import "./HeaderUser.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

interface HeaderUserProps {
  usuario: {
    nome: string;
    tipo_usuario: string;
  };
}

function HeaderUser({ usuario }: HeaderUserProps) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("login"));

    navigate("/login");
  }

  const rotaInicial =
    usuario.tipo_usuario === "tecnico"
      ? "/dashboard-tecnico"
      : "/dashboard";

  return (
    <header className="topbar-user">
      <Link className="logo-area" to={rotaInicial}>
        <div className="logo-user">
          <img src={logo} alt="Logo SuporTec" />
          <h1>SuporTec</h1>
        </div>
      </Link>

      <nav className="user-actions">
        {usuario.tipo_usuario === "tecnico" ? (
          <>
            <Link to="/dashboard-tecnico">Dashboard</Link>
            <Link to="/ChamadosTecnico">Chamados</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/chamados">Chamados</Link>
            <Link to="/abrir-chamado">Abrir Chamado</Link>
          </>
        )}
      </nav>

      <div className="user">
        <div className="user-info">
          <div className="avatar">
            {usuario.nome.charAt(0).toUpperCase()}
          </div>

          <span>{usuario.nome}</span>
        </div>

        <button className="logout" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}

export default HeaderUser;