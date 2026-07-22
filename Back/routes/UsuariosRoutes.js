import { Router } from "express";
import * as usuarioController from "../controllers/UsuariosController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/usuarios", verificarToken, usuarioController.listarUsuarios);
router.get("/usuarios/:id", usuarioController.buscarUsuarioPorId);
router.post("/usuarios", usuarioController.cadastrarUsuario);
router.post("/login", usuarioController.loginUsuario);

export default router;