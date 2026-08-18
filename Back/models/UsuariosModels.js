import pool from "../config/database.js";

// Listar todos os usuários (Uso global / Admin do sistema)
export async function listarUsuarios() {
  try {
    const [rows] = await pool.query("SELECT * FROM usuario");
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Erro no model listarUsuarios:", error);
    throw error;
  }
}

// Listar usuários filtrados por organização
export async function listarUsuariosPorOrganizacao(fk_organizacao) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuario WHERE fk_organizacao = ?",
      [fk_organizacao],
    );
    return Array.isArray(rows) ? rows : [];
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
    const [resultado] = await pool.query(
      `
      INSERT INTO usuario (nome, email, senha, tipo_usuario, fk_organizacao, xp, nivel, data_cadastro)
      VALUES (?, ?, ?, ?, ?, 0, 1, NOW())
      `,
      [nome, email, senha, tipo_usuario, fk_organizacao],
    );

    return resultado;
  } catch (error) {
    console.error("Erro no model criarUsuario:", error);
    throw error;
  }
}

export async function verificarEmailExistente(email) {
  try {
    const [resultado] = await pool.query(
      "SELECT email FROM usuario WHERE email = ?",
      [email],
    );
    return Array.isArray(resultado) ? resultado : [];
  } catch (error) {
    console.error("Erro no model verificarEmailExistente:", error);
    throw error;
  }
}

export async function buscarUsuarioPorId(id) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuario WHERE id_usuario = ?",
      [id],
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Erro no model buscarUsuarioPorId:", error);
    throw error;
  }
}

export async function buscarUsuarioPorEmail(email) {
  try {
    const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [
      email,
    ]);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Erro no model buscarUsuarioPorEmail:", error);
    throw error;
  }
}

// Atualiza XP e Nível do Técnico
export async function atualizarXpENivelTecnico(id_usuario, novoXp, novoNivel) {
  try {
    const [resultado] = await pool.query(
      `
      UPDATE usuario 
      SET xp = ?, nivel = ? 
      WHERE id_usuario = ? AND tipo_usuario = 'tecnico'
      `,
      [novoXp, novoNivel, id_usuario],
    );
    return resultado;
  } catch (error) {
    console.error("Erro no model atualizarXpENivelTecnico:", error);
    throw error;
  }
}