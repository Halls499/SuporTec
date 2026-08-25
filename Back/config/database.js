import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Tentando conectar com senha direta...");

const pool = mysql.createPool({
  host: "mysql.railway.internal",
  user: "root",
  password: "NJmciYzGhdnywaukIdrvTirxMfxobULD", // Senha fixa direto aqui para testar
  database: "railway",
  port: 3306,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
