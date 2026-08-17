import { Link } from "react-router-dom";
import "./DashboardTecnico.css";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";

interface Chamado {
  id_chamado: number;
  situacao: string;
}

interface ConquistaAPI {
  id_conquista: number;
  titulo: string;
  descricao: string;
  status: "desbloqueada" | "bloqueada";
}

interface ConquistaProps {
  ico: string;
  tit: string;
  desc: string;
  status: "desbloqueada" | "bloqueada" | string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const cardHover = {
  scale: 1.05,
  y: -5,
  transition: { duration: 0.2 },
};

function DashboardTecnico() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [conquistasBanco, setConquistasBanco] = useState<ConquistaAPI[]>([]);
  const [nomeTecnico, setNomeTecnico] = useState("Técnico");

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      try {
        const parsed = JSON.parse(usuarioSalvo);
        if (parsed.nome) setNomeTecnico(parsed.nome);
      } catch {
        // ignora
      }
    }

    const token = localStorage.getItem("token");
    const baseUrl = (
      import.meta.env.VITE_API_URL || "http://localhost:3000"
    ).replace(/\/$/, "");

    async function buscarChamados() {
      try {
        const resposta = await fetch(`${baseUrl}/api/chamados`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resposta.ok) {
          const dados = await resposta.json();
          setChamados(Array.isArray(dados) ? dados : []);
        }
      } catch (err) {
        console.error("Erro ao carregar chamados:", err);
      }
    }

    async function buscarConquistas() {
      try {
        const resposta = await fetch(`${baseUrl}/api/conquistas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resposta.ok) {
          const dados = await resposta.json();
          setConquistasBanco(Array.isArray(dados) ? dados : []);
        }
      } catch (err) {
        console.error("Erro ao carregar conquistas:", err);
      }
    }

    buscarChamados();
    buscarConquistas();
  }, []);

  const novos = chamados.filter((c) =>
    c.situacao?.toLowerCase().includes("novo"),
  ).length;
  const resolvidos = chamados.filter((c) =>
    c.situacao?.toLowerCase().includes("resolvido"),
  ).length;
  const emAndamento = chamados.filter(
    (c) =>
      c.situacao?.toLowerCase().includes("andamento") ||
      c.situacao?.toLowerCase().includes("atendimento"),
  ).length;
  const aguardando = chamados.filter((c) =>
    c.situacao?.toLowerCase().includes("aguardando"),
  ).length;

  // Mapeamento inteligente que categoriza com base no ID ou no nome da conquista
  const listaConquistas = conquistasBanco.map((c) => {
    let ico = "🏅";
    let categoria = "Suporte Geral";

    const tituloLower = c.titulo.toLowerCase();

    if (
      tituloLower.includes("hardware") ||
      tituloLower.includes("software") ||
      tituloLower.includes("redes") ||
      tituloLower.includes("impressora")
    ) {
      categoria = "Especializações";
    } else if (
      tituloLower.includes("primeiro") ||
      tituloLower.includes("qualidade") ||
      tituloLower.includes("estrelas") ||
      tituloLower.includes("satisfeto")
    ) {
      categoria = "Qualidade";
    }

    if (tituloLower.includes("hardware")) ico = "💻";
    else if (tituloLower.includes("software")) ico = "🖥️";
    else if (tituloLower.includes("redes")) ico = "🌐";
    else if (tituloLower.includes("mestre")) ico = "🏆";
    else if (tituloLower.includes("primeiro")) ico = "🚀";
    else if (
      tituloLower.includes("estrela") ||
      tituloLower.includes("qualidade")
    )
      ico = "⭐";

    return {
      id: c.id_conquista,
      categoria,
      ico,
      tit: c.titulo,
      desc: c.descricao,
      status: c.status,
    };
  });

  const totalDesbloqueadas = listaConquistas.filter(
    (c) => c.status === "desbloqueada",
  ).length;

  return (
    <main className="home-login-page">
      <motion.section
        className="DashboardTecnico-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="welcome" variants={itemVariants}>
          <h1>Bem-vindo, {nomeTecnico}</h1>

          <div className="xp-bar">
            <motion.div
              className="xp-progress"
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
            >
              Nível 4 - Especialista <br /> 320 / 400 XP
            </motion.div>
          </div>
          <p>
            Gerencie os chamados atribuídos a você e acompanhe o andamento dos
            atendimentos.
          </p>
          <motion.p
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ⚠️ Você possui {novos} chamado{novos === 1 ? "" : "s"} novo
            {novos === 1 ? "" : "s"} aguardando atendimento.
          </motion.p>
        </motion.div>

        <motion.div className="summary-cards" variants={containerVariants}>
          {[
            { ico: "📥", txt: "Novos", total: novos },
            { ico: "✅", txt: "Resolvidos", total: resolvidos },
            { ico: "⏳", txt: "Em andamento", total: emAndamento },
            { ico: "💬", txt: "Aguardando resposta", total: aguardando },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="summary-card"
              variants={itemVariants}
              whileHover={cardHover}
            >
              <span>{item.ico}</span>
              <h2>{item.total}</h2>
              <p>{item.txt}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="conquistas" variants={containerVariants}>
          <motion.h2 variants={itemVariants}>🏆 Conquistas</motion.h2>
          <motion.h3 variants={itemVariants}>
            {totalDesbloqueadas} de {listaConquistas.length} conquistas
            desbloqueadas
          </motion.h3>

          <motion.h4 variants={itemVariants}>📋 Suporte Geral</motion.h4>
          <motion.div className="conquistas-grid" variants={containerVariants}>
            {listaConquistas
              .filter((c) => c.categoria === "Suporte Geral")
              .map((conquista) => (
                <ConquistaCard
                  key={conquista.id}
                  ico={conquista.ico}
                  tit={conquista.tit}
                  desc={conquista.desc}
                  status={conquista.status}
                />
              ))}
          </motion.div>

          <motion.h4 variants={itemVariants}>💻 Especializações</motion.h4>
          <motion.div className="conquistas-grid" variants={containerVariants}>
            {listaConquistas
              .filter((c) => c.categoria === "Especializações")
              .map((conquista) => (
                <ConquistaCard
                  key={conquista.id}
                  ico={conquista.ico}
                  tit={conquista.tit}
                  desc={conquista.desc}
                  status={conquista.status}
                />
              ))}
          </motion.div>

          <motion.h4 variants={itemVariants}>⭐ Qualidade</motion.h4>
          <motion.div className="conquistas-grid" variants={containerVariants}>
            {listaConquistas
              .filter((c) => c.categoria === "Qualidade")
              .map((conquista) => (
                <ConquistaCard
                  key={conquista.id}
                  ico={conquista.ico}
                  tit={conquista.tit}
                  desc={conquista.desc}
                  status={conquista.status}
                />
              ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          style={{ marginTop: "30px", textAlign: "center" }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/chamados-tecnico" className="new-ticket">
              Ver todos os chamados
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}

function ConquistaCard({ ico, tit, desc, status }: ConquistaProps) {
  return (
    <motion.div
      className={`conquista-card ${status}`}
      variants={itemVariants}
      whileHover={status === "desbloqueada" ? cardHover : {}}
    >
      <span>{ico}</span>
      <h5>{tit}</h5>
      <p>{desc}</p>
    </motion.div>
  );
}

export default DashboardTecnico;
