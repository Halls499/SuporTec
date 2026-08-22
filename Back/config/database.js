import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 segundos
  connectTimeout: 30000,

  ssl: {
    rejectUnauthorized: false
  }
});

// Teste inicial de conexão
pool.getConnection()
  .then(connection => {
    console.log("🚀 Conectado ao banco de dados com sucesso!");
    connection.release();
  })
  .catch(err => {
    console.error("❌ Erro ao conectar no banco de dados:", err.message);
  });

export default pool;