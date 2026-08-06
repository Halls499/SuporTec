// Exemplo no arquivo de rotas (routes/chamados.js)
import { Router } from "express";
import {
  listarMeusChamados,
  listarChamadosTecnico, // 👈 Importe a nova função do controller
} from "../controllers/chamadoController.js";
import { autenticarToken } from "../middlewares/authMiddleware.js"; // seu middleware de auth

const router = Router();

// Rota do Cliente
router.get("/", autenticarToken, listarMeusChamados);

// 👨‍💻 Rota do Técnico (adicione esta linha)
router.get("/tecnico", autenticarToken, listarChamadosTecnico);

export default router;
