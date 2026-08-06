import "./DetalhesTecnico.css";
import { Link, useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";

interface ChamadoDetalhes {
  id_chamado: number;
  titulo: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  situacao: string;
  data_abertura: string;
  nome_solicitante?: string;
  contato?: string;
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

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function DetalhesTecnico() {
  const { id } = useParams<{ id: string }>();
  const [chamado, setChamado] = useState<ChamadoDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [novaResposta, setNovaResposta] = useState("");
  const [novoStatus, setNovoStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // 🔄 Busca os dados reais do chamado na API
  useEffect(() => {
    async function carregarDetalhes() {
      const token = localStorage.getItem("token");
      const baseUrl = (
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      ).replace(/\/$/, "");

      try {
        const resposta = await fetch(`${baseUrl}/api/chamados/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          setChamado(dados);
          setNovoStatus(dados.situacao || "Novo");
        }
      } catch (err) {
        console.error("Erro ao carregar chamado:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) carregarDetalhes();
  }, [id]);

  // 📝 Atualiza o status do chamado no backend
  const handleAtualizarStatus = async () => {
    if (!id) return;
    setIsUpdatingStatus(true);
    const token = localStorage.getItem("token");
    const baseUrl = (
      import.meta.env.VITE_API_URL || "http://localhost:3000"
    ).replace(/\/$/, "");

    try {
      const resposta = await fetch(`${baseUrl}/api/chamados/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ situacao: novoStatus }),
      });

      if (resposta.ok) {
        alert("Status atualizado com sucesso!");
        if (chamado) {
          setChamado({ ...chamado, situacao: novoStatus });
        }
      } else {
        alert("Erro ao atualizar o status.");
      }
    } catch (err) {
      console.error("Erro na requisição de atualização:", err);
      alert("Falha de comunicação com o servidor.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatarData = (dataIso?: string) => {
    if (!dataIso) return "Data indisponível";
    return new Date(dataIso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="detalhes-tecnico-page">
        <p style={{ color: "#fff", textAlign: "center", marginTop: "40px" }}>
          Carregando informações do chamado...
        </p>
      </main>
    );
  }

  if (!chamado) {
    return (
      <main className="detalhes-tecnico-page">
        <p style={{ color: "#fff", textAlign: "center", marginTop: "40px" }}>
          Chamado não encontrado.
        </p>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/ChamadosTecnico" className="btn-voltar">
            ← Voltar aos chamados
          </Link>
        </div>
      </main>
    );
  }

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
          <h2>Chamado #{String(chamado.id_chamado).padStart(3, "0")}</h2>
          <div className="info-group">
            <p>
              <strong>👤 Cliente:</strong>{" "}
              {chamado.nome_solicitante || "Não informado"}
            </p>
            <p>
              <strong>📞 Contato:</strong> {chamado.contato || "Não informado"}
            </p>
            <p>
              <strong>💻 Problema:</strong> {chamado.titulo}
            </p>
            <p>
              <strong>📂 Categoria:</strong> {chamado.categoria}
            </p>
            <p>
              <strong>🚨 Prioridade:</strong> {chamado.prioridade}
            </p>
            <p>
              <strong>📌 Status:</strong> {chamado.situacao}
            </p>
            <p>
              <strong>📅 Aberto em:</strong>{" "}
              {formatarData(chamado.data_abertura)}
            </p>
            <p>
              <strong>📝 Descrição:</strong>
            </p>
            <p className="descricao">{chamado.descricao}</p>
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
              <strong>👤 {chamado.nome_solicitante || "Cliente"}</strong>
              <p>{chamado.descricao}</p>
              <span>{formatarData(chamado.data_abertura)}</span>
            </motion.div>
          </div>
        </motion.section>

        {/* Resposta */}
        <motion.section className="detalhes-card" variants={itemVariants}>
          <h2>Responder chamado</h2>
          <motion.textarea
            placeholder="Digite uma resposta ao cliente..."
            value={novaResposta}
            onChange={(e) => setNovaResposta(e.target.value)}
            whileFocus={{ scale: 1.01, borderColor: "#3b82f6" }}
          />
          <motion.button
            className="btn-enviar"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (novaResposta.trim()) {
                alert("Resposta enviada com sucesso!");
                setNovaResposta("");
              }
            }}
          >
            Enviar resposta
          </motion.button>
        </motion.section>

        {/* Status */}
        <motion.section className="detalhes-card" variants={itemVariants}>
          <h2>Atualizar status</h2>
          <motion.select
            value={novoStatus}
            onChange={(e) => setNovoStatus(e.target.value)}
            whileFocus={{ scale: 1.01 }}
          >
            <option value="Novo">Novo</option>
            <option value="Em atendimento">Em atendimento</option>
            <option value="Aguardando resposta">Aguardando resposta</option>
            <option value="Resolvido">Resolvido</option>
            <option value="Cancelado">Cancelado</option>
          </motion.select>
          <motion.button
            className="btn-salvar"
            onClick={handleAtualizarStatus}
            disabled={isUpdatingStatus}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isUpdatingStatus ? "Salvando..." : "Salvar alterações"}
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
