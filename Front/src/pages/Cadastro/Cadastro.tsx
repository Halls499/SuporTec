import "./Cadastro.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fieldVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const boxVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const textVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          tipo_usuario: "cliente",
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro);
        return;
      }

      alert("Usuário cadastrado com sucesso!");

      navigate("/login");
    } catch (erro) {
      console.error(erro);
      alert("Erro ao cadastrar usuário.");
    }
  }

  return (
    <main className="cadastro-page">
      <motion.div
        className="auth-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="auth-box"
          variants={boxVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={textVariants} initial="hidden" animate="visible">
            Criar conta
          </motion.h1>

          <motion.p variants={textVariants} initial="hidden" animate="visible">
            Cadastre-se para acessar o sistema de chamados
          </motion.p>

          <motion.form
            onSubmit={handleCadastro}
            variants={boxVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.input
              type="text"
              placeholder="Nome completo"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              variants={fieldVariants}
            />

            <motion.input
              type="email"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variants={fieldVariants}
            />

            <motion.input
              type="password"
              placeholder="Senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              variants={fieldVariants}
            />

            <motion.input
              type="password"
              placeholder="Confirmar senha"
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              variants={fieldVariants}
            />

            <motion.button
              type="submit"
              variants={fieldVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cadastrar
            </motion.button>
          </motion.form>

          <p className="auth-link">
            Já tem conta?
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Entrar
            </motion.a>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default Cadastro;
