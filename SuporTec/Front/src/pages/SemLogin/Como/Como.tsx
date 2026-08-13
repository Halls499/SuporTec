import { motion, type Variants } from "framer-motion";
import "./Como.css";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
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

function Como() {
  return (
    <motion.div
      className="como-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={cardVariants}>Como Funciona</motion.h1>

      <motion.p variants={cardVariants}>
        Ao acessar a plataforma e realizar o login, o usuário poderá abrir
        chamados para solicitar suporte técnico especializado. Além disso, será
        possível acompanhar o andamento de cada solicitação por meio dos
        diferentes status disponíveis:
      </motion.p>

      <div className="status-container">
        <motion.div
          className="status-card"
          variants={cardVariants}
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>✅</span>
          <h2>Chamado resolvido</h2>
          <p>O problema foi solucionado com sucesso.</p>
        </motion.div>

        <motion.div
          className="status-card"
          variants={cardVariants}
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>⏳</span>
          <h2>Aguardando resposta</h2>
          <p>
            O chamado está aguardando uma interação ou retorno do técnico
            responsável.
          </p>
        </motion.div>

        <motion.div
          className="status-card"
          variants={cardVariants}
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>🔧</span>
          <h2>Em atendimento</h2>
          <p>
            O técnico está analisando e trabalhando na resolução do problema.
          </p>
        </motion.div>

        <motion.div
          className="status-card"
          variants={cardVariants}
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>💬</span>
          <h2>Respondido</h2>
          <p>
            O técnico já enviou uma resposta, porém o atendimento ainda não foi
            iniciado.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Como;