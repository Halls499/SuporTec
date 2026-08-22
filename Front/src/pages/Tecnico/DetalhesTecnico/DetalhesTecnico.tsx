import { Link, useParams } from "react-router-dom";
import "./DetalhesTecnico.css";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";

interface Mensagem {
  id_mensagem?: number;
  remetente?: string;
  tipo_usuario?: string;
  conteudo?: string;
  mensagem?: string;
  data_envio?: string;
  fk_usuario?: number;
}

interface Chamado {
  id_chamado: number;
  titulo?: string;
  descricao?: string;
  situacao: string;
  data_abertura?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DetalhesTecnico() {
  const { id } = useParams();
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [novaSituacao, setNovaSituacao] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const token = localStorage.getItem("token");
  const baseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  // 🔄 Buscar detalhes do chamado e as mensagens de forma segura
  useEffect(() => {
    async function carregarDados() {
      if (!id) return;

      try {
        setLoading(true);
        // 1. Busca o chamado primeiro
        const resChamado = await fetch(`${baseUrl}/api/chamados/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resChamado.ok) {
          setChamado(null);
          setLoading(false);
          return;
        }

        const dataChamado = await resChamado.json();
        setChamado(dataChamado);
        setNovaSituacao(dataChamado.situacao || "");

        // 2. Só busca as mensagens se o chamado realmente existir
        const resMensagens = await fetch(
          `${baseUrl}/api/chamados/${id}/mensagens`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (resMensagens.ok) {
          const dataMensagens = await resMensagens.json();
          setMensagens(Array.isArray(dataMensagens) ? dataMensagens : []);
        }
      } catch (err) {
        console.error("Erro ao buscar dados do chamado:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id, baseUrl, token]);

  // 📤 Enviar nova mensagem / resposta
  async function handleEnviarMensagem(e: React.FormEvent) {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    setEnviando(true);
    try {
      const res = await fetch(`${baseUrl}/api/chamados/${id}/mensagens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conteudo: novaMensagem,
          situacao: novaSituacao,
        }),
      });

      if (res.ok) {
        setNovaMensagem("");
        // Recarrega as mensagens e atualiza o estado
        const resMensagens = await fetch(
          `${baseUrl}/api/chamados/${id}/mensagens`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (resMensagens.ok) {
          const dataMensagens = await resMensagens.json();
          setMensagens(Array.isArray(dataMensagens) ? dataMensagens : []);
        }
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    } finally {
      setEnviando(false);
    }
  }

  // 💾 Atualizar status/situação do chamado
  async function handleAtualizarStatus() {
    try {
      const res = await fetch(`${baseUrl}/api/chamados/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ situacao: novaSituacao }),
      });

      if (res.ok) {
        alert("Status atualizado com sucesso!");
      } else {
        alert("Erro ao atualizar status.");
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  }

  if (loading) {
    return (
      <div className="detalhes-tecnico-loading">Carregando detalhes...</div>
    );
  }

  return (
    <main className="detalhes-tecnico-page">
      <motion.section
        className="detalhes-tecnico-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1>Detalhes do Chamado #{id}</h1>
          <p className="subtitle">
            Acompanhe as informações e interações deste atendimento.
          </p>
        </motion.div>

        {chamado ? (
          <>
            {/* Card com Informações Principais */}
            <motion.div className="detalhes-card" variants={itemVariants}>
              <h2>Informações do Chamado</h2>
              <p>
                <strong>Título:</strong> {chamado.titulo || "Sem título"}
              </p>
              <p className="descricao">
                <strong>Descrição:</strong>{" "}
                {chamado.descricao || "Sem descrição"}
              </p>
              <p>
                <strong>Situação atual:</strong> {chamado.situacao}
              </p>
            </motion.div>

            {/* Card de Alteração de Status */}
            <motion.div className="detalhes-card" variants={itemVariants}>
              <h2>Gerenciar Status</h2>
              <select
                className="select-status"
                value={novaSituacao}
                onChange={(e) => setNovaSituacao(e.target.value)}
              >
                <option value="Em Andamento">🔧 Em Andamento</option>
                <option value="Aguardando Cliente">
                  💬 Aguardando Cliente
                </option>
                <option value="Resolvido">✅ Resolvido</option>
                <option value="Cancelado">🚫 Cancelado</option>
              </select>
              <button onClick={handleAtualizarStatus} className="btn-salvar">
                Atualizar Status
              </button>
            </motion.div>

            {/* Card do Chat / Histórico de Mensagens */}
            <motion.div className="detalhes-card" variants={itemVariants}>
              <h2>Histórico de Interações</h2>
              <div className="chat-box">
                {mensagens.length === 0 ? (
                  <p className="chat-vazio">
                    Nenhuma mensagem registrada ainda.
                  </p>
                ) : (
                  mensagens.map((msg, index) => {
                    // Pega o ID do técnico logado atualmente no navegador
                    const usuarioSalvo = JSON.parse(
                      localStorage.getItem("usuario") || "{}",
                    );
                    const meuIdUsuario = Number(
                      usuarioSalvo.id_usuario || usuarioSalvo.id || 0,
                    );

                    const souEu = Number(msg.fk_usuario) === meuIdUsuario;

                    return (
                      <div
                        key={msg.id_mensagem || index}
                        className={`mensagem ${souEu ? "tecnico" : "cliente"}`}
                      >
                        <strong>
                          {msg.remetente ||
                            (souEu ? "🔧 Você (Técnico)" : "👤 Cliente")}
                        </strong>
                        <p>{msg.conteudo || msg.mensagem}</p>
                        {msg.data_envio && (
                          <span>
                            {new Date(msg.data_envio).toLocaleString("pt-BR")}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Formulário de Envio de Resposta */}
              <form
                onSubmit={handleEnviarMensagem}
                style={{ marginTop: "20px" }}
              >
                <textarea
                  className="textarea-resposta"
                  placeholder="Digite sua resposta ou orientações para o solicitante..."
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  disabled={enviando}
                />
                <button
                  type="submit"
                  className="btn-enviar"
                  disabled={enviando}
                >
                  {enviando ? "Enviando..." : "Enviar Resposta"}
                </button>
              </form>
            </motion.div>
          </>
        ) : (
          <motion.div className="detalhes-card" variants={itemVariants}>
            <p className="chat-vazio">
              Chamado não encontrado ou excluído do sistema.
            </p>
          </motion.div>
        )}

        <div className="voltar-container">
          <Link to="/dashboard-tecnico" className="btn-voltar">
            ← Voltar para o Dashboard
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
