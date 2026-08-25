import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 DEBUG VARIÁVEIS:");
console.log("HOST:", process.env.MYSQLHOST || process.env.DB_HOST);
console.log("USER:", process.env.MYSQLUSER || process.env.DB_USER);
console.log("PORT:", process.env.MYSQLPORT || process.env.DB_PORT);

const pool = mysql.createPool({
  host:
    process.env.MYSQLHOST || process.env.DB_HOST || "mysql.railway.internal",
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password:
    process.env.MYSQLPASSWORD ||
    process.env.DB_PASSWORD ||
    process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "railway",
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
