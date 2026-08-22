import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Cria o pool utilizando a URI completa fornecida pelo Aiven (já inclui SSL e parâmetros)
const pool = mysql.createPool(
  process.env.DATABASE_URL || {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    connectTimeout: 30000,
  },
);

// Teste inicial de conexão
pool
  .getConnection()
  .then((connection) => {
    console.log("🚀 Conectado ao Aiven com sucesso!");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no Aiven:", err.message);
  });

export default pool;
