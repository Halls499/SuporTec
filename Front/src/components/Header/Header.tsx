import "./Header.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
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

function Header() {
  return (
    <motion.header
      className="topbar"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <Link className="logo-area" to="/">
        <motion.div
          className="logo"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <img src={logo} alt="Logo SuporTec" />
          <h1>SuporTec</h1>
        </motion.div>
      </Link>

      <nav className="topbar-actions">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/sobre">Sobre</Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/como">Como funciona</Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/suporte">Suporte</Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/login" className="btn-entrar">
            Entrar
          </Link>
        </motion.div>
      </nav>
    </motion.header>
  );
}

export default Header;
