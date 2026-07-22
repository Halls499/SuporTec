import { motion } from "framer-motion";
import "./Como.css";

function Como() {
  return (
    <motion.div
      className="como-container"
      initial={{ opacity: 0.7, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
    >
      <h1>Como Funciona</h1>

      <p>
        Ao acessar a plataforma e realizar o login, o usuário poderá abrir
        chamados para solicitar suporte técnico especializado. Além disso, será
        possível acompanhar o andamento de cada solicitação por meio dos
        diferentes status disponíveis:
      </p>

      <div className="status-container">
        <motion.div
          className="status-card"
          initial={{ opacity: 0.7, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeIn",
          }}
        >
          <span>✅</span>
          <h2>Chamado resolvido</h2>
          <p>O problema foi solucionado com sucesso.</p>
        </motion.div>

        <motion.div
          className="status-card"
          initial={{ opacity: 0.7, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeIn",
          }}
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
          initial={{ opacity: 0.7, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeIn",
          }}
        >
          <span>🔧</span>
          <h2>Em atendimento</h2>
          <p>
            O técnico está analisando e trabalhando na resolução do problema.
          </p>
        </motion.div>

        <motion.div
          className="status-card"
          initial={{ opacity: 0.7, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeIn",
          }}
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
