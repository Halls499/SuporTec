import "./Chamados.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const MotionLink = motion(Link);

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

interface Chamado {
  id_chamado: number;
  titulo: string;
  situacao: string;
  prioridade: string;
  data_abertura: string;
}

function Chamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);

  useEffect(() => {
    async function carregarChamados() {
      const token = localStorage.getItem("token");
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

      try {
        const resposta = await fetch(`${baseUrl}/chamados`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const dados = await resposta.json();

        if (resposta.ok) {
          // Garante que 'dados' é um array antes de salvar no estado
          setChamados(Array.isArray(dados) ? dados : []);
        }
      } catch (erro) {
        console.error("Erro ao buscar chamados:", erro);
      }
    }

    carregarChamados();
  }, []);

  // Função auxiliar para formatar datas (Ex: 23/07/2026)
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

  return (
    <main className="chamados-page">
      <div className="chamados-container">
        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Meus chamados
        </motion.h1>

        {/* Subtítulo */}
        <motion.h4
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >
          Acompanhe o andamento dos seus chamados
        </motion.h4>

        <motion.div
          className="chamados-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Caso não tenha chamados cadastrados */}
          {chamados.length === 0 ? (
            <motion.p variants={cardVariants} style={{ marginTop: "20px" }}>
              Você ainda não abriu um chamado.
            </motion.p>
          ) : (
            chamados.map((chamado) => (
              <MotionLink
                key={chamado.id_chamado}
                to={`/detalhes/${chamado.id_chamado}`}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={() => {
                  // Exibe o ID do chamado no console ao clicar
                  console.log("ID do chamado clicado:", chamado.id_chamado);
                }}
              >
                <div className="chamado-card">
                  <h2>Chamado #{chamado.id_chamado}</h2>
                  <p>
                    <strong>Problema:</strong> {chamado.titulo}
                  </p>
                  <p>
                    <strong>Status:</strong> {chamado.situacao}
                  </p>
                  <p>
                    <strong>Prioridade:</strong> {chamado.prioridade}
                  </p>
                  <p>
                    <strong>Aberto em:</strong>{" "}
                    {formatarData(chamado.data_abertura)}
                  </p>
                </div>
              </MotionLink>
            ))
          )}
        </motion.div>

        <MotionLink
          to="/abrir-chamado"
          className="new-ticket"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📝 Abrir chamado
        </MotionLink>
      </div>
    </main>
  );
}

export default Chamados;
