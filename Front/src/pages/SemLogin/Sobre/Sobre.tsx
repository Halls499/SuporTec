import "./Sobre.css";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
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

function Sobre() {
  return (
    <motion.div
      className="sobre"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants}>Sobre Nós</motion.h1>
      <motion.p variants={itemVariants}>
        A SuporTec é uma plataforma criada para simplificar o gerenciamento de
        chamados de TI, permitindo que usuários solicitem suporte e acompanhem a
        resolução de problemas de forma rápida e organizada.
      </motion.p>
    </motion.div>
  );
}

export default Sobre;