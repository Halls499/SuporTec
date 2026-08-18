import { Router } from "express";
import * as chamadoController from "../controllers/NovoChamadoController.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import pool from "../config/database.js";

const router = Router();

// 1. POST /api/chamados -> Criar novo chamado
router.post("/", verificarToken, chamadoController.AbrirNovoChamado);

// 2. GET /api/chamados -> Listar chamados do cliente
router.get("/", verificarToken, chamadoController.listarMeusChamados);

// 3. GET /api/chamados/tecnico -> Listar todos os chamados para o TÉCNICO
router.get("/tecnico", verificarToken, chamadoController.listarChamadosTecnico);

// Perfil do técnico
router.get('/tecnicos/perfil', verificarToken, async (req, res) => {
  try {
    const idUsuario = req.usuario.id || req.usuario.id_usuario; 
    const [resultado] = await pool.query(
      'SELECT id_usuario, nome, email, xp, nivel FROM usuario WHERE id_usuario = ?', 
      [idUsuario]
    );

    if (resultado.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(resultado[0]);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar perfil' });
  }
});

router.put('/tecnicos/perfil', verificarToken, async (req, res) => {
  try {
    const idUsuario = req.usuario.id || req.usuario.id_usuario;
    const { nome, email } = req.body;

    const [resultado] = await pool.query(
      'UPDATE usuario SET nome = ?, email = ? WHERE id_usuario = ?',
      [nome, email, idUsuario]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Perfil atualizado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
});

// 5. PATCH /api/chamados/:id/cancelar -> Cancelar chamado
router.patch("/:id/cancelar", verificarToken, chamadoController.cancelarChamadoPorId);

// Rota para o técnico aceitar um chamado
router.patch("/:id/aceitar", verificarToken, chamadoController.aceitarChamado);

// Rota para atualizar o status do chamado (Resolvido / Andamento / etc)
router.patch("/:id/status", verificarToken, chamadoController.atualizarStatusChamado);

// Rotas de Mensagens do Chamado (Chat interno do chamado)
router.get("/:id/mensagens", verificarToken, chamadoController.buscarMensagensChamado);
router.post("/:id/mensagens", verificarToken, chamadoController.enviarMensagemChamado);

// 4. GET /api/chamados/:id -> Buscar detalhes de um chamado
router.get("/:id", verificarToken, chamadoController.buscarChamadoPorId);

// 🛠️ ROTA PUT ATUALIZADA
router.put("/:id", verificarToken, chamadoController.atualizarChamado);

export default router;