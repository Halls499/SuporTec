import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./Detalhes.css";
import { motion, AnimatePresence } from "framer-motion";

const MotionLink = motion(Link);

// Interface para tipar os dados do chamado
interface Chamado {
  id_chamado: number;
  titulo: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  situacao: string;
  data_abertura: string;
}

function Detalhes() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Estados da página
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Estado para controlar a exibição do Modal de Confirmação
  const [showModal, setShowModal] = useState(false);

  // Define a URL base dinamicamente (com fallback local para desenvolvimento)
  const baseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  useEffect(() => {
  const carregarDetalhes = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ PRIMEIRO: Faz a requisição e declara 'responseChamado'
      const responseChamado = await fetch(`${baseUrl}/api/chamados/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // 2️⃣ SEGUNDO: Valida se a resposta foi de erro (agora responseChamado já existe!)
      if (!responseChamado.ok) {
        throw new Error("Não foi possível carregar os detalhes do chamado.");
      }

      // 3️⃣ TERCEIRO: Converte para JSON
      const dataChamado = await responseChamado.json();
      console.log("Dados do chamado recebidos:", dataChamado);

      // Tratamento caso a API retorne array [ {...} ] ou objeto direto { ... }
      const chamadoFinal = Array.isArray(dataChamado) ? dataChamado[0] : dataChamado;

      setChamado(chamadoFinal);
    } catch (err: any) {
      setErro(err.message || "Erro ao buscar dados do chamado.");
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    carregarDetalhes();
  }
}, [id, baseUrl]);

  // Função para abrir o Modal de Confirmação
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Função para efetuar a requisição de cancelamento no backend
  const handleConfirmarCancelamento = async () => {
    setShowModal(false); // Fecha o modal
    setIsCanceling(true);

    try {
      const token = localStorage.getItem("token");

      // 🏢 2. Atualiza a requisição para PATCH e aponta para o endpoint correto
      const response = await fetch(`${baseUrl}/api/chamados/${id}/cancelar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Chamado cancelado com sucesso!");
        navigate("/chamados"); // 3. Redireciona para a lista de chamados
      } else {
        const data = await response.json();
        alert(data.mensagem || "Erro ao cancelar chamado.");
      }
    } catch (error) {
      console.error("Erro ao cancelar chamado:", error);
      alert("Erro de conexão ao tentar cancelar o chamado.");
    } finally {
      setIsCanceling(false);
    }
  };

  // Função auxiliar para formatar datas no padrão BR
  const formatarData = (dataIso?: string) => {
    if (!dataIso) return "Data não disponível";
    const data = new Date(dataIso);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Funções auxiliares para mapear as cores das Badges
  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("novo")) return "badge-novo";
    if (statusLower.includes("andamento")) return "badge-em-andamento";
    if (statusLower.includes("resolvido")) return "badge-resolvido";
    if (statusLower.includes("cancelado")) return "badge-cancelado";
    return "badge-novo";
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const prioridadeLower = prioridade?.toLowerCase() || "";
    if (prioridadeLower.includes("alta")) return "badge-alta";
    if (prioridadeLower.includes("media") || prioridadeLower.includes("média"))
      return "badge-media";
    return "badge-baixa";
  };

  if (loading) {
    return (
      <main className="detalhes-page">
        <p style={{ textAlign: "center", color: "#fff", marginTop: "50px" }}>
          Carregando detalhes do chamado...
        </p>
      </main>
    );
  }

  if (erro || !chamado) {
    return (
      <main className="detalhes-page">
        <div className="detalhes-container" style={{ textAlign: "center" }}>
          <h2>Ops! Chamado não encontrado.</h2>
          <p>{erro}</p>
          <MotionLink
            to="/chamados"
            className="new-ticket"
            style={{ marginTop: "20px" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Voltar aos chamados
          </MotionLink>
        </div>
      </main>
    );
  }

  return (
    <main className="detalhes-page">
      <motion.div
        className="detalhes-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1>{String(chamado.titulo)}</h1>

        <motion.div
          className="info-chamado"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2>Detalhes das Informações</h2>
          <p>
            <strong>Categoria:</strong> {chamado.categoria}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`badge ${getStatusBadge(chamado.situacao)}`}>
              {chamado.situacao}
            </span>
          </p>
          <p>
            <strong>Prioridade:</strong>{" "}
            <span className={`badge ${getPrioridadeBadge(chamado.prioridade)}`}>
              {chamado.prioridade}
            </span>
          </p>
          <p>
            <strong>Descrição:</strong> {chamado.descricao}
          </p>
          <p>
            <strong>Aberto em:</strong> {formatarData(chamado.data_abertura)}
          </p>
        </motion.div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "20px",
            alignItems: "center",
          }}
        >
          {/* Botão Azul - Voltar */}
          <MotionLink
            to="/chamados"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "6px",
              border: "none",
              fontWeight: "600",
              fontSize: "14px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "42px",
              boxSizing: "border-box",
              cursor: "pointer",
            }}
            whileHover={{ scale: 1.05, backgroundColor: "#1d4ed8" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Voltar aos chamados
          </MotionLink>

          {/* Botão Vermelho - Cancelar Chamado */}
          <AnimatePresence>
            {chamado.situacao !== "Cancelado" &&
              chamado.situacao !== "Resolvido" && (
                <motion.button
                  onClick={handleOpenModal}
                  disabled={isCanceling}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05, backgroundColor: "#b91c1c" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    padding: "10px 18px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "600",
                    fontSize: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "42px",
                    boxSizing: "border-box",
                    cursor: isCanceling ? "not-allowed" : "pointer",
                    gap: "8px",
                  }}
                >
                  {isCanceling ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      style={{ display: "inline-block" }}
                    >
                      ⏳
                    </motion.span>
                  ) : (
                    "Cancelar Chamado"
                  )}
                </motion.button>
              )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* MODAL DE CONFIRMAÇÃO CUSTOMIZADO */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-container"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-icon">⚠️</div>
              <h2>Cancelar Chamado?</h2>
              <p>
                Tem certeza de que deseja cancelar este chamado? Esta ação não
                pode ser desfeita.
              </p>

              <div className="modal-actions">
                <button
                  className="btn-cancelar-modal"
                  onClick={() => setShowModal(false)}
                >
                  Voltar
                </button>

                <button
                  className="btn-confirmar-modal"
                  onClick={handleConfirmarCancelamento}
                >
                  Sim, cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Detalhes;
