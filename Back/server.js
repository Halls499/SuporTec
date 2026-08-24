import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/database.js";
import usuarioRoutes from "./routes/UsuariosRoutes.js";
import chamadosRoutes from "./routes/NovoChamadoRoutes.js";
import chatRoutes from "./routes/ChatRoutes.js";
import pushRoutes from "./routes/PushRoutes.js";
import conquistasRoutes from "./routes/ConquistasRoutes.js";

dotenv.config();

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Rota de Healthcheck
app.get("/health", async (req, res) => {
  try {
    const client = await pool.connect();
    client.release();
    return res.status(200).json({ status: "OK", message: "API e Banco rodando liso!" });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
});

// Registra as Rotas da API
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/chamados", chamadosRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/push", pushRoutes); 
app.use("/api/conquistas", conquistasRoutes);

// Middleware para rotas não encontradas (404)
app.use((req, res) => {
  return res.status(404).json({ mensagem: "Rota não encontrada." });
});

// Teste de conexão inicial com o PostgreSQL
pool
  .connect()
  .then((client) => {
    console.log("✅ Conectado ao banco de dados com sucesso!");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no banco de dados:", err.message);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SuporTec SaaS rodando na porta ${PORT}`);
});