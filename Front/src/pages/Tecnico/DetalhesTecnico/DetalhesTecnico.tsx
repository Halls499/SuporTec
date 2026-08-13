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
  data_abertura?: string;
  criado_em?: string;
  data?: string;
  nome_solicitante?: string;
  contato?: string;
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
  tipo_usuario?: string | number;
  tipo?: string | number;
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
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [novaResposta, setNovaResposta] = useState("");
  const [novoStatus, setNovoStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [enviandoMensagem, setEnviandoMensagem] = useState(false);

  const baseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  // 🔄 Busca os dados do chamado e as mensagens do chat de forma segura
  useEffect(() => {
    let isMounted = true;

    async function carregarDadosTecnico() {
      const token = localStorage.getItem("token");

      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        // 1. Busca detalhes do chamado
        const respostaChamado = await fetch(`${baseUrl}/api/chamados/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (respostaChamado.ok) {
          const dados = await respostaChamado.json();
          const chamadoFinal = Array.isArray(dados) ? dados[0] : dados;
          if (isMounted) {
            setChamado(chamadoFinal || null);
            setNovoStatus(chamadoFinal?.situacao || "Novo");
          }
        }

        // 2. Busca histórico de mensagens do chat
        const respostaChat = await fetch(`${baseUrl}/api/chat/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (respostaChat.ok) {
          const dadosChat = await respostaChat.json();
          if (isMounted) {
            setMensagens(Array.isArray(dadosChat) ? dadosChat : []);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes técnicos:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      carregarDadosTecnico();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id, baseUrl]);

  // 📝 Envia nova resposta pelo chat
  const handleEnviarResposta = async () => {
    if (!novaResposta.trim() || !id) return;

    setEnviandoMensagem(true);
    const token = localStorage.getItem("token");
    const fk_usuario = localStorage.getItem("id_usuario") || "1";

    try {
      const resposta = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mensagem: novaResposta.trim(),
          fk_usuario: Number(fk_usuario),
          fk_chamado: Number(id),
        }),
      });

      if (resposta.ok) {
        const novaMensagemCriada = await resposta.json();

        const mensagemComData = {
          ...novaMensagemCriada,
          data_envio:
            novaMensagemCriada?.data_envio ||
            novaMensagemCriada?.criado_em ||
            novaMensagemCriada?.data ||
            new Date().toISOString(),
          tipo_usuario: novaMensagemCriada?.tipo_usuario || "tecnico",
        };

        setMensagens((prev) => [...prev, mensagemComData]);
        setNovaResposta("");
      } else {
        alert("Erro ao enviar resposta.");
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      alert("Falha de comunicação com o servidor.");
    } finally {
      setEnviandoMensagem(false);
    }
  };

  // 📝 Atualiza o status do chamado no backend
  const handleAtualizarStatus = async () => {
    if (!id) return;
    setIsUpdatingStatus(true);
    const token = localStorage.getItem("token");

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
        const dadosErro = await resposta.json().catch(() => ({}));
        alert(dadosErro?.mensagem || "Erro ao atualizar o status.");
      }
    } catch (err) {
      console.error("Erro na requisição de atualização:", err);
      alert("Falha de comunicação com o servidor.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // 🛠️ Função flexível e segura para formatar datas
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

  if (loading) {
    return (
      <main className="detalhes-tecnico-page">
        <p className="detalhes-tecnico-loading">
          Carregando informações do chamado...
        </p>
      </main>
    );
  }

  if (!chamado) {
    return (
      <main className="detalhes-tecnico-page">
        <p className="detalhes-tecnico-loading">Chamado não encontrado.</p>
        <div className="detalhes-tecnico-erro-acao">
          <Link to="/chamados-tecnico" className="btn-voltar">
            ← Voltar aos chamados
          </Link>
        </div>
      </main>
    );
  }

  const dataAbertoChamado =
    chamado.data_abertura || chamado.criado_em || chamado.data;

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
          <h2>Chamado #{String(chamado.id_chamado || 0).padStart(3, "0")}</h2>
          <div className="info-group">
            <p>
              <strong>👤 Cliente:</strong>{" "}
              {chamado.nome_solicitante || "Não informado"}
            </p>
            <p>
              <strong>📞 Contato:</strong> {chamado.contato || "Não informado"}
            </p>
            <p>
              <strong>💻 Problema:</strong> {chamado.titulo || "Sem título"}
            </p>
            <p>
              <strong>📂 Categoria:</strong>{" "}
              {chamado.categoria || "Não informada"}
            </p>
            <p>
              <strong>🚨 Prioridade:</strong> {chamado.prioridade || "Normal"}
            </p>
            <p>
              <strong>📌 Status:</strong> {chamado.situacao || "Novo"}
            </p>
            <p>
              <strong>📅 Aberto em:</strong> {formatarData(dataAbertoChamado)}
            </p>
            <p>
              <strong>📝 Descrição inicial:</strong>
            </p>
            <p className="descricao">{chamado.descricao || "Sem descrição"}</p>
          </div>
        </motion.section>

        {/* Histórico do Chat */}
        <motion.section className="detalhes-card" variants={itemVariants}>
          <h2>Histórico de mensagens</h2>
          <div className="chat-box">
            {mensagens.length === 0 ? (
              <p className="chat-vazio">
                Ainda não há mensagens nesta conversa.
              </p>
            ) : (
              mensagens.map((msg) => {
                const idUsuarioLogado =
                  Number(localStorage.getItem("id_usuario")) || 0;

                const tipoStr = String(
                  msg.tipo_usuario || msg.tipo || "",
                ).toLowerCase();

                // No painel do técnico: é técnico se a API disser explicitamente OU se o ID da mensagem bater com o meu ID logado
                const isTecnico =
                  tipoStr.includes("tecnico") ||
                  tipoStr.includes("técnico") ||
                  tipoStr === "2" ||
                  tipoStr === "admin" ||
                  (idUsuarioLogado > 0 &&
                    Number(msg.fk_usuario) === idUsuarioLogado);

                const classeMensagem = isTecnico
                  ? "mensagem tecnico"
                  : "mensagem cliente";

                const rotuloUsuario = isTecnico ? "🔧 Técnico" : "👤 Cliente";
                const dataMsg = msg.data_envio || msg.criado_em || msg.data;

                return (
                  <motion.div
                    key={msg.id_mensagem || Math.random()}
                    className={classeMensagem}
                    initial={{ opacity: 0, x: isTecnico ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <strong>{rotuloUsuario}</strong>
                    <p>{msg.mensagem || ""}</p>
                    <span>{formatarData(dataMsg)}</span>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.section>

        {/* Resposta */}
        <motion.section className="detalhes-card" variants={itemVariants}>
          <h2>Responder chamado</h2>
          <motion.textarea
            className="textarea-resposta"
            placeholder="Digite uma resposta ao cliente..."
            value={novaResposta}
            onChange={(e) => setNovaResposta(e.target.value)}
            whileFocus={{ scale: 1.01, borderColor: "#3b82f6" }}
            disabled={enviandoMensagem}
          />
          <motion.button
            className="btn-enviar"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnviarResposta}
            disabled={enviandoMensagem}
          >
            {enviandoMensagem ? "Enviando..." : "Enviar resposta"}
          </motion.button>
        </motion.section>

        {/* Status */}
        <motion.section className="detalhes-card" variants={itemVariants}>
          <h2>Atualizar status</h2>
          <motion.select
            className="select-status"
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

        <motion.div variants={itemVariants} className="voltar-container">
          <Link to="/chamados-tecnico" className="btn-voltar">
            ← Voltar aos chamados
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default DetalhesTecnico;
