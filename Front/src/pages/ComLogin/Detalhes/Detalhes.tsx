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
  data_abertura?: string;
  criado_em?: string;
  data?: string;
  fk_usuario?: number;
}

interface Mensagem {
  id_mensagem: number;
  mensagem: string;
  data_envio?: string;
  criado_em?: string;
  data?: string;
  fk_usuario: number;
  fk_chamado: number;
  nome_usuario?: string;
  tipo_usuario?: string;
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

  useEffect(() => {
    let isMounted = true;

    const carregarDados = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (isMounted) {
          setErro("Usuário não autenticado. Faça login novamente.");
          setLoading(false);
        }
        return;
      }

      try {
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
        const chamadoFinal = Array.isArray(dataChamado)
          ? dataChamado[0]
          : dataChamado;

        if (isMounted) {
          setChamado(chamadoFinal || null);
        }

        const responseMensagens = await fetch(
          `${baseUrl}/api/chamados/${id}/mensagens`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (responseMensagens.ok) {
          const dataMensagens = await responseMensagens.json();
          if (isMounted) {
            setMensagens(Array.isArray(dataMensagens) ? dataMensagens : []);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setErro(err?.message || "Erro ao buscar dados do servidor.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      carregarDados();
    } else {
      setErro("ID do chamado inválido.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id, baseUrl]);

  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoMensagem.trim() || !id) return;

    const token = localStorage.getItem("token");
    setEnviando(true);

    try {
      const response = await fetch(`${baseUrl}/api/chamados/${id}/mensagens`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensagem: textoMensagem.trim(),
        }),
      });

      if (response.ok) {
        setTextoMensagem("");

        const resMensagens = await fetch(
          `${baseUrl}/api/chamados/${id}/mensagens`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (resMensagens.ok) {
          const dadosNovos = await resMensagens.json();
          setMensagens(Array.isArray(dadosNovos) ? dadosNovos : []);
        }
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data?.erro || "Erro ao enviar mensagem. Tente novamente.");
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

      const response = await fetch(`${baseUrl}/api/chamados/${id}/cancelar`, {
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
        const data = await response.json().catch(() => ({}));
        alert(data?.mensagem || "Erro ao cancelar chamado.");
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
    if (isNaN(data.getTime())) return dataIso;
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status?: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("novo")) return "badge-novo";
    if (statusLower.includes("andamento")) return "badge-em-andamento";
    if (statusLower.includes("resolvido")) return "badge-resolvido";
    if (statusLower.includes("cancelado")) return "badge-cancelado";
    return "badge-novo";
  };

  const getPrioridadeBadge = (prioridade?: string) => {
    const prioridadeLower = prioridade?.toLowerCase() || "";
    if (prioridadeLower.includes("alta")) return "badge-alta";
    if (prioridadeLower.includes("media") || prioridadeLower.includes("média"))
      return "badge-media";
    return "badge-baixa";
  };

  if (loading) {
    return (
      <main className="detalhes-page">
        <p className="detalhes-loading">Carregando detalhes do chamado...</p>
      </main>
    );
  }

  if (erro || !chamado) {
    return (
      <main className="detalhes-page">
        <div className="detalhes-container detalhes-erro">
          <h2>Ops! Chamado não encontrado.</h2>
          <p>{erro || "Não foi possível carregar as informações."}</p>
          <MotionLink
            to="/chamados"
            className="new-ticket"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Voltar aos chamados
          </MotionLink>
        </div>
      </main>
    );
  }

  const dataAbertoChamado =
    chamado.data_abertura || chamado.criado_em || chamado.data;

  return (
    <main className="detalhes-page">
      <motion.div
        className="detalhes-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1>{String(chamado.titulo || "Detalhes do Chamado")}</h1>

        <motion.div
          className="info-chamado"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2>Detalhes das Informações</h2>
          <p>
            <strong>Categoria:</strong> {chamado.categoria || "Não informada"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`badge ${getStatusBadge(chamado.situacao)}`}>
              {chamado.situacao || "Desconhecido"}
            </span>
          </p>
          <p>
            <strong>Prioridade:</strong>{" "}
            <span className={`badge ${getPrioridadeBadge(chamado.prioridade)}`}>
              {chamado.prioridade || "Normal"}
            </span>
          </p>
          <p>
            <strong>Descrição:</strong> {chamado.descricao || "Sem descrição"}
          </p>
          <p>
            <strong>Aberto em:</strong> {formatarData(dataAbertoChamado)}
          </p>
        </motion.div>

        {/* SEÇÃO DO CHAT */}
        <div className="chat-section">
          <h3>Conversa do Chamado</h3>

          <div className="chat-mensagens-container">
            {mensagens.length === 0 ? (
              <p className="chat-vazio">
                Ainda não há mensagens nesta conversa.
              </p>
            ) : (
              mensagens.map((msg) => {
                // Pega o ID de dentro do objeto "usuario" salvo no login
                const usuarioSalvo = JSON.parse(
                  localStorage.getItem("usuario") || "{}",
                );
                const meuIdUsuario = Number(
                  usuarioSalvo.id_usuario || usuarioSalvo.id || 0,
                );

                const classeItem =
                  msg.fk_usuario === meuIdUsuario
                    ? "chat-mensagem-item cliente"
                    : "chat-mensagem-item tecnico";

                const rotuloUsuario =
                  msg.fk_usuario === meuIdUsuario
                    ? "👤 Você"
                    : "🔧 Técnico ";
                const dataMsg = msg.data_envio || msg.criado_em || msg.data;

                return (
                  <div
                    key={msg.id_mensagem || Math.random()}
                    className={classeItem}
                  >
                    <div className="chat-mensagem-header">
                      <strong>{msg.nome_usuario || rotuloUsuario}</strong>
                      <span>{formatarData(dataMsg)}</span>
                    </div>
                    <p className="chat-mensagem-texto">{msg.mensagem || ""}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* FORMULÁRIO DE ENVIO */}
          <form onSubmit={handleEnviarMensagem} className="chat-form">
            <input
              type="text"
              value={textoMensagem}
              onChange={(e) => setTextoMensagem(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="chat-input"
              disabled={enviando || chamado.situacao === "Cancelado"}
            />
            <button
              type="submit"
              disabled={enviando || chamado.situacao === "Cancelado"}
              className="chat-btn-enviar"
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>

        <div className="detalhes-acoes">
          <MotionLink
            to="/chamados"
            className="btn-voltar"
            whileHover={{ scale: 1.05 }}
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
                  className="btn-cancelar-chamado"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCanceling ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="spinner-cancelar"
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
