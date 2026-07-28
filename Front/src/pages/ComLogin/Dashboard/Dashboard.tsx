import "./Dashboard.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionLink = motion(Link);

// Variantes para animação em cascata dos cards e tabela
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

function Dashboard() {
  return (
    <main className="home-login-page">
      <motion.section
        className="dashboard-container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="welcome"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Bem-vindo ao SuporTec</h1>
          <p>Acompanhe e gerencie seus chamados de suporte técnico.</p>
        </motion.div>

        {/* Cards de Resumo Animados */}
        <motion.div
          className="summary-cards"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="summary-card"
            variants={itemVariants}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>✅</span>
            <h2>10</h2>
            <p>Resolvidos</p>
          </motion.div>

          <motion.div
            className="summary-card"
            variants={itemVariants}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>⏳</span>
            <h2>5</h2>
            <p>Aguardando resposta</p>
          </motion.div>

          <motion.div
            className="summary-card"
            variants={itemVariants}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>🔧</span>
            <h2>5</h2>
            <p>Em andamento</p>
          </motion.div>

          <motion.div
            className="summary-card"
            variants={itemVariants}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>💬</span>
            <h2>3</h2>
            <p>Respondidos</p>
          </motion.div>
        </motion.div>

        {/* Tabela de Chamados Recentes Animada */}
        <motion.div
          className="recent-tickets"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2>Chamados recentes</h2>

          <div className="ticket-table">
            <div className="ticket-header">
              <span>ID</span>
              <span>Problema</span>
              <span>Status</span>
            </div>

            <motion.div
              className="ticket"
              whileHover={{ scale: 1.01, x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span>#001</span>
              <span>Computador não liga</span>
              <span>🔧 Em andamento</span>
            </motion.div>

            <motion.div
              className="ticket"
              whileHover={{ scale: 1.01, x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span>#002</span>
              <span>Erro no sistema</span>
              <span>⏳ Aguardando</span>
            </motion.div>
          </div>
        </motion.div>

        <MotionLink
          to="/abrir-chamado"
          className="new-ticket"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📝 Abrir chamado
        </MotionLink>
      </motion.section>
    </main>
  );
}

export default Dashboard;