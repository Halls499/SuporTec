import { Link } from "react-router-dom";
import "./DashboardTecnico.css";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";

interface Chamado {
  id_chamado: number;
  situacao: string;
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
  const [nomeTecnico, setNomeTecnico] = useState("Técnico");

  useEffect(() => {
    // Tenta obter o nome do usuário logado se salvo no login
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      try {
        const parsed = JSON.parse(usuarioSalvo);
        if (parsed.nome) setNomeTecnico(parsed.nome);
      } catch {
        // ignora erro de parse se for string simples
      }
    }

    async function buscarChamados() {
      const token = localStorage.getItem("token");
      const baseUrl = (
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      ).replace(/\/$/, "");

      try {
        const resposta = await fetch(`${baseUrl}/api/chamados`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          setChamados(Array.isArray(dados) ? dados : []);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard técnico:", err);
      }
    }

    buscarChamados();
  }, []);

  // 📊 Cálculo dinâmico dos totais com base na base de dados
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

          {/* Barra de XP Animada */}
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

        {/* Cards de Métricas com Dados Dinâmicos da API */}
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
            8 de 15 conquistas desbloqueadas
          </motion.h3>

          {/* Seção Suporte Geral */}
          <motion.h4 variants={itemVariants}>📋 Suporte Geral</motion.h4>
          <motion.div className="conquistas-grid" variants={containerVariants}>
            <ConquistaCard
              ico="🏆"
              tit="Mestre do Suporte"
              desc="Resolva mais de 100 chamados."
              status="desbloqueada"
            />
            <ConquistaCard
              ico="⚡"
              tit="Atendimento Ágil"
              desc="Resolva 10 chamados em menos de 3 horas."
              status="desbloqueada"
            />
            <ConquistaCard
              ico="🎯"
              tit="Precisão no Diagnóstico"
              desc="Resolva 95% dos chamados corretamente."
              status="desbloqueada"
            />
            <ConquistaCard
              ico="💬"
              tit="Comunicador"
              desc="Responda 50 chamados em menos de 1 hora."
              status="bloqueada"
            />
            <ConquistaCard
              ico="🔥"
              tit="Sem Descanso"
              desc="Resolva chamados durante 7 dias consecutivos."
              status="bloqueada"
            />
          </motion.div>

          {/* Seção Especializações */}
          <motion.h4 variants={itemVariants}>💻 Especializações</motion.h4>
          <motion.div className="conquistas-grid" variants={containerVariants}>
            <ConquistaCard
              ico="💻"
              tit="Especialista em Hardware"
              desc="Conclua 50 chamados de Hardware."
              status="desbloqueada"
            />
            <ConquistaCard
              ico="🖥️"
              tit="Especialista em Software"
              desc="Conclua 50 chamados de Software."
              status="desbloqueada"
            />
            <ConquistaCard
              ico="🌐"
              tit="Especialista em Redes"
              desc="Conclua 50 chamados de Redes."
              status="bloqueada"
            />
            <ConquistaCard
              ico="🖨️"
              tit="Especialista em Impressoras"
              desc="Conclua 50 chamados de Impressoras."
              status="bloqueada"
            />
            <ConquistaCard
              ico="🔐"
              tit="Especialista em Segurança"
              desc="Conclua 30 chamados relacionados à segurança."
              status="bloqueada"
            />
          </motion.div>

          {/* Seção Qualidade */}
          <motion.h4 variants={itemVariants}>⭐ Qualidade</motion.h4>
          <motion.div className="conquistas-grid" variants={containerVariants}>
            <ConquistaCard
              ico="⭐"
              tit="Excelência no Atendimento"
              desc="Receba média superior a 4,5 estrelas."
              status="desbloqueada"
            />
            <ConquistaCard
              ico="🤝"
              tit="Cliente Satisfeito"
              desc="Receba 50 avaliações com 5 estrelas."
              status="desbloqueada"
            />
            <ConquistaCard
              ico="🌙"
              tit="Plantonista"
              desc="Resolva 10 chamados fora do horário comercial."
              status="bloqueada"
            />
            <ConquistaCard
              ico="🚀"
              tit="Primeiro Atendimento"
              desc="Conclua seu primeiro chamado."
              status="desbloqueada"
            />
            <ConquistaCard
              ico="💯"
              tit="Cem por Cento"
              desc="Receba 10 avaliações cinco estrelas consecutivas."
              status="bloqueada"
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          style={{ marginTop: "30px", textAlign: "center" }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {/* 🎯 Ajuste o caminho conforme declarado no seu App.tsx */}
            <Link to="/chamados-tecnico" className="new-ticket">
              Ver todos os chamados
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}

// Sub-componente com tipagem explícita
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