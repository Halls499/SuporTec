import "./Sobre.css";
import { motion } from "framer-motion";

function Sobre() {
  return (
    <motion.div
      className="sobre"
      initial={{ opacity: 0.7, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <motion.h1>Sobre Nós</motion.h1>
      <motion.p
        initial={{ opacity: 0.7, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        A SuporTec é uma plataforma criada para simplificar o gerenciamento de
        chamados de TI, permitindo que usuários solicitem suporte e acompanhem a
        resolução de problemas de forma rápida e organizada.
      </motion.p>
    </motion.div>
  );
}

export default Sobre;
