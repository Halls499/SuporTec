import pool from "../config/database.js";

// Mostrar mensagens de um chamado específico
export async function findByChamado(id_chamado) {
  const [rows] = await pool.query(
    "SELECT * FROM mensagem WHERE fk_chamado = ? ORDER BY data_envio ASC",
    [id_chamado]
  );
  return rows;
}

// Criar uma nova mensagem
export async function create({ mensagem, fk_usuario, fk_chamado }) {
  const [resultado] = await pool.query(
    "INSERT INTO mensagem (mensagem, fk_usuario, fk_chamado, data_envio) VALUES (?, ?, ?, NOW())",
    [mensagem, fk_usuario, fk_chamado]
  );
  return { id_mensagem: resultado.insertId, mensagem, fk_usuario, fk_chamado };
}