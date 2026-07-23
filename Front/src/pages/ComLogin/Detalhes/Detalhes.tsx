import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Detalhes.css";
import { motion } from "framer-motion";

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

// Interface para tipar as mensagens
interface Mensagem {
  id_mensagem: number;
  mensagem: string;
  data_envio: string;
  nome_usuario?: string;
  tipo_usuario?: string;
}

function Detalhes() {
  const { id } = useParams<{ id: string }>();
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarDetalhes = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErro("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        // 1. Busca os detalhes do chamado
        const responseChamado = await fetch(`https://suportec.onrender.com/chamados/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!responseChamado.ok) {
          throw new Error("Não foi possível carregar os detalhes do chamado.");
        }

        const dataChamado = await responseChamado.json();
        setChamado(dataChamado);

        // 2. Busca o histórico de mensagens do chamado (se houver essa rota de chat)
        const responseMensagens = await fetch(`https://suportec.onrender.com/chamados/${id}/mensagens`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (responseMensagens.ok) {
          const dataMensagens = await responseMensagens.json();
          setMensagens(dataMensagens);
        }

      } catch (err: any) {
        setErro(err.message || "Erro ao buscar dados do chamado.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      carregarDetalhes();
    }
  }, [id]);

  // Função auxiliar para formatar datas no padrão BR
  const formatarData = (dataIso?: string) => {
    if (!dataIso) return "Data não disponível";
    const data = new Date(dataIso);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <main className="detalhes-page">
        <p style={{ textAlign: "center", color: "#fff", marginTop: "50px" }}>Carregando detalhes do chamado...</p>
      </main>
    );
  }

  if (erro || !chamado) {
    return (
      <main className="detalhes-page">
        <div className="detalhes-container" style={{ textAlign: "center" }}>
          <h2>Ops! Chamado não encontrado.</h2>
          <p>{erro}</p>
          <MotionLink to="/Chamados" className="new-ticket" style={{ marginTop: "20px" }}>
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
        initial={{ opacity: 0.7, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Chamado #{String(chamado.id_chamado).padStart(3, '0')}</h1>

        <motion.div
          className="info-chamado"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2 }}
        >
          <h2>Chamado #{String(chamado.id_chamado).padStart(3, '0')}</h2>
          <p><strong>Problema:</strong> {chamado.titulo}</p>
          <p><strong>Categoria:</strong> {chamado.categoria}</p>
          <p><strong>Status:</strong> {chamado.situacao}</p>
          <p><strong>Prioridade:</strong> {chamado.prioridade}</p>
          <p><strong>Descrição:</strong> {chamado.descricao}</p>
          <p><strong>Aberto em:</strong> {formatarData(chamado.data_abertura)}</p>
        </motion.div>

        <motion.div
          className="chat-chamado"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.4 }}
        >
          <h2>Histórico de comunicações</h2>
          
          {mensagens.length > 0 ? (
            mensagens.map((msg) => (
              <div key={msg.id_mensagem} style={{ marginBottom: "15px" }}>
                <p><strong>{msg.tipo_usuario === 'tecnico' ? 'Suporte' : 'Usuário'}:</strong> {msg.nome_usuario || 'Usuário'}</p>
                <p><strong>Mensagem:</strong> {msg.mensagem}</p>
                <p><strong>Data:</strong> {formatarData(msg.data_envio)}</p>
                <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "10px 0" }} />
              </div>
            ))
          ) : (
            <p>Nenhuma mensagem ou atualização registrada até o momento.</p>
          )}
        </motion.div>

        <MotionLink
          to="/Chamados"
          className="new-ticket"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Voltar aos chamados
        </MotionLink>
      </motion.div>
    </main>
  );
}

export default Detalhes;