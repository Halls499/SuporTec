import "./HeaderUser.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { motion, type Variants } from "framer-motion";

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

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
    usuario.tipo_usuario === "tecnico" ? "/dashboard-tecnico" : "/dashboard";

  return (
    <motion.header
      className="topbar-user"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <Link className="logo-area" to={rotaInicial}>
        <motion.div
          className="logo-user"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <img src={logo} alt="Logo SuporTec" />
          <h1>SuporTec</h1>
        </motion.div>
      </Link>
      <nav className="user-actions">
        {usuario.tipo_usuario === "tecnico" ? (
          <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/dashboard-tecnico">Dashboard</Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/ChamadosTecnico">Chamados</Link>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/dashboard">Dashboard</Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/chamados">Chamados</Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/abrir-chamado">Abrir Chamado</Link>
            </motion.div>
          </>
        )}
      </nav>
      // 🛠️ Ajuste no avatar e no nome para evitar erro de runtime
      <div className="user">
        <div className="user-info">
          <motion.div
            className="avatar"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : "U"}
          </motion.div>

          <span>{usuario?.nome || "Usuário"}</span>
        </div>

        <motion.button
          className="logout"
          onClick={logout}
          whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          Sair
        </motion.button>
      </div>
    </motion.header>
  );
}

export default HeaderUser;
