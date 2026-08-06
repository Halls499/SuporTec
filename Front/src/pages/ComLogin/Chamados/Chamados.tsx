import "./Chamados.css";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
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
      const baseUrl = (
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      ).replace(/\/$/, "");

      try {
        // 🏢 Endpoint atualizado para o prefixo /api/chamados
        const resposta = await fetch(`${baseUrl}/api/chamados`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const dados = await resposta.json();

        if (resposta.ok) {
          setChamados(Array.isArray(dados) ? dados : []);
        }
      } catch (erro) {
        console.error("Erro ao buscar chamados:", erro);
      }
    }

    carregarChamados();
  }, []);

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

  return (
    <main className="chamados-page">
      <div className="chamados-container">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Meus chamados
        </motion.h1>

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
          {chamados.length === 0 ? (
            <motion.p variants={cardVariants} style={{ marginTop: "20px" }}>
              Você ainda não abriu um chamado.
            </motion.p>
          ) : (
            chamados.map((chamado) => (
              <motion.div
                key={chamado.id_chamado}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* 🔗 Redireciona para o componente de detalhes mantendo a coerência das rotas */}
                <Link
                  to={`/chamados/${chamado.id_chamado}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="chamado-card">
                    <h2>Problema: {chamado.titulo}</h2>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${getStatusBadge(chamado.situacao)}`}
                      >
                        {chamado.situacao}
                      </span>
                    </p>
                    <p>
                      <strong>Prioridade:</strong>{" "}
                      <span
                        className={`badge ${getPrioridadeBadge(chamado.prioridade)}`}
                      >
                        {chamado.prioridade}
                      </span>
                    </p>
                    <p>
                      <strong>Aberto em:</strong>{" "}
                      {formatarData(chamado.data_abertura)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ marginTop: "20px" }}
        >
          <Link to="/abrir-chamado" className="new-ticket">
            📝 Abrir chamado
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default Chamados;
