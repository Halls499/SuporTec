import pool from "../config/database.js";

// Busca todas as mensagens de um chamado
export async function findByChamado(id_chamado) {
  try {
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
      [id_chamado],
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Erro no model findByChamado:", error);
    throw error;
  }
}

// Cria uma nova mensagem e retorna APENAS ela, com o tipo_usuario
export async function create({ mensagem, fk_usuario, fk_chamado }) {
  try {
    // 1. Insere a mensagem
    const [resultado] = await pool.query(
      "INSERT INTO mensagem (mensagem, fk_usuario, fk_chamado, data_envio) VALUES (?, ?, ?, NOW())",
      [mensagem, fk_usuario, fk_chamado],
    );

    // 2. Busca APENAS a mensagem inserida para incluir o tipo_usuario
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
      [resultado.insertId],
    );

    return rows[0] || null; // Retorna o objeto da mensagem criada
  } catch (error) {
    console.error("Erro no model create (chat):", error);
    throw error;
  }
}
