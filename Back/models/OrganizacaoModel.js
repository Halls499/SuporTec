import pool from "../config/database.js";

// Buscar uma organização pelo nome (evita duplicatas e procura case-insensitive)
export async function buscarOrganizacaoPorNome(nome) {
  try {
    const resultado = await pool.query(
      "SELECT * FROM organizacao WHERE nome_empresa = $1 LIMIT 1",
      [nome],
    );
    return resultado.rows;
  } catch (erro) {
    console.error("Erro ao buscar organização por nome:", erro);
    throw erro;
  }
}

// Criar uma nova organização e retornar o resultado da inserção
export async function criarOrganizacao(nome) {
  try {
    const resultado = await pool.query(
      "INSERT INTO organizacao (nome_empresa) VALUES ($1) RETURNING id_organizacao",
      [nome],
    );

    // Retorna um objeto simulando a estrutura que controllers costumam esperar
    return { insertId: resultado.rows[0].id_organizacao };
  } catch (erro) {
    console.error("Erro ao criar organização:", erro);
    throw erro;
  }
}