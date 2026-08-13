import "./Dashboard.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const MotionLink = motion(Link);

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

  async function ativarNotificacoesPush() {
    // 1. Verifica se o navegador suporta
    if (
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      console.log("Este navegador não suporta notificações Push.");
      return;
    }

    // 2. Pede a permissão caso ainda não tenha sido concedida
    let permissao = Notification.permission;

    if (permissao === "default") {
      permissao = await Notification.requestPermission();
    }

    if (permissao !== "granted") {
      console.log("Usuário negou a permissão de notificação.");
      return;
    }

    try {
      // 3. Registra o Service Worker (sw.js)
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registrado com sucesso!");

      // 4. Faz a inscrição no PushManager
      const publicVapidKey =
        "BEVANANHE89wDqDfDCKtDZSwi6uSPD8NIrxcbgRIQxeZpzo_Bl5acZ5L8Wh-SlpAZAas_lhNIRdvP8BL9iEUJl0";

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKey,
      });

      // 5. Pega o token salvo no login e envia a inscrição para o MySQL via backend
      const token = localStorage.getItem("token");
      const baseUrl = (
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      ).replace(/\/$/, "");

      await fetch(`${baseUrl}/api/push/salvar-inscricao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      });
      console.log(
        "Notificações Push configuradas e salvas no banco com sucesso!",
      );
    } catch (err) {
      console.error("Erro ao ativar notificações push:", err);
    }
  }

  // useEffect para buscar chamados e solicitar notificação ao carregar a página
  useEffect(() => {
    ativarNotificacoesPush(); // Função para ativar notificações push

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

        {/* Cards de Resumo */}
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

        {/* Tabela de Chamados Recentes */}
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
              <p className="dashboard-msg-status">
                Carregando seus chamados...
              </p>
            ) : recentes.length === 0 ? (
              <p className="dashboard-msg-status">Nenhum chamado encontrado.</p>
            ) : (
              recentes.map((ticket) => (
                <MotionLink
                  to={`/chamados/${ticket.id_chamado}`}
                  key={ticket.id_chamado}
                  className="ticket-link-wrapper"
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
