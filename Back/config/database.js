import pkg from 'pg';
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessário para conexões seguras com o Supabase
  },
  family: 4 // Força o uso do IPv4, útil para evitar problemas de conexão em alguns ambientes
});

export default pool;