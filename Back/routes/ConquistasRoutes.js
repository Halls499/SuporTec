import express from "express";
import pool from "../config/database.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rota para buscar conquistas do técnico
router.get("/", verificarToken, async (req, res) => {
  const idTecnico = req.usuario?.id_usuario || req.usuario?.id || req.user?.id;

  if (!idTecnico) {
    return res
      .status(400)
      .json({
        erro: "ID do técnico não informado ou usuário não autenticado.",
      });
  }

  let connection;

  try {
    connection = await pool.getConnection();

    // 1. Busca unificada de métricas (Total resolvido e contagem por categoria de uma só vez)
    const [metricasChamados] = await connection.execute(
      `SELECT 
         SUM(CASE WHEN situacao = 'Resolvido' THEN 1 ELSE 0 END) AS total_resolvidos,
         SUM(CASE WHEN situacao = 'Resolvido' AND categoria = 'Hardware' THEN 1 ELSE 0 END) AS total_hardware,
         SUM(CASE WHEN situacao = 'Resolvido' AND categoria = 'Software' THEN 1 ELSE 0 END) AS total_software,
         SUM(CASE WHEN situacao = 'Resolvido' AND categoria = 'Redes' THEN 1 ELSE 0 END) AS total_redes,
         SUM(CASE WHEN situacao = 'Resolvido' AND categoria = 'Impressoras' THEN 1 ELSE 0 END) AS total_impressoras
       FROM chamado 
       WHERE fk_tecnico = ?`,
      [idTecnico],
    );

    const dados = metricasChamados[0] || {};
    const totalResolvidos = Number(dados.total_resolvidos) || 0;
    const totalHardware = Number(dados.total_hardware) || 0;
    const totalSoftware = Number(dados.total_software) || 0;
    const totalRedes = Number(dados.total_redes) || 0;
    const totalImpressoras = Number(dados.total_impressoras) || 0;

    // Buscar nível atual do usuário
    const [resUsuario] = await connection.execute(
      `SELECT nivel FROM usuario WHERE id_usuario = ?`,
      [idTecnico],
    );
    const nivelUsuario = resUsuario[0]?.nivel || 1;

    // Buscar total de conquistas já desbloqueadas
    const [resConquistasUsuario] = await connection.execute(
      `SELECT COUNT(*) AS total FROM usuario_conquista WHERE fk_usuario = ?`,
      [idTecnico],
    );
    const totalConquistasDesbloqueadas = resConquistasUsuario[0]?.total || 0;

    // 2. Regras de Desbloqueio Automático

    // ID 1: Primeiro Atendimento (>= 1 chamado resolvido)
    if (totalResolvidos >= 1) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 1)`,
        [idTecnico],
      );
    }

    // ID 4: Mestre do Suporte (>= 100 chamados resolvidos)
    if (totalResolvidos >= 100) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 4)`,
        [idTecnico],
      );
    }

    // ID 9: Especialista em Hardware (>= 50 chamados)
    if (totalHardware >= 50) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 9)`,
        [idTecnico],
      );
    }

    // ID 10: Especialista em Software (>= 50 chamados)
    if (totalSoftware >= 50) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 10)`,
        [idTecnico],
      );
    }

    // ID 11: Especialista em Redes (>= 50 chamados)
    if (totalRedes >= 50) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 11)`,
        [idTecnico],
      );
    }

    // ID 12: Especialista em Impressoras (>= 50 chamados)
    if (totalImpressoras >= 50) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 12)`,
        [idTecnico],
      );
    }

    // ID 17: Lenda do Suporte (Nível >= 500)
    if (nivelUsuario >= 500) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 17)`,
        [idTecnico],
      );
    }

    // ID 19: Emblema Inicial (>= 3 conquistas desbloqueadas)
    if (totalConquistasDesbloqueadas >= 3) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 19)`,
        [idTecnico],
      );
    }

    // ID 20: Meio do Caminho (Nível >= 250)
    if (nivelUsuario >= 250) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 20)`,
        [idTecnico],
      );
    }

    // 3. Buscar todas as conquistas e o status atualizado do técnico
    const [todasConquistas] = await connection.execute(
      `
      SELECT 
        c.id_conquista, 
        c.titulo, 
        c.descricao,
        CASE WHEN uc.fk_usuario IS NOT NULL THEN 'desbloqueada' ELSE 'bloqueada' END AS status
      FROM conquista c
      LEFT JOIN usuario_conquista uc ON c.id_conquista = uc.fk_conquista AND uc.fk_usuario = ?
    `,
      [idTecnico],
    );

    return res
      .status(200)
      .json(Array.isArray(todasConquistas) ? todasConquistas : []);
  } catch (erro) {
    console.error("Erro ao processar conquistas:", erro);
    return res.status(500).json({ erro: "Erro interno ao buscar conquistas." });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
