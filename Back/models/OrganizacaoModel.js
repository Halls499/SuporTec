import conexao from "../config/database.js";

// Buscar uma organização pelo nome (evita duplicatas e procura case-insensitive)
export async function buscarOrganizacaoPorNome(nome) {
  try {
    const [linhas] = await conexao.query(
      "SELECT * FROM organizacao WHERE nome = ? LIMIT 1",
      [nome],
    );
    return linhas;
  } catch (erro) {
    console.error("Erro ao buscar organização por nome:", erro);
    throw erro;
  }
}

// Criar uma nova organização e retornar o resultado da inserção
export async function criarOrganizacao(nome) {
  try {
    const [resultado] = await conexao.query(
      "INSERT INTO organizacao (nome) VALUES (?)",
      [nome],
    );
    return resultado;
  } catch (erro) {
    console.error("Erro ao criar organização:", erro);
    throw erro;
  }
}
