import pool from "../config/database.js";

// Listar todos os usuários (Uso global / Admin do sistema)
export async function listarUsuarios() {
  try {
    const resultado = await pool.query("SELECT * FROM usuario");
    return Array.isArray(resultado.rows) ? resultado.rows : [];
  } catch (error) {
    console.error("Erro no model listarUsuarios:", error);
    throw error;
  }
}

// Listar usuários filtrados por organização
export async function listarUsuariosPorOrganizacao(fk_organizacao) {
  try {
    const resultado = await pool.query(
      "SELECT * FROM usuario WHERE fk_organizacao = $1",
      [fk_organizacao],
    );
    return Array.isArray(resultado.rows) ? resultado.rows : [];
  } catch (error) {
    console.error("Erro no model listarUsuariosPorOrganizacao:", error);
    throw error;
  }
}

// Insere o usuário associando à sua empresa
export async function criarUsuario(
  nome,
  email,
  senha,
  tipo_usuario,
  fk_organizacao = null,
) {
  try {
    const resultado = await pool.query(
      `
      INSERT INTO usuario (nome, email, senha, tipo_usuario, fk_organizacao, xp, nivel, data_cadastro)
      VALUES ($1, $2, $3, $4, $5, 0, 1, NOW())
      RETURNING id_usuario
      `,
      [nome, email, senha, tipo_usuario, fk_organizacao],
    );

    // Retorna simulando o insertId que o controller espera
    return { insertId: resultado.rows[0].id_usuario };
  } catch (error) {
    console.error("Erro no model criarUsuario:", error);
    throw error;
  }
}

// Função para verificar se o email já existe no banco de dados
export async function verificarEmailExistente(email) {
  try {
    const resultado = await pool.query(
      "SELECT email FROM usuario WHERE email = $1",
      [email],
    );
    return Array.isArray(resultado.rows) ? resultado.rows : [];
  } catch (error) {
    console.error("Erro no model verificarEmailExistente:", error);
    throw error;
  }
}

// Função para buscar um usuário específico por ID
export async function buscarUsuarioPorId(id) {
  try {
    const resultado = await pool.query(
      "SELECT * FROM usuario WHERE id_usuario = $1",
      [id],
    );
    return Array.isArray(resultado.rows) ? resultado.rows : [];
  } catch (error) {
    console.error("Erro no model buscarUsuarioPorId:", error);
    throw error;
  }
}

// Função para buscar um usuário específico por email
export async function buscarUsuarioPorEmail(email) {
  try {
    const resultado = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email],
    );
    return Array.isArray(resultado.rows) ? resultado.rows : [];
  } catch (error) {
    console.error("Erro no model buscarUsuarioPorEmail:", error);
    throw error;
  }
}

// Atualiza XP e Nível do Técnico
export async function atualizarXpENivelTecnico(id_usuario, novoXp, novoNivel) {
  try {
    const resultado = await pool.query(
      `
      UPDATE usuario 
      SET xp = $1, nivel = $2 
      WHERE id_usuario = $3 AND tipo_usuario = 'tecnico'
      `,
      [novoXp, novoNivel, id_usuario],
    );
    return resultado;
  } catch (error) {
    console.error("Erro no model atualizarXpENivelTecnico:", error);
    throw error;
  }
}
