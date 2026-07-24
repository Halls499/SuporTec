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
  const navigate = useNavigate(); // ✅ DENTRO do componente!
  const { id } = useParams<{ id: string }>();
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
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
        const responseChamado = await fetch(
          `https://suportec.onrender.com/chamados/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!responseChamado.ok) {
          throw new Error("Não foi possível carregar os detalhes do chamado.");
        }

        const dataChamado = await responseChamado.json();
        setChamado(dataChamado);
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

  const handleCancelarChamado = async () => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja cancelar este chamado?"
    );
    if (!confirmacao) return;

    setIsCanceling(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://suportec.onrender.com/chamados/${id}/cancelar`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Chamado cancelado com sucesso!");
        navigate("/Chamados");
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
            to="/Chamados"
            className="new-ticket"
            style={{ marginTop: "20px" }}
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
        initial={{ opacity: 0.7, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>{String(chamado.titulo)}</h1>

        <motion.div
          className="info-chamado"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Detalhes das Informações</h2>
          <p>
            <strong>Categoria:</strong> {chamado.categoria}
          </p>
          <p>
            <strong>Status:</strong> {chamado.situacao}
          </p>
          <p>
            <strong>Prioridade:</strong> {chamado.prioridade}
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
          <MotionLink
            to="/Chamados"
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
                  onClick={handleCancelarChamado}
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
    </main>
  );
}

export default Detalhes;