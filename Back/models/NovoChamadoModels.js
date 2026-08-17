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

export async function buscarChamadoPorIdEOrganizacao(id, fk_organizacao) {
  const [rows] = await pool.query(
    `SELECT 
     id_chamado, fk_organizacao, titulo, descricao, categoria, prioridade, 
     situacao, tipo_atendimento, endereco, empresa, setor, sala, 
     tipo_contato, contato, data_abertura, data_fechamento, fk_cliente, fk_tecnico
     FROM chamado 
     WHERE id_chamado = ? AND fk_organizacao = ?`,
    [id, fk_organizacao],
  );
  return rows[0];
}

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

export async function atualizarChamadoSaaS(id_chamado, fk_organizacao, dados) {
  const situacao = dados.situacao;
  const fk_tecnico = dados.fk_tecnico;

  console.log("-----------------------------------------");
  console.log("CHEGOU NO MODEL - situacao:", situacao);
  console.log("CHEGOU NO MODEL - fk_tecnico:", fk_tecnico);
  console.log("-----------------------------------------");

  const [resultado] = await pool.query(
    `UPDATE chamado 
     SET situacao = ?, 
         fk_tecnico = ?
     WHERE id_chamado = ? AND fk_organizacao = ?`,
    [situacao, fk_tecnico || null, id_chamado, fk_organizacao],
  );

  return resultado.affectedRows > 0;
}

export async function buscarClienteDoChamado(id_chamado) {
  const [rows] = await pool.query(
    `SELECT fk_cliente FROM chamado WHERE id_chamado = ?`,
    [id_chamado],
  );
  return rows[0];
}

export async function aceitarChamadoModel(id_tecnico, id_chamado) {
  // Nota: Verifique se o nome da sua tabela no banco é 'chamado' ou 'chamados' (suas outras queries usam 'chamado')
  const query = `
    UPDATE chamado 
    SET fk_tecnico = ?, situacao = 'Em andamento' 
    WHERE id_chamado = ?
  `;
  return await pool.query(query, [id_tecnico, id_chamado]);
}