import { Router } from "express";
import * as chamadoController from "../controllers/NovoChamadoController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = Router();

// 1. POST /api/chamados -> Criar novo chamado
router.post("/", verificarToken, chamadoController.AbrirNovoChamado);

// 2. GET /api/chamados -> Listar chamados do cliente
router.get("/", verificarToken, chamadoController.listarMeusChamados);

// 3. GET /api/chamados/tecnico -> Listar todos os chamados para o TÉCNICO
router.get("/tecnico", verificarToken, chamadoController.listarChamadosTecnico);

// 4. GET /api/chamados/:id -> Buscar detalhes de um chamado
router.get("/:id", verificarToken, chamadoController.buscarChamadoPorId);

// 🛠️ ROTA PUT ATUALIZADA: Compatível com a requisição do front-end
router.put("/:id", verificarToken, chamadoController.atualizarChamado);

// 5. PATCH /api/chamados/:id/cancelar -> Cancelar chamado
router.patch(
  "/:id/cancelar",
  verificarToken,
  chamadoController.cancelarChamadoPorId,
);

// Rota para o técnico aceitar um chamado
router.patch("/:id/aceitar", verificarToken, chamadoController.aceitarChamado);

export default router;
