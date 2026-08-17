import express from "express";
import pool from "../config/database.js"; 
import { verificarToken } from "../middleware/authMiddleware.js"; // Garanta que o nome do middleware/import bate com o que você usa no projeto

const router = express.Router();

router.get("/", verificarToken, async (req, res) => {
  // Pega o ID do técnico de forma segura a partir do token decodificado pelo middleware
  const idTecnico = req.usuario?.id_usuario || req.usuario?.id || req.user?.id;

  if (!idTecnico) {
    return res.status(400).json({ erro: "ID do técnico não informado ou usuário não autenticado." });
  }

  try {
    const connection = await pool.getConnection();

    // 1. Calcular métricas reais do técnico
    const [resResolvidos] = await connection.execute(
      `SELECT COUNT(*) AS total FROM chamado WHERE fk_tecnico = ? AND situacao = 'Resolvido'`,
      [idTecnico]
    );
    const totalResolvidos = resResolvidos[0].total;

    const [resHardware] = await connection.execute(
      `SELECT COUNT(*) AS total FROM chamado WHERE fk_tecnico = ? AND situacao = 'Resolvido' AND categoria = 'Hardware'`,
      [idTecnico]
    );
    const totalHardware = resHardware[0].total;

    // 2. Regras de Desbloqueio Automático
    // Primeiro Atendimento (ID 14) -> >= 1 resolvido
    if (totalResolvidos >= 1) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 14)`,
        [idTecnico]
      );
    }

    // Mestre do Suporte (ID 1) -> >= 100 resolvidos
    if (totalResolvidos >= 100) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 1)`,
        [idTecnico]
      );
    }

    // Especialista em Hardware (ID 6) -> >= 50 de hardware
    if (totalHardware >= 50) {
      await connection.execute(
        `INSERT IGNORE INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, 6)`,
        [idTecnico]
      );
    }

    // 3. Buscar todas as conquistas e o status atual do técnico
    const [todasConquistas] = await connection.execute(`
      SELECT 
        c.id_conquista, 
        c.titulo, 
        c.descricao,
        CASE WHEN uc.fk_usuario IS NOT NULL THEN 'desbloqueada' ELSE 'bloqueada' END AS status
      FROM conquista c
      LEFT JOIN usuario_conquista uc ON c.id_conquista = uc.fk_conquista AND uc.fk_usuario = ?
    `, [idTecnico]);

    connection.release();
    res.json(todasConquistas);

  } catch (erro) {
    console.error("Erro ao processar conquistas:", erro);
    res.status(500).json({ erro: "Erro interno ao buscar conquistas." });
  }
});

export default router;