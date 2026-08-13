import pool from "../config/database.js";

// Mostrar mensagens de um chamado específico trazendo explicitamente o tipo do usuário do banco
export async function findByChamado(id_chamado) {
  const [rows] = await pool.query(
    `SELECT 
      m.id_mensagem,
      m.mensagem,
      m.data_envio,
      m.fk_usuario,
      m.fk_chamado,
      u.nome AS nome_usuario,
      u.tipo_usuario 
     FROM mensagem m
     JOIN usuario u ON m.fk_usuario = u.id_usuario
     WHERE m.fk_chamado = ? 
     ORDER BY m.data_envio ASC`,
    [id_chamado]
  );
  return rows;
}

// Criar uma nova mensagem e retornar imediatamente o objeto completo com o tipo do usuário correto
export async function create({ mensagem, fk_usuario, fk_chamado }) {
  const [resultado] = await pool.query(
    "INSERT INTO mensagem (mensagem, fk_usuario, fk_chamado, data_envio) VALUES (?, ?, ?, NOW())",
    [mensagem, fk_usuario, fk_chamado]
  );

  const [rows] = await pool.query(
    `SELECT 
      m.id_mensagem,
      m.mensagem,
      m.data_envio,
      m.fk_usuario,
      m.fk_chamado,
      u.nome AS nome_usuario,
      u.tipo_usuario 
     FROM mensagem m
     JOIN usuario u ON m.fk_usuario = u.id_usuario
     WHERE m.id_mensagem = ?`,
    [resultado.insertId]
  );

  return rows[0];
}