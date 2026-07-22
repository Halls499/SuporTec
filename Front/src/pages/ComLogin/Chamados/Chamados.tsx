import "./Chamados.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

function Chamados() {
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

          <MotionLink to="/detalhes/001">

            <motion.div
              className="chamado-card"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03,
                y: -5
              }}
            >
              <h2>Chamado #001</h2>
              <p>Problema: Computador não liga</p>
              <p>Status: 🔧 Em andamento</p>
              <p>Prioridade: 🕒 Média</p>
              <p>Aberto em: 07/07/2026</p>
            </motion.div>

          </MotionLink>



          <MotionLink to="/detalhes/002">

            <motion.div
              className="chamado-card"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03,
                y: -5
              }}
            >
              <h2>Chamado #002</h2>
              <p>Problema: Computador não liga</p>
              <p>Status: 🔧 Em andamento</p>
              <p>Prioridade: 🕒 Média</p>
              <p>Aberto em: 07/07/2026</p>
            </motion.div>

          </MotionLink>



          <MotionLink to="/detalhes/003">

            <motion.div
              className="chamado-card"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03,
                y: -5
              }}
            >
              <h2>Chamado #003</h2>
              <p>Problema: Erro no sistema</p>
              <p>Status: ⏳ Aguardando resposta</p>
              <p>Prioridade: 🔴 Alta</p>
              <p>Aberto em: 07/07/2026</p>
            </motion.div>

          </MotionLink>


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