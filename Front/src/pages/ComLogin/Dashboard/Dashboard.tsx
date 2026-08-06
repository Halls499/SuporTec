import "./Dashboard.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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

interface Chamado {
  id_chamado: number;
  titulo: string;
  situacao: string;
  data_abertura: string;
}

function Dashboard() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca chamados reais do backend SaaS
  useEffect(() => {
    const buscarChamados = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = (
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      ).replace(/\/$/, "");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/api/chamados`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setChamados(data);
        }
      } catch (err) {
        console.error("Erro ao carregar chamados na dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    buscarChamados();
  }, []);

  // 📊 Cálculo dinâmico dos cards de métricas baseados nos dados da organização do cliente
  const resolvidos = chamados.filter((c) =>
    c.situacao?.toLowerCase().includes("resolvido"),
  ).length;
  const emAndamento = chamados.filter((c) =>
    c.situacao?.toLowerCase().includes("andamento"),
  ).length;
  const novosOuAguardando = chamados.filter(
    (c) =>
      c.situacao?.toLowerCase().includes("novo") ||
      c.situacao?.toLowerCase().includes("aguardando"),
  ).length;
  const cancelados = chamados.filter((c) =>
    c.situacao?.toLowerCase().includes("cancelado"),
  ).length;

  // Pega os 5 chamados mais recentes
  const recentes = chamados.slice(0, 5);

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

        {/* Cards de Resumo Animados com Dados Dinâmicos */}
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
            <h2>{resolvidos}</h2>
            <p>Resolvidos</p>
          </motion.div>

          <motion.div
            className="summary-card"
            variants={itemVariants}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>⏳</span>
            <h2>{novosOuAguardando}</h2>
            <p>Novos / Aguardando</p>
          </motion.div>

          <motion.div
            className="summary-card"
            variants={itemVariants}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>🔧</span>
            <h2>{emAndamento}</h2>
            <p>Em andamento</p>
          </motion.div>

          <motion.div
            className="summary-card"
            variants={itemVariants}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>🚫</span>
            <h2>{cancelados}</h2>
            <p>Cancelados</p>
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

            {loading ? (
              <p
                style={{ color: "#aaa", padding: "15px", textAlign: "center" }}
              >
                Carregando seus chamados...
              </p>
            ) : recentes.length === 0 ? (
              <p
                style={{ color: "#aaa", padding: "15px", textAlign: "center" }}
              >
                Nenhum chamado encontrado.
              </p>
            ) : (
              recentes.map((ticket) => (
                <MotionLink
                  to={`/chamados/${ticket.id_chamado}`}
                  key={ticket.id_chamado}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <motion.div
                    className="ticket"
                    whileHover={{ scale: 1.01, x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>#{ticket.id_chamado}</span>
                    <span>{ticket.titulo}</span>
                    <span>
                      {ticket.situacao?.toLowerCase().includes("resolvido") &&
                        "✅ "}
                      {ticket.situacao?.toLowerCase().includes("andamento") &&
                        "🔧 "}
                      {ticket.situacao?.toLowerCase().includes("cancelado") &&
                        "🚫 "}
                      {ticket.situacao}
                    </span>
                  </motion.div>
                </MotionLink>
              ))
            )}
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
