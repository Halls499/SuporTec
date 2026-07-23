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
  // 1. Criar o estado
  const [chamados, setChamados] = useState<Chamado[]>([]);

  // 2. Buscar os dados assim que o componente carrega
  useEffect(() => {
    async function carregarChamados() {
      const token = localStorage.getItem("token");
      //banco local
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

      try {
        //banco online
        const resposta = await fetch(`${baseUrl}/chamados`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        });

        //banco local
        //const resposta = await fetch("http://localhost:3000/chamados", {
        //method: "GET",
        //headers: {
        //"Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
        //},
        // });

        const dados = await resposta.json();

        if (resposta.ok) {
          setChamados(dados); // Guarda a lista no estado
        }
      } catch (erro) {
        console.error("Erro ao buscar chamados:", erro);
      }
    }

    carregarChamados(); // Chama a função para executar a busca
  }, []);

  return (
    <main className="chamados-page">
      <div className="chamados-container">
        {/* titulo */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Meus chamados
        </motion.h1>

        {/* subtitulo */}
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
          {/*cards mostrando chamados */}

          {chamados.map((chamado) => (
            <MotionLink
              key={chamado.id_chamado}
              to={`/detalhes/${chamado.id_chamado}`}
            >
              <motion.div
                className="chamado-card"
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <h2>Chamado #{chamado.id_chamado}</h2>
                <p>Problema: {chamado.titulo}</p>
                <p>Status: {chamado.situacao}</p>
                <p>Prioridade: {chamado.prioridade}</p>
                <p>Aberto em: {chamado.data_abertura}</p>
              </motion.div>
            </MotionLink>
          ))}
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
