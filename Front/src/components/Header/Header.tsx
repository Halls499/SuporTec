import "./Header.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="topbar">
      <Link className="logo-area" to="/">
        <div className="logo">
          <img src={logo} alt="Logo SuporTec" />

          <h1>SuporTec</h1>
        </div>
      </Link>

      <nav className="topbar-actions">
        <Link to="/sobre">Sobre</Link>

        <Link to="/como">Como funciona</Link>

        <Link to="/suporte">Suporte</Link>

        <Link to="/login" className="btn-entrar">
          Entrar
        </Link>
      </nav>
    </header>
  );
}

export default Header;
