import { Router } from "express";
import * as chamadoController from "../controllers/NovoChamadoController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/chamados", verificarToken, chamadoController.AbrirNovoChamado);
router.get("/chamados", verificarToken, chamadoController.listarMeusChamados);

export default router;