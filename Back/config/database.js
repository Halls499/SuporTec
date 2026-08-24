import pkg from 'pg';
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Cria o pool utilizando a URI completa do Supabase (armazenada em process.env.DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessário para conexões seguras com o Supabase
  },
});

// Teste inicial de conexão
pool.connect()
  .then((client) => {
    console.log("🚀 Conectado ao Supabase (PostgreSQL) com sucesso!");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no Supabase:", err.message);
  });

export default pool;