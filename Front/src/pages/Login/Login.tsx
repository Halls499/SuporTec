import "./Login.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

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
      duration: 0.4,
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

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      // Garante que a URL base não tenha barra no final
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

      const resposta = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro || "E-mail ou senha incorretos.");
        return;
      }

      // Salva sessão do usuário
      localStorage.setItem("usuario", JSON.stringify(dados.usuario));
      localStorage.setItem("token", dados.token);

      // Dispara evento para atualização em outros componentes se necessário
      window.dispatchEvent(new Event("login"));

      // Redireciona conforme o perfil
      if (dados.usuario?.tipo_usuario === "tecnico") {
        navigate("/dashboard-tecnico");
      } else {
        navigate("/dashboard");
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
      alert("Falha na conexão com o servidor. Verifique sua internet.");
    }
  }

  return (
    <main className="login-page">
      <motion.div
        className="auth-container"
        variants={boxVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="auth-box">
          <motion.h1 variants={textVariants}>Logar conta</motion.h1>

          <motion.form
            onSubmit={handleLogin}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
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

            <motion.button
              type="submit"
              variants={fieldVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Entrar{" "}
            </motion.button>
          </motion.form>

          <p className="auth-link">
            Não tem conta?
            <motion.a href="/cadastro">Criar conta</motion.a>
          </p>
        </div>
      </motion.div>
    </main>
  );
}

export default Login;
