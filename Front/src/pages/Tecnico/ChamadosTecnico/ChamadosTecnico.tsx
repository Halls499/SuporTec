import "./ChamadosTecnico.css";
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";

interface Chamado {
  id_chamado: number;
  nome_solicitante?: string;
  titulo: string;
  prioridade: string;
  situacao: string;
  data_abertura: string;
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
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Busca todos os chamados da organização para o técnico
  useEffect(() => {
    async function carregarChamados() {
      const token = localStorage.getItem("token");
      const baseUrl = (
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      ).replace(/\/$/, "");

      try {
        const resposta = await fetch(`${baseUrl}/api/chamados/tecnico`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const dados = await resposta.json();

        if (resposta.ok) {
          setChamados(Array.isArray(dados) ? dados : []);
        }
      } catch (erro) {
        console.error("Erro ao buscar chamados do técnico:", erro);
      } finally {
        setLoading(false);
      }
    }

    carregarChamados();
  }, []);

  const formatarData = (dataIso: string) => {
    if (!dataIso) return "Data indisponível";
    return new Date(dataIso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPrioridadeEmoji = (prioridade: string) => {
    const p = prioridade?.toLowerCase() || "";
    if (p.includes("alta")) return "🔴 Alta";
    if (p.includes("media") || p.includes("média")) return "🟡 Média";
    return "🟢 Baixa";
  };

  const getStatusEmoji = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("novo")) return "📥 Novo";
    if (s.includes("andamento") || s.includes("atendimento"))
      return "🔧 Em atendimento";
    if (s.includes("aguardando")) return "💬 Aguardando";
    if (s.includes("resolvido")) return "✅ Resolvido";
    if (s.includes("cancelado")) return "🚫 Cancelado";
    return status;
  };

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
          {loading ? (
            <motion.p className="sem-chamados" variants={cardVariants}>
              Carregando chamados...
            </motion.p>
          ) : chamados.length > 0 ? (
            chamados.map((chamado) => (
              <motion.div
                key={chamado.id_chamado}
                className="chamado-card"
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <h2>Chamado #{String(chamado.id_chamado).padStart(3, "0")}</h2>

                <p>
                  <strong>👤 Solicitante:</strong>{" "}
                  {chamado.nome_solicitante || "Não informado"}
                </p>

                <p>
                  <strong>💻 Problema:</strong> {chamado.titulo}
                </p>

                <p>
                  <strong>🚨 Prioridade:</strong>{" "}
                  {getPrioridadeEmoji(chamado.prioridade)}
                </p>

                <p>
                  <strong>📌 Status:</strong> {getStatusEmoji(chamado.situacao)}
                </p>

                <p>
                  <strong>📅 Aberto em:</strong>{" "}
                  {formatarData(chamado.data_abertura)}
                </p>

                <motion.button
                  className="btn-atender"
                  onClick={() => handleChamadoClick(chamado.id_chamado)}
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
