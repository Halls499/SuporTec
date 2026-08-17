import { Link, useParams } from "react-router-dom";
import "./DetalhesTecnico.css";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const baseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  useEffect(() => {
    async function buscarDetalhes() {
      try {
        const res = await fetch(`${baseUrl}/api/chamados/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setChamado(data);
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes do chamado:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) buscarDetalhes();
  }, [id, baseUrl, token]);

  if (loading) {
    return <div className="detalhes-tecnico-loading">Carregando detalhes...</div>;
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
          <p className="subtitle">Acompanhe as informações e interações deste atendimento.</p>
        </motion.div>

        {chamado ? (
          <>
            <motion.div className="detalhes-card" variants={itemVariants}>
              <h2>Informações do Chamado</h2>
              <p><strong>Título:</strong> {chamado.titulo || "Sem título"}</p>
              <p className="descricao"><strong>Descrição:</strong> {chamado.descricao || "Sem descrição"}</p>
              <p><strong>Situação:</strong> {chamado.situacao}</p>
            </motion.div>
          </>
        ) : (
          <div className="detalhes-card">
            <p className="chat-vazio">Chamado não encontrado.</p>
          </div>
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