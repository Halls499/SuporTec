import { Link } from "react-router-dom";
import "./Detalhes.css";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

function Detalhes() {
  return (
    <main className="detalhes-page">
      <motion.div
        className="detalhes-container"
        initial={{ opacity: 0.7, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Chamado #001</h1>

        <motion.div
          className="info-chamado"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2 }}
        >
          <h2>Chamado #001</h2>
          <p>Problema: Computador não liga</p>
          <p>Categoria: Hardware</p>
          <p>Status: 🔧 Em andamento</p>
          <p>Prioridade: 🕒 Média</p>
          <p>Descrição: O computador não liga ao ser ligado.</p>
          <p>Aberto em: 07/07/2026</p>
        </motion.div>

        <motion.div
          className="chat-chamado"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.4 }}
        >
          <h2>Histórico de comunicações</h2>
          <p>Usuário: João da Silva</p>
          <p>Mensagem: O computador não liga ao ser ligado.</p>
          <p>Data: 07/07/2026</p>
          <p>Suporte: Maria Souza</p>
          <p>Mensagem: Estamos verificando o problema.</p>
          <p>Data: 08/07/2026</p>
        </motion.div>

        <MotionLink
          to="/Chamados"
          className="new-ticket"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Voltar aos chamados
        </MotionLink>
      </motion.div>
    </main>
  );
}

export default Detalhes;
