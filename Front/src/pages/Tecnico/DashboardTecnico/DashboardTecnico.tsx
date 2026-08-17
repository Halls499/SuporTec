import { Link } from "react-router-dom";
import "./DashboardTecnico.css";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";

interface Chamado {
  id_chamado: number;
  titulo?: string;
  descricao?: string;
  situacao: 'Novo' | 'Em andamento' | 'Aguardando cliente' | 'Resolvido' | 'Cancelado';
  id_tecnico?: number | null;
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

  const [idTecnicoLogado] = useState<number | null>(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      try {
        const parsed = JSON.parse(usuarioSalvo);
        return Number(parsed.id_usuario || parsed.id) || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const token = localStorage.getItem("token");
  const baseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  async function buscarDados() {
    try {
      const [resChamados, resConquistas] = await Promise.all([
        fetch(`${baseUrl}/api/chamados/tecnico`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/conquistas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (resChamados.ok) {
        const dadosChamados = await resChamados.json();
        setChamados(Array.isArray(dadosChamados) ? dadosChamados : []);
      }

      if (resConquistas.ok) {
        const dadosConquistas = await resConquistas.json();
        setConquistasBanco(Array.isArray(dadosConquistas) ? dadosConquistas : []);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  }

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

    buscarDados();
  }, [idTecnicoLogado]);

  // Função para o técnico aceitar um chamado específico
  async function handleAceitarChamado(id_chamado: number) {
    try {
      const response = await fetch(`${baseUrl}/api/chamados/${id_chamado}/aceitar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Atualiza a lista localmente para refletir a mudança instantaneamente
        buscarDados();
      } else {
        alert("Não foi possível aceitar o chamado.");
      }
    } catch (error) {
      console.error("Erro ao aceitar chamado:", error);
    }
  }

  // Exibe todos os chamados retornados pela rota de técnico
  const chamadosDoTecnico = chamados;

  const novos = chamadosDoTecnico.filter((c) => c.situacao === "Novo").length;
  const resolvidos = chamadosDoTecnico.filter((c) => c.situacao === "Resolvido").length;
  const emAndamento = chamadosDoTecnico.filter((c) => c.situacao === "Em andamento").length;
  const aguardando = chamadosDoTecnico.filter((c) => c.situacao === "Aguardando cliente").length;

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
    (c) => c.status === "desbloqueada"
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
          {novos > 0 && (
            <motion.p
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ⚠️ Você possui {novos} chamado{novos === 1 ? "" : "s"} novo
              {novos === 1 ? "" : "s"} aguardando atendimento.
            </motion.p>
          )}
        </motion.div>

        <motion.div className="summary-cards" variants={containerVariants}>
          {[
            { ico: "📥", txt: "Novos", total: novos },
            { ico: "✅", txt: "Resolvidos", total: resolvidos },
            { ico: "⏳", txt: "Em andamento", total: emAndamento },
            { ico: "💬", txt: "Aguardando cliente", total: aguardando },
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

        {/* Seção opcional para listar chamados novos e permitir aceitá-los diretamente */}
        <motion.div className="chamados-recentes" variants={containerVariants} style={{ marginTop: "20px" }}>
          <motion.h3 variants={itemVariants}>📥 Chamados Disponíveis para Aceitar</motion.h3>
          <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
            {chamadosDoTecnico
              .filter((c) => c.situacao === "Novo" && (!c.id_tecnico || c.id_tecnico === idTecnicoLogado))
              .map((chamado) => (
                <div key={chamado.id_chamado} style={{ background: "#1e1e2f", padding: "15px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: 0, color: "#fff" }}>Chamado #{chamado.id_chamado}</h4>
                    <p style={{ margin: "5px 0 0 0", color: "#aaa" }}>{chamado.descricao || "Sem descrição"}</p>
                  </div>
                  <button 
                    onClick={() => handleAceitarChamado(chamado.id_chamado)}
                    style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    Aceitar Chamado
                  </button>
                </div>
              ))}
          </div>
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