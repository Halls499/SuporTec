import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Pega a senha de qualquer variável que o Railway possa ter gerado
const senhaBanco =
  process.env.MYSQL_ROOT_PASSWORD ||
  process.env.MYSQLPASSWORD ||
  process.env.DB_PASSWORD;

console.log("🔍 DEBUG VARIÁVEIS:");
console.log("HOST:", process.env.MYSQLHOST || process.env.DB_HOST);
console.log("USER:", process.env.MYSQLUSER || process.env.DB_USER);
console.log("PORT:", process.env.MYSQLPORT || process.env.DB_PORT);
console.log("SENHA ENCONTRADA?:", senhaBanco ? "SIM" : "NÃO");

const pool = mysql.createPool({
  host:
    process.env.MYSQLHOST || process.env.DB_HOST || "mysql.railway.internal",
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: senhaBanco,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "railway",
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
