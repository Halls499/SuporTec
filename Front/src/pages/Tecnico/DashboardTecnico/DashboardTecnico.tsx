import { Link } from "react-router-dom";
import "./DashboardTecnico.css";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { ConquistaCard } from "../ConquistasCard/ConquistasCard";

interface Chamado {
  id_chamado: number;
  titulo?: string;
  descricao?: string;
  situacao:
    | "Novo"
    | "Em andamento"
    | "Aguardando cliente"
    | "Resolvido"
    | "Cancelado";
  id_tecnico?: number | null;
  fk_tecnico?: number | null;
}

interface TecnicoPerfil {
  id_usuario: number;
  nome: string;
  email: string;
  xp: number;
  nivel: number;
}

interface ConquistaAPI {
  id_conquista: number;
  titulo: string;
  descricao: string;
  status: "desbloqueada" | "bloqueada";
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

function obterIdUsuarioDoToken(): number | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const payloadJson = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/"),
    );
    const payload = JSON.parse(payloadJson);
    return Number(payload.id_usuario || payload.id || payload.userId) || null;
  } catch (e) {
    return null;
  }
}

function DashboardTecnico() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [conquistasBanco, setConquistasBanco] = useState<ConquistaAPI[]>([]);
  const [perfil, setPerfil] = useState<TecnicoPerfil | null>(null);
  const [, setCarregando] = useState<boolean>(true);

  const idTecnicoLogado =
    obterIdUsuarioDoToken() || Number(localStorage.getItem("id_usuario") || 0);

  const token = localStorage.getItem("token");
  const baseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  async function buscarDados() {
    setCarregando(true);
    try {
      const [resChamados, resConquistas, resPerfil] = await Promise.all([
        fetch(`${baseUrl}/api/chamados/tecnico`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/conquistas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/chamados/tecnicos/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (resChamados.ok) {
        const dadosChamados = await resChamados.json();
        setChamados(Array.isArray(dadosChamados) ? dadosChamados : []);
      }

      if (resConquistas.ok) {
        const dadosConquistas = await resConquistas.json();
        setConquistasBanco(
          Array.isArray(dadosConquistas) ? dadosConquistas : [],
        );
      }

      if (resPerfil.ok) {
        const dadosPerfil = await resPerfil.json();
        setPerfil(dadosPerfil);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarDados();
  }, []);

  async function handleAceitarChamado(id_chamado: number) {
    try {
      const response = await fetch(
        `${baseUrl}/api/chamados/${id_chamado}/aceitar`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        buscarDados();
      } else {
        const erroData = await response.json().catch(() => null);
        alert(erroData?.mensagem || "Não foi possível aceitar o chamado.");
      }
    } catch (error) {
      console.error("Erro ao aceitar chamado:", error);
      alert("Erro de conexão ao tentar aceitar o chamado.");
    }
  }

  const chamadosDoTecnico = chamados.filter((c) => {
    const tecnicoId = Number(c.id_tecnico || c.fk_tecnico || 0);
    return tecnicoId === Number(idTecnicoLogado);
  });

  const novos = chamadosDoTecnico.filter((c) => c.situacao === "Novo").length;
  const resolvidos = chamadosDoTecnico.filter(
    (c) => c.situacao === "Resolvido",
  ).length;
  const emAndamento = chamadosDoTecnico.filter(
    (c) => c.situacao === "Em andamento",
  ).length;
  const aguardando = chamadosDoTecnico.filter(
    (c) => c.situacao === "Aguardando cliente",
  ).length;

  const chamadosDisponiveis = chamados.filter(
    (c) => c.situacao === "Novo" && !c.id_tecnico && !c.fk_tecnico,
  );

  const nivelAtual = Number(perfil?.nivel) || 1;
  const xpAtual = Number(perfil?.xp) || 0;

  // Garante que o XP necessário nunca seja 0 para evitar divisão por zero
  const xpNecessario = nivelAtual * 100 > 0 ? nivelAtual * 100 : 100;

  // Cálculo seguro com proteção contra NaN
  const porcentagemXp =
    !isNaN(xpAtual) && !isNaN(xpNecessario) && xpNecessario > 0
      ? Math.min(Math.max(Math.round((xpAtual / xpNecessario) * 100), 0), 100)
      : 0;

  const listaConquistas = conquistasBanco.map((c) => {
    let ico = "🏅";
    const tituloLower = c.titulo.toLowerCase();

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
        {/* Seção de Boas-vindas */}
        <motion.div className="welcome" variants={itemVariants}>
          <h1>Olá, {perfil?.nome || "Técnico"}! 🚀</h1>
          <p>
            Gerencie os chamados atribuídos a você e acompanhe sua evolução
            profissional.
          </p>
        </motion.div>

        {/* Barra de XP Dinâmica */}
        <motion.div className="xp-bar" variants={itemVariants}>
          <div
            className="xp-progress"
            style={{ width: `${Math.max(porcentagemXp, 8)}%` }}
          />
          <div className="xp-text-overlay">
            {porcentagemXp}% — {xpAtual} / {xpNecessario} XP (Nível {nivelAtual}
            )
          </div>
        </motion.div>

        {novos > 0 && (
          <motion.div className="alerta-novos" variants={itemVariants}>
            <motion.p
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ⚠️ Você possui {novos} chamado{novos === 1 ? "" : "s"} novo
              {novos === 1 ? "" : "s"} aguardando atendimento.
            </motion.p>
          </motion.div>
        )}

        {/* Cards de Resumo */}
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

        {/* Seção de Chamados Disponíveis */}
        <motion.div className="chamados-recentes" variants={containerVariants}>
          <motion.h3 variants={itemVariants}>
            📥 Chamados Disponíveis para Aceitar
          </motion.h3>
          <div className="chamados-grid">
            {chamadosDisponiveis.length === 0 ? (
              <p className="chamado-vazio">
                Nenhum chamado disponível no momento.
              </p>
            ) : (
              chamadosDisponiveis.map((chamado) => (
                <motion.div
                  key={chamado.id_chamado}
                  className="chamado-disponivel-card"
                  variants={itemVariants}
                >
                  <div className="chamado-info">
                    <h4>
                      Chamado #{chamado.id_chamado} -{" "}
                      {chamado.titulo || "Sem título"}
                    </h4>
                    <p>{chamado.descricao || "Sem descrição"}</p>
                  </div>
                  <button
                    onClick={() => handleAceitarChamado(chamado.id_chamado)}
                    className="btn-aceitar"
                  >
                    Aceitar Chamado
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Seção de Conquistas (Sem Categorias) */}
        <motion.div className="conquistas" variants={containerVariants}>
          <motion.h2 variants={itemVariants}>🏆 Conquistas</motion.h2>
          <motion.h3 variants={itemVariants}>
            {totalDesbloqueadas} de {listaConquistas.length} conquistas
            desbloqueadas
          </motion.h3>

          <motion.div
            className="conquistas-grid"
            variants={containerVariants}
            style={{ marginTop: "20px" }}
          >
            {listaConquistas.map((conquista) => (
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
              Ver todos os meus chamados
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}

export default DashboardTecnico;
