import { Router } from "express";
import * as chamadoController from "../controllers/NovoChamadoController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = Router();

// POST /api/chamados -> Criar novo chamado
router.post("/", verificarToken, chamadoController.AbrirNovoChamado);

// GET /api/chamados -> Listar chamados do cliente/empresa
router.get("/", verificarToken, chamadoController.listarMeusChamados);

// GET /api/chamados/:id -> Buscar detalhes de um chamado
router.get("/:id", verificarToken, chamadoController.buscarChamadoPorId);

// PATCH /api/chamados/:id/cancelar -> Cancelar chamado
// (Alterado de DELETE para PATCH/PUT, já que no model mudamos para atualizar o status em vez de apagar do banco)
router.patch(
  "/:id/cancelar",
  verificarToken,
  chamadoController.cancelarChamadoPorId,
);

export default router;
