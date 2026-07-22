import express from "express";
import dotenv from "dotenv";
import pool from "./config/database.js";
import usuarioRoutes from "./routes/UsuariosRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware
app.use(express.json());

// Rotas
app.use(usuarioRoutes);

// Teste de conexão com o banco
pool.getConnection()
    .then((connection) => { 
        console.log("✅ Banco conectado com sucesso!");
        connection.release();
    })
    .catch((err) => {
        console.log("❌ Erro ao conectar no banco:", err.message);
    });

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});