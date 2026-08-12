import { Router } from "express";
import * as chatController from "../controllers/ChatController.js";

const router = Router();

// POST /chat -> Enviar uma nova mensagem
router.post("/", chatController.NovaMensagem);

// GET /chat/:id_chamado -> Listar todas as mensagens de um chamado
router.get("/:id_chamado", chatController.ListarMensagensPorChamado);

export default router;