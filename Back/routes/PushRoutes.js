import { Router } from "express";
import * as chamadoController from "../controllers/NovoChamadoController.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import pool from "../config/database.js";

const router = Router();

router.get("/tecnicos/perfil", verificarToken, async (req, res) => {
  try {
    const idUsuario = req.usuario?.id_usuario || req.usuario?.id;

    if (!idUsuario) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const [resultado] = await pool.query(
      "SELECT id_usuario, nome, email, xp, nivel FROM usuario WHERE id_usuario = ?",
      [idUsuario],
    );

    if (!Array.isArray(resultado) || resultado.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    return res.status(200).json(resultado[0]);
  } catch (erro) {
    console.error("Erro ao buscar perfil:", erro);
    return res.status(500).json({ erro: "Erro ao buscar perfil" });
  }
});

router.put("/tecnicos/perfil", verificarToken, async (req, res) => {
  try {
    const idUsuario = req.usuario?.id_usuario || req.usuario?.id;
    const { nome, email } = req.body;

    if (!idUsuario) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    if (!nome || !email) {
      return res.status(400).json({ erro: "Nome e e-mail são obrigatórios." });
    }

    const [resultado] = await pool.query(
      "UPDATE usuario SET nome = ?, email = ? WHERE id_usuario = ?",
      [nome, email, idUsuario],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    return res.status(200).json({ mensagem: "Perfil atualizado com sucesso!" });
  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro);
    return res.status(500).json({ erro: "Erro ao atualizar perfil" });
  }
});

router.get("/tecnico", verificarToken, chamadoController.listarChamadosTecnico);
router.post("/", verificarToken, chamadoController.AbrirNovoChamado);
router.get("/", verificarToken, chamadoController.listarMeusChamados);

router.get("/:id", verificarToken, chamadoController.buscarChamadoPorId);
router.patch("/:id/cancelar", verificarToken, chamadoController.cancelarChamadoPorId);
router.patch("/:id/aceitar", verificarToken, chamadoController.aceitarChamado);
router.patch("/:id/status", verificarToken, chamadoController.atualizarStatusChamado);
router.get("/:id/mensagens", verificarToken, chamadoController.buscarMensagensChamado);
router.post("/:id/mensagens", verificarToken, chamadoController.enviarMensagemChamado);
router.put("/:id", verificarToken, chamadoController.atualizarChamado);

export default router;