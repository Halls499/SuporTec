import { Router } from "express";
import * as usuarioController from "../controllers/UsuariosController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = Router();

// GET /api/usuarios (protegido)
router.get("/", verificarToken, usuarioController.listarUsuarios);

// GET /api/usuarios/:id
router.get("/:id", usuarioController.buscarUsuarioPorId);

// POST /api/usuarios/cadastrar
router.post("/cadastrar", usuarioController.cadastrarUsuario);

// POST /api/usuarios/login
router.post("/login", usuarioController.loginUsuario);

export default router;
