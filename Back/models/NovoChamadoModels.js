import pool from "../config/database.js";

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
    const [resultado] = await pool.query(
      `
      INSERT INTO chamado (
        fk_organizacao, titulo, descricao, categoria, prioridade, tipo_atendimento, 
        endereco, empresa, setor, sala, tipo_contato, contato, fk_cliente
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        fk_organizacao !== undefined ? fk_organizacao : null, // 🎯 Agora aceita null corretamente
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

    return resultado;
  } catch (error) {
    console.error("Erro no model abrirChamado:", error);
    throw error;
  }
}

export async function listarChamadosPorClienteEOrganizacao(
  fk_cliente,
  fk_organizacao,
) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM chamado 
       WHERE fk_cliente = ? AND (fk_organizacao = ? OR (? IS NULL AND fk_organizacao IS NULL))
       ORDER BY data_abertura DESC`,
      [fk_cliente, fk_organizacao, fk_organizacao],
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Erro no model listarChamadosPorClienteEOrganizacao:", error);
    throw error;
  }
}

export async function listarChamadosPorOrganizacao(fk_organizacao) {
  try {
    console.log(
      "DEBUG: Iniciando busca de todos os chamados sem filtro de organização...",
    );

    // Query de teste: Traz TUDO sem filtros
    const [rows] = await pool.query(
      `SELECT c.*, u.nome AS nome_solicitante 
       FROM chamado c
       LEFT JOIN usuario u ON c.fk_cliente = u.id_usuario
       ORDER BY c.data_abertura DESC`,
    );

    console.log("DEBUG: Chamados encontrados:", rows.length);
    return rows;
  } catch (error) {
    console.error("ERRO NO MODEL:", error);
    throw error;
  }
}

export async function buscarChamadoPorIdTecnico(id) {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.nome AS nome_solicitante 
       FROM chamado c
       LEFT JOIN usuario u ON c.fk_cliente = u.id_usuario
       WHERE c.id_chamado = ?`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Erro no model buscarChamadoPorIdTecnico:", error);
    throw error;
  }
}

export async function cancelarChamadoSaaS(
  id_chamado,
  fk_cliente,
  fk_organizacao,
) {
  try {
    const [resultado] = await pool.query(
      `UPDATE chamado 
       SET situacao = 'Cancelado' 
       WHERE id_chamado = ? AND fk_cliente = ? AND (fk_organizacao = ? OR (? IS NULL AND fk_organizacao IS NULL)) AND situacao != 'Resolvido'`,
      [id_chamado, fk_cliente, fk_organizacao, fk_organizacao],
    );
    return resultado.affectedRows > 0;
  } catch (error) {
    console.error("Erro no model cancelarChamadoSaaS:", error);
    throw error;
  }
}

export async function atualizarChamadoSaaS(id_chamado, fk_organizacao, dados) {
  const situacao = dados.situacao;
  const fk_tecnico = dados.fk_tecnico;

  try {
    const [resultado] = await pool.query(
      `UPDATE chamado 
       SET situacao = ?, 
           fk_tecnico = ?
       WHERE id_chamado = ? AND (fk_organizacao = ? OR (? IS NULL AND fk_organizacao IS NULL))`,
      [
        situacao,
        fk_tecnico || null,
        id_chamado,
        fk_organizacao,
        fk_organizacao,
      ],
    );

    return resultado.affectedRows > 0;
  } catch (error) {
    console.error("Erro no model atualizarChamadoSaaS:", error);
    throw error;
  }
}

export async function buscarClienteDoChamado(id_chamado) {
  try {
    const [rows] = await pool.query(
      `SELECT fk_cliente FROM chamado WHERE id_chamado = ?`,
      [id_chamado],
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Erro no model buscarClienteDoChamado:", error);
    throw error;
  }
}

export async function aceitarChamadoModel(id_tecnico, id_chamado) {
  try {
    const query = `
      UPDATE chamado 
      SET fk_tecnico = ?, situacao = 'Em andamento' 
      WHERE id_chamado = ?
    `;
    return await pool.query(query, [id_tecnico, id_chamado]);
  } catch (error) {
    console.error("Erro no model aceitarChamadoModel:", error);
    throw error;
  }
}
