import { Link } from "react-router-dom";
import "./DashboardTecnico.css";
import { motion, type Variants } from "framer-motion";

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
  return (
    <main className="home-login-page">
      <motion.section
        className="DashboardTecnico-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="welcome" variants={itemVariants}>
          <h1>Bem-vindo, Técnico Raul</h1>

          {/* Barra de XP Animada */}
          <div className="xp-bar">
            <motion.div
              className="xp-progress"
              initial={{ width: 0 }}
              animate={{ width: "80%" }} // 320/400 = 80%
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
            ⚠️ Você possui 5 chamados novos aguardando atendimento.
          </motion.p>
        </motion.div>

        <motion.div className="summary-cards" variants={containerVariants}>
          {[
            { ico: "📥", txt: "Novos" },
            { ico: "✅", txt: "Resolvidos" },
            { ico: "⏳", txt: "Em andamento" },
            { ico: "💬", txt: "Aguardando resposta" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="summary-card"
              variants={itemVariants}
              whileHover={cardHover}
            >
              <span>{item.ico}</span>
              <p>{item.txt}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="conquistas" variants={containerVariants}>
          <motion.h2 variants={itemVariants}>🏆 Conquistas</motion.h2>
          <motion.h3 variants={itemVariants}>8 de 15 conquistas desbloqueadas</motion.h3>

          {/* Seção Suporte Geral */}
          <motion.h4 variants={itemVariants}>📋 Suporte Geral</motion.h4>
          <motion.div className="conquistas-grid" variants={containerVariants}>
            <ConquistaCard ico="🏆" tit="Mestre do Suporte" desc="Resolva mais de 100 chamados." status="desbloqueada" />
            <ConquistaCard ico="⚡" tit="Atendimento Ágil" desc="Resolva 10 chamados em menos de 3 horas." status="desbloqueada" />
            <ConquistaCard ico="🎯" tit="Precisão no Diagnóstico" desc="Resolva 95% dos chamados corretamente." status="desbloqueada" />
            <ConquistaCard ico="💬" tit="Comunicador" desc="Responda 50 chamados em menos de 1 hora." status="bloqueada" />
            <ConquistaCard ico="🔥" tit="Sem Descanso" desc="Resolva chamados durante 7 dias consecutivos." status="bloqueada" />
          </motion.div>

          {/* Seção Especializações */}
          <motion.h4 variants={itemVariants}>💻 Especializações</motion.h4>
          <motion.div className="conquistas-grid" variants={containerVariants}>
            <ConquistaCard ico="💻" tit="Especialista em Hardware" desc="Conclua 50 chamados de Hardware." status="desbloqueada" />
            <ConquistaCard ico="🖥️" tit="Especialista em Software" desc="Conclua 50 chamados de Software." status="desbloqueada" />
            <ConquistaCard ico="🌐" tit="Especialista em Redes" desc="Conclua 50 chamados de Redes." status="bloqueada" />
            <ConquistaCard ico="🖨️" tit="Especialista em Impressoras" desc="Conclua 50 chamados de Impressoras." status="bloqueada" />
            <ConquistaCard ico="🔐" tit="Especialista em Segurança" desc="Conclua 30 chamados relacionados à segurança." status="bloqueada" />
          </motion.div>

          {/* Seção Qualidade */}
          <motion.h4 variants={itemVariants}>⭐ Qualidade</motion.h4>
          <motion.div className="conquistas-grid" variants={containerVariants}>
            <ConquistaCard ico="⭐" tit="Excelência no Atendimento" desc="Receba média superior a 4,5 estrelas." status="desbloqueada" />
            <ConquistaCard ico="🤝" tit="Cliente Satisfeito" desc="Receba 50 avaliações com 5 estrelas." status="desbloqueada" />
            <ConquistaCard ico="🌙" tit="Plantonista" desc="Resolva 10 chamados fora do horário comercial." status="bloqueada" />
            <ConquistaCard ico="🚀" tit="Primeiro Atendimento" desc="Conclua seu primeiro chamado." status="desbloqueada" />
            <ConquistaCard ico="💯" tit="Cem por Cento" desc="Receba 10 avaliações cinco estrelas consecutivas." status="bloqueada" />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} style={{ marginTop: "30px", textAlign: "center" }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/ChamadosTecnico" className="new-ticket">
              Ver todos os chamados
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}

// Sub-componente para organizar os cards de conquista e manter o código limpo
function ConquistaCard({ ico, tit, desc, status }: { ico: string, tit: string, desc: string, status: string }) {
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