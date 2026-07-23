import pool from "../config/database.js";

export async function abrirChamado(chamado) {
  const {
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
    fk_cliente
  } = chamado;

  const [resultado] = await pool.query(
    `
    INSERT INTO chamado (
      titulo, descricao, categoria, prioridade, tipo_atendimento, 
      endereco, empresa, setor, sala, tipo_contato, contato, fk_cliente
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
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

export async function listarChamadosPorCliente(fk_cliente){
  const [rows] = await pool.query(
    "SELECT * FROM chamado WHERE fk_cliente = ?",
    [fk_cliente]
  );

  return rows;
}

export async function buscarChamadoPorId(id) {
  const [rows] = await pool.query(
    `SELECT 
      id_chamado, 
      titulo, 
      descricao, 
      categoria, 
      prioridade, 
      situacao, 
      data_abertura 
     FROM chamado 
     WHERE id_chamado = ?`,
    [id]
  );

  return rows[0]; // Retorna o chamado encontrado ou undefined
}