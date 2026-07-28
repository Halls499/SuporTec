import "./ChamadosTecnico.css";
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

interface Chamado {
  id: number;
  cliente: string;
  problema: string;
  prioridade: string;
  status: string;
  dataAbertura: string;
}

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

function ChamadosTecnico() {
  const navigate = useNavigate();

  const chamados: Chamado[] = [
    {
      id: 1,
      cliente: "João da Silva",
      problema: "Computador não liga",
      prioridade: "🔴 Alta",
      status: "📥 Novo",
      dataAbertura: "07/07/2026",
    },
    {
      id: 2,
      cliente: "Maria Souza",
      problema: "Impressora sem conexão",
      prioridade: "🟡 Média",
      status: "🔧 Em atendimento",
      dataAbertura: "06/07/2026",
    },
    {
      id: 3,
      cliente: "Carlos Henrique",
      problema: "Erro no Outlook",
      prioridade: "🟢 Baixa",
      status: "💬 Aguardando resposta",
      dataAbertura: "05/07/2026",
    },
    {
      id: 4,
      cliente: "Ana Paula",
      problema: "Internet muito lenta",
      prioridade: "🔴 Alta",
      status: "✅ Resolvido",
      dataAbertura: "04/07/2026",
    },
  ];

  function handleChamadoClick(chamadoId: number) {
    navigate(`/tecnico/chamados/${chamadoId}`);
  }

  return (
    <main className="chamados-tecnico-page">
      <motion.div
        className="chamados-tecnico-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={cardVariants}>Chamados atribuídos</motion.h1>

        <motion.p className="subtitle" variants={cardVariants}>
          Gerencie os chamados sob sua responsabilidade.
        </motion.p>

        <motion.div className="chamados-list" variants={containerVariants}>
          {chamados.length > 0 ? (
            chamados.map((chamado) => (
              <motion.div
                key={chamado.id}
                className="chamado-card"
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <h2>Chamado #{String(chamado.id).padStart(3, "0")}</h2>

                <p>
                  <strong>👤 Cliente:</strong> {chamado.cliente}
                </p>

                <p>
                  <strong>💻 Problema:</strong> {chamado.problema}
                </p>

                <p>
                  <strong>🚨 Prioridade:</strong> {chamado.prioridade}
                </p>

                <p>
                  <strong>📌 Status:</strong> {chamado.status}
                </p>

                <p>
                  <strong>📅 Aberto em:</strong> {chamado.dataAbertura}
                </p>

                <motion.button
                  className="btn-atender"
                  onClick={() => handleChamadoClick(chamado.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Atender chamado
                </motion.button>
              </motion.div>
            ))
          ) : (
            <motion.p className="sem-chamados" variants={cardVariants}>
              Nenhum chamado atribuído no momento.
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </main>
  );
}

export default ChamadosTecnico;