import pool from "../config/database.js";

// Listar todos os usuários (Uso global / Admin do sistema)
export async function listarUsuarios() {
  const [rows] = await pool.query("SELECT * FROM usuario");
  return rows;
}

// 🏢 NOVO (SaaS): Listar usuários filtrados por organização
export async function listarUsuariosPorOrganizacao(fk_organizacao) {
  const [rows] = await pool.query(
    "SELECT * FROM usuario WHERE fk_organizacao = ?",
    [fk_organizacao],
  );
  return rows;
}

// 🏢 ATUALIZADO (SaaS): Insere o usuário associando à sua empresa (fk_organizacao)
export async function criarUsuario(
  nome,
  email,
  senha,
  tipo_usuario,
  fk_organizacao = null,
) {
  const [resultado] = await pool.query(
    `
    INSERT INTO usuario (nome, email, senha, tipo_usuario, fk_organizacao, xp, nivel, data_cadastro)
    VALUES (?, ?, ?, ?, ?, 0, 1, NOW())
    `,
    [nome, email, senha, tipo_usuario, fk_organizacao],
  );

  return resultado;
}

export async function verificarEmailExistente(email) {
  const [resultado] = await pool.query(
    "SELECT email FROM usuario WHERE email = ?",
    [email],
  );
  return resultado;
}

export async function buscarUsuarioPorId(id) {
  const [rows] = await pool.query(
    "SELECT * FROM usuario WHERE id_usuario = ?",
    [id],
  );
  return rows;
}

export async function buscarUsuarioPorEmail(email) {
  const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [
    email,
  ]);
  return rows;
}

// Atualiza XP e Nível do Técnico
export async function atualizarXpENivelTecnico(id_usuario, novoXp, novoNivel) {
  const [resultado] = await pool.query(
    `
    UPDATE usuario 
    SET xp = ?, nivel = ? 
    WHERE id_usuario = ? AND tipo_usuario = 'tecnico'
    `,
    [novoXp, novoNivel, id_usuario],
  );
  return resultado;
}
