import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./Detalhes.css";
import { motion, AnimatePresence } from "framer-motion";

const MotionLink = motion(Link);

interface Chamado {
  id_chamado: number;
  titulo: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  situacao: string;
  data_abertura: string;
}

interface Mensagem {
  id_mensagem: number;
  mensagem: string;
  data_envio: string;
  fk_usuario: number;
  fk_chamado: number;
  nome_usuario?: string; // Caso seu backend traga o nome do usuário
}

function Detalhes() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [textoMensagem, setTextoMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const baseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  // Carregar detalhes do chamado e mensagens
  useEffect(() => {
    const carregarDados = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErro("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        // 1. Busca os detalhes do chamado
        const responseChamado = await fetch(`${baseUrl}/api/chamados/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!responseChamado.ok) {
          throw new Error("Não foi possível carregar os detalhes do chamado.");
        }

        const dataChamado = await responseChamado.json();
        const chamadoFinal = Array.isArray(dataChamado) ? dataChamado[0] : dataChamado;
        setChamado(chamadoFinal);

        // 2. Busca as mensagens do chat deste chamado
        const responseMensagens = await fetch(`${baseUrl}/api/chat/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (responseMensagens.ok) {
          const dataMensagens = await responseMensagens.json();
          // Se o backend retornar a mensagem de que não há mensagens (string), tratamos como array vazio
          if (Array.isArray(dataMensagens)) {
            setMensagens(dataMensagens);
          } else {
            setMensagens([]);
          }
        }
      } catch (err: any) {
        setErro(err.message || "Erro ao buscar dados.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      carregarDados();
    }
  }, [id, baseUrl]);

  // Enviar nova mensagem
  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoMensagem.trim()) return;

    const token = localStorage.getItem("token");
    // Pega o ID do usuário logado do localStorage (ajuste a chave conforme o seu sistema salva)
    const fk_usuario = localStorage.getItem("id_usuario") || 1; 

    setEnviando(true);

    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensagem: textoMensagem,
          fk_usuario: Number(fk_usuario),
          fk_chamado: Number(id),
        }),
      });

      if (response.ok) {
        const novaMensagemCriada = await response.json();
        // Adiciona a nova mensagem na lista local para aparecer na hora
        setMensagens((prev) => [...prev, novaMensagemCriada]);
        setTextoMensagem(""); // Limpa o input
      } else {
        alert("Erro ao enviar mensagem.");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro de conexão ao enviar mensagem.");
    } finally {
      setEnviando(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleConfirmarCancelamento = async () => {
    setShowModal(false);
    setIsCanceling(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}/api/chamados/cancelar/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Chamado cancelado com sucesso!");
        navigate("/chamados");
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

        {/* SEÇÃO DO CHAT */}
        <div className="chat-section" style={{ marginTop: "30px", borderTop: "1px solid #333", paddingTop: "20px" }}>
          <h3>Conversa do Chamado</h3>
          
          <div className="chat-mensagens-container" style={{ minHeight: "150px", maxHeight: "300px", overflowY: "auto", background: "rgba(0,0,0,0.2)", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
            {mensagens.length === 0 ? (
              <p style={{ color: "#aaa", textAlign: "center" }}>Ainda não há mensagens nesta conversa.</p>
            ) : (
              mensagens.map((msg) => (
                <div key={msg.id_mensagem} style={{ marginBottom: "12px", padding: "8px 12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                    <span>Usuário #{msg.fk_usuario}</span>
                    <span>{formatarData(msg.data_envio)}</span>
                  </div>
                  <p style={{ color: "#fff", margin: 0 }}>{msg.mensagem}</p>
                </div>
              ))
            )}
          </div>

          {/* FORMULÁRIO DE ENVIO */}
          <form onSubmit={handleEnviarMensagem} style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={textoMensagem}
              onChange={(e) => setTextoMensagem(e.target.value)}
              placeholder="Digite sua mensagem..."
              style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #444", background: "#111", color: "#fff" }}
              disabled={enviando || chamado.situacao === "Cancelado"}
            />
            <button
              type="submit"
              disabled={enviando || chamado.situacao === "Cancelado"}
              style={{ padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "20px",
            alignItems: "center",
          }}
        >
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