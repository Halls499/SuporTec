import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/database.js";
import usuarioRoutes from "./routes/UsuariosRoutes.js";
import chamadosRoutes from "./routes/NovoChamadoRoutes.js";

dotenv.config();

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Rota de Healthcheck (Ótima para validar se o servidor e banco estão ok no Railway)
app.get("/health", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res
      .status(200)
      .json({ status: "OK", message: "API e Banco rodando liso!" });
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message });
  }
});

// Registra as Rotas da API
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/chamados", chamadosRoutes);

// Middleware para rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({ mensagem: "Rota não encontrada." });
});

// Teste de conexão inicial com o MySQL no Railway
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Conectado ao banco de dados no Railway com sucesso!");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no banco de dados:", err.message);
  });

// Porta do servidor (pega do ambiente do Railway ou usa 3000 local)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SuporTec SaaS rodando na porta ${PORT}`);
});
