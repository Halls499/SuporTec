import pool from "../config/database.js";

export async function abrirChamado(chamado) {
  const {
    fk_organizacao, // 🏢 Campo indispensável para o SaaS
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

  const [resultado] = await pool.query(
    `
    INSERT INTO chamado (
      fk_organizacao, titulo, descricao, categoria, prioridade, tipo_atendimento, 
      endereco, empresa, setor, sala, tipo_contato, contato, fk_cliente
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      fk_organizacao || 1,
      titulo,
      descricao,
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
}

// 🏢 Busca os chamados do cliente restritos à sua organização (empresa)
export async function listarChamadosPorClienteEOrganizacao(
  fk_cliente,
  fk_organizacao,
) {
  const [rows] = await pool.query(
    `SELECT * FROM chamado 
     WHERE fk_cliente = ? AND fk_organizacao = ?
     ORDER BY data_abertura DESC`,
    [fk_cliente, fk_organizacao],
  );

  return rows;
}

// 👨‍💻 NOVO (SaaS): Busca TODOS os chamados da organização para a visão do Técnico
export async function listarChamadosPorOrganizacao(fk_organizacao) {
  const [rows] = await pool.query(
    `SELECT 
        c.*, 
        u.nome AS nome_solicitante 
     FROM chamado c
     LEFT JOIN usuario u ON c.fk_cliente = u.id_usuario
     WHERE c.fk_organizacao = ?
     ORDER BY c.data_abertura DESC`,
    [fk_organizacao],
  );

  return rows;
}

// 🏢 Busca chamado por ID validando o isolamento da organização
export async function buscarChamadoPorIdEOrganizacao(id, fk_organizacao) {
  const [rows] = await pool.query(
    `SELECT 
      id_chamado, 
      fk_organizacao,
      titulo, 
      descricao, 
      categoria, 
      prioridade, 
      situacao, 
      tipo_atendimento,
      endereco,
      empresa,
      setor,
      sala,
      tipo_contato,
      contato,
      data_abertura,
      data_fechamento,
      fk_cliente,
      fk_tecnico
     FROM chamado 
     WHERE id_chamado = ? AND fk_organizacao = ?`,
    [id, fk_organizacao],
  );

  return rows[0]; // Retorna o chamado encontrado ou undefined
}

// 🏢 Cancela o chamado validando cliente e organização
export async function cancelarChamadoSaaS(
  id_chamado,
  fk_cliente,
  fk_organizacao,
) {
  const [resultado] = await pool.query(
    `UPDATE chamado 
     SET situacao = 'Cancelado' 
     WHERE id_chamado = ? AND fk_cliente = ? AND fk_organizacao = ? AND situacao != 'Resolvido'`,
    [id_chamado, fk_cliente, fk_organizacao],
  );

  return resultado.affectedRows > 0;
}
