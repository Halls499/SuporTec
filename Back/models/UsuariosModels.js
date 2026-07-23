import pool from "../config/database.js";

export async function listarUsuarios() {
  const [rows] = await pool.query("SELECT * FROM usuario");

  return rows;
}

export async function criarUsuario(nome, email, senha, tipo_usuario) {

  await pool.query(
    `
        INSERT INTO usuario
        (
            nome,
            email,
            senha,
            tipo_usuario,
            data_cadastro
        )
        VALUES
        (?, ?, ?, ?, NOW())
        `,
    [nome, email, senha, tipo_usuario],
  );
}

export async function verificarEmailExistente(email) {
  const [resultado] = await pool.query(
    "SELECT email FROM Usuario WHERE email = ?",
    [email],
  );

  return resultado;
}

export async function buscarUsuarioPorId(id) {
  const [rows] = await pool.query(
    "SELECT * FROM usuario WHERE id_usuario = ?",
    [id]
  );

  return rows;
};

export async function buscarUsuarioPorEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM usuario WHERE email = ?",
    [email]
  );

  return rows;
};
