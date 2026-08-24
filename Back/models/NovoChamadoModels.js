import pool from "../config/database.js";

// Função para abrir um novo chamado
export async function abrirChamado(chamado) {
  const {
    fk_organizacao,
    titulo,
    descricao,
    categoria,
    prioridade,
    tipo_atendimento,
    endereco,
    empresa,
    setor,
    sala,
    tipo_contato,
    contato,
    fk_cliente,
  } = chamado;

  try {
    const resultado = await pool.query(
      `
      INSERT INTO chamado (
        fk_organizacao, titulo, descricao, categoria, prioridade, tipo_atendimento, 
        endereco, empresa, setor, sala, tipo_contato, contato, fk_cliente
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id_chamado
      `,
      [
        fk_organizacao !== undefined ? fk_organizacao : null,
        titulo,
        descricao || "",
        categoria,
        prioridade,
        tipo_atendimento,
        endereco || null,
        empresa || null,
        setor || null,
        sala || null,
        tipo_contato,
        contato,
        fk_cliente,
      ],
    );

    // Retorna o objeto simulando a estrutura que o controller espera, contendo o ID inserido
    return { insertId: resultado.rows[0].id_chamado };
  } catch (error) {
    console.error("Erro no model abrirChamado:", error);
    throw error;
  }
}

// Função para listar chamados por cliente e organização
export async function listarChamadosPorClienteEOrganizacao(
  fk_cliente,
  fk_organizacao,
) {
  try {
    const resultado = await pool.query(
      `SELECT * FROM chamado 
       WHERE fk_cliente = $1 AND (fk_organizacao = $2 OR ($2 IS NULL AND fk_organizacao IS NULL))
       ORDER BY data_abertura DESC`,
      [fk_cliente, fk_organizacao],
    );
    return Array.isArray(resultado.rows) ? resultado.rows : [];
  } catch (error) {
    console.error("Erro no model listarChamadosPorClienteEOrganizacao:", error);
    throw error;
  }
}

// Função para buscar chamados por organização
export async function listarChamadosPorOrganizacao(fk_organizacao) {
  try {
    console.log("DEBUG: Iniciando busca de todos os chamados...");

    const resultado = await pool.query(
      `SELECT c.*, u.nome AS nome_solicitante 
       FROM chamado c
       LEFT JOIN usuario u ON c.fk_cliente = u.id_usuario
       ORDER BY c.data_abertura DESC`,
    );

    console.log("DEBUG: Chamados encontrados:", resultado.rows.length);
    return resultado.rows;
  } catch (error) {
    console.error("ERRO NO MODEL:", error);
    throw error;
  }
}

// Função para buscar um chamado específico por ID
export async function buscarChamadoPorIdTecnico(id) {
  try {
    const resultado = await pool.query(
      `SELECT c.*, u.nome AS nome_solicitante 
       FROM chamado c
       LEFT JOIN usuario u ON c.fk_cliente = u.id_usuario
       WHERE c.id_chamado = $1`,
      [id],
    );
    return resultado.rows[0] || null;
  } catch (error) {
    console.error("Erro no model buscarChamadoPorIdTecnico:", error);
    throw error;
  }
}

// Função para cancelar um chamado específico
export async function cancelarChamadoSaaS(
  id_chamado,
  fk_cliente,
  fk_organizacao,
) {
  try {
    const resultado = await pool.query(
      `UPDATE chamado 
       SET situacao = 'Cancelado' 
       WHERE id_chamado = $1 AND fk_cliente = $2 AND (fk_organizacao = $3 OR ($3 IS NULL AND fk_organizacao IS NULL)) AND situacao != 'Resolvido'`,
      [id_chamado, fk_cliente, fk_organizacao],
    );
    // No Postgres, usamos rowCount para saber quantos registros foram afetados
    return resultado.rowCount > 0;
  } catch (error) {
    console.error("Erro no model cancelarChamadoSaaS:", error);
    throw error;
  }
}

// Função para atualizar um chamado específico
export async function atualizarChamadoSaaS(id_chamado, fk_organizacao, dados) {
  const situacao = dados.situacao;
  const fk_tecnico = dados.fk_tecnico;

  try {
    const resultado = await pool.query(
      `UPDATE chamado 
       SET situacao = $1, 
           fk_tecnico = $2
       WHERE id_chamado = $3 AND (fk_organizacao = $4 OR ($4 IS NULL AND fk_organizacao IS NULL))`,
      [situacao, fk_tecnico || null, id_chamado, fk_organizacao],
    );

    return resultado.rowCount > 0;
  } catch (error) {
    console.error("Erro no model atualizarChamadoSaaS:", error);
    throw error;
  }
}

// Função para buscar o cliente de um chamado específico
export async function buscarClienteDoChamado(id_chamado) {
  try {
    const resultado = await pool.query(
      `SELECT fk_cliente FROM chamado WHERE id_chamado = $1`,
      [id_chamado],
    );
    return resultado.rows[0] || null;
  } catch (error) {
    console.error("Erro no model buscarClienteDoChamado:", error);
    throw error;
  }
}

// Função para aceitar um chamado específico
export async function aceitarChamadoModel(id_tecnico, id_chamado) {
  try {
    const query = `
      UPDATE chamado 
      SET fk_tecnico = $1, situacao = 'Em andamento' 
      WHERE id_chamado = $2
    `;
    return await pool.query(query, [id_tecnico, id_chamado]);
  } catch (error) {
    console.error("Erro no model aceitarChamadoModel:", error);
    throw error;
  }
}
