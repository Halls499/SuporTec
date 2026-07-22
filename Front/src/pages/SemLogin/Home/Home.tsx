import "./Home.css";
import heroImage from "../../../assets/images.jpeg";
import { motion } from "framer-motion";

function Home() {
  return (
    <main>
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <motion.div className="hero-text">
          <motion.h1>Gestão de chamados de TI simples e rápida</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Organize, acompanhe e resolva solicitações de suporte técnico em um
            único sistema.
          </motion.p>

          <motion.a
            href="/cadastro"
            className="btn-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            exit={{ opacity: 1, y: 0 }}
          >
            Começar
          </motion.a>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img src={heroImage} alt="Preview do sistema" />
        </motion.div>
      </motion.section>
    </main>
  );
}

export default Home;
