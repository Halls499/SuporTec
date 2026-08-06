import { Router } from "express";
import * as usuarioController from "../controllers/UsuariosController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = Router();

// POST /api/usuarios/login -> Fazer login
router.post("/login", usuarioController.loginUsuario);

// POST /api/usuarios -> Cadastrar novo usuário
router.post("/", usuarioController.cadastrarUsuario);

// GET /api/usuarios -> Listar usuários (Protegido por Token)
router.get("/", verificarToken, usuarioController.listarUsuarios);

// GET /api/usuarios/:id -> Buscar usuário por ID (Protegido por Token)
router.get("/:id", verificarToken, usuarioController.buscarUsuarioPorId);

export default router;