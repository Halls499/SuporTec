import "./DetalhesTecnico.css";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function DetalhesTecnico() {
  return (
    <main className="detalhes-tecnico-page">
      <motion.div
        className="detalhes-tecnico-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants}>Detalhes do chamado</motion.h1>

        <motion.p className="subtitle" variants={itemVariants}>
          Visualize as informações do chamado, responda o cliente e atualize o
          status do atendimento.
        </motion.p>

        {/* Informações */}
        <motion.section className="detalhes-card" variants={itemVariants}>
          <h2>Chamado #001</h2>
          <div className="info-group">
            <p><strong>👤 Cliente:</strong> João da Silva</p>
            <p><strong>👨‍💻 Técnico responsável:</strong> Raul</p>
            <p><strong>💻 Problema:</strong> Computador não liga</p>
            <p><strong>📂 Categoria:</strong> Hardware</p>
            <p><strong>🚨 Prioridade:</strong> Alta</p>
            <p><strong>📌 Status:</strong> Em andamento</p>
            <p><strong>📅 Aberto em:</strong> 04/07/2026</p>
            <p><strong>📝 Descrição:</strong></p>
            <p className="descricao">
              O computador não apresenta nenhum sinal de funcionamento ao
              pressionar o botão de ligar.
            </p>
          </div>
        </motion.section>

        {/* Histórico */}
        <motion.section className="detalhes-card" variants={itemVariants}>
          <h2>Histórico de mensagens</h2>
          <div className="chat-box">
            <motion.div 
              className="mensagem cliente"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <strong>👤 João da Silva</strong>
              <p>Meu computador não liga desde ontem.</p>
              <span>04/07/2026 - 09:40</span>
            </motion.div>

            <motion.div 
              className="mensagem tecnico"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <strong>👨‍💻 Raul</strong>
              <p>Estou analisando o problema.</p>
              <span>04/07/2026 - 10:15</span>
            </motion.div>
          </div>
        </motion.section>

        {/* Resposta */}
        <motion.section className="detalhes-card" variants={itemVariants}>
          <h2>Responder chamado</h2>
          <motion.textarea 
            placeholder="Digite uma resposta ao cliente..." 
            whileFocus={{ scale: 1.01, borderColor: "#3b82f6" }}
          />
          <motion.button 
            className="btn-enviar"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enviar resposta
          </motion.button>
        </motion.section>

        {/* Status */}
        <motion.section className="detalhes-card" variants={itemVariants}>
          <h2>Atualizar status</h2>
          <motion.select whileFocus={{ scale: 1.01 }}>
            <option>Novo</option>
            <option>Em atendimento</option>
            <option>Aguardando resposta</option>
            <option>Resolvido</option>
          </motion.select>
          <motion.button 
            className="btn-salvar"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Salvar alterações
          </motion.button>
        </motion.section>

        <motion.div variants={itemVariants} style={{ marginTop: "20px" }}>
          <Link to="/ChamadosTecnico" className="btn-voltar">
            ← Voltar aos chamados
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default DetalhesTecnico;