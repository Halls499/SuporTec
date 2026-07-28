import "./Home.css";
import heroImage from "../../../assets/images.jpeg";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function Home() {
  return (
    <main>
      <motion.section
        className="hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-text">
          <motion.h1 variants={itemVariants}>
            Gestão de chamados de TI simples e rápida
          </motion.h1>

          <motion.p variants={itemVariants}>
            Organize, acompanhe e resolva solicitações de suporte técnico em um
            único sistema.
          </motion.p>

          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: "inline-block" }}
            >
              <Link to="/cadastro" className="btn-main">
                Começar
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="hero-image"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <img src={heroImage} alt="Preview do sistema" />
        </motion.div>
      </motion.section>
    </main>
  );
}

export default Home;