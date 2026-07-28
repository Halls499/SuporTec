import "./Suporte.css";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
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
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

function Suporte() {
  return (
    <motion.main
      className="contact"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants}>
        Qualquer dúvida, entre em contato pelas redes sociais:
      </motion.h1>

      <div className="social-links">
        <motion.a
          href="https://instagram.com/halls.raulzito"
          className="link"
          target="_blank"
          rel="noopener noreferrer"
          variants={itemVariants}
          whileHover={{ scale: 1.08, y: -4 }}
          whileTap={{ scale: 0.92 }}
        >
          <i className="fa-brands fa-instagram fa-2x"></i>
          <span>Instagram</span>
        </motion.a>

        <motion.a
          href="https://github.com/Halls499"
          className="link"
          target="_blank"
          rel="noopener noreferrer"
          variants={itemVariants}
          whileHover={{ scale: 1.08, y: -4 }}
          whileTap={{ scale: 0.92 }}
        >
          <i className="fa-brands fa-github fa-2x"></i>
          <span>GitHub</span>
        </motion.a>
      </div>
    </motion.main>
  );
}

export default Suporte;