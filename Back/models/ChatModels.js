import pool from "../config/database.js";

// Mostrar mensagens de um chamado específico trazendo explicitamente o tipo do usuário do banco
export async function findByChamado(id_chamado) {
  console.log(
    "RODANDO A NOVA QUERY COM JOIN NO BANCO PARA O CHAMADO:",
    id_chamado,
  );
  try {
    const [rows] = await pool.query(
      `SELECT 
        m.id_mensagem,
        m.mensagem,
        m.data_envio,
        m.fk_usuario,
        m.fk_chamado,
        m.fk_remetente,
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

// Criar uma nova mensagem e retornar imediatamente o objeto completo com o tipo do usuário correto
export async function create({
  mensagem,
  fk_usuario,
  fk_remetente,
  fk_chamado,
}) {
  try {
    const [resultado] = await pool.query(
      "INSERT INTO mensagem (mensagem, fk_usuario, fk_remetente, fk_chamado, data_envio) VALUES (?, ?, ?, ?, NOW())",
      [mensagem, fk_usuario, fk_remetente, fk_chamado],
    );

    const [rows] = await pool.query(
      `SELECT 
        m.id_mensagem,
        m.mensagem,
        m.data_envio,
        m.fk_usuario,
        m.fk_chamado,
        m.fk_remetente,
        u.nome AS nome_usuario,
        u.tipo_usuario 
       FROM mensagem m
       JOIN usuario u ON m.fk_usuario = u.id_usuario
       WHERE m.id_mensagem = ?`,
      [resultado.insertId],
    );

    return rows[0] || null;
  } catch (error) {
    console.error("Erro no model create (chat):", error);
    throw error;
  }
}
