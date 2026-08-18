import * as usuarioModel from "../models/UsuariosModels.js";
import bcrypt from "bcrypt";
import UsuarioSeguro from "../utils/UsuarioSeguro.js";
import jwt from "jsonwebtoken";

export async function listarUsuarios(req, res) {
  try {
    // Busca a organização priorizando o token do usuário logado, com fallback para o body/query
    let organizacao =
      req.usuario?.fk_organizacao ||
      req.body?.fk_organizacao ||
      req.query?.fk_organizacao;

    if (organizacao === 1 || !organizacao) {
      organizacao = null;
    }

    const lista = organizacao
      ? await usuarioModel.listarUsuariosPorOrganizacao(organizacao)
      : await usuarioModel.listarUsuarios();

    const listaSegura = Array.isArray(lista)
      ? lista.map((usuario) => UsuarioSeguro(usuario))
      : [];

    return res.status(200).json(listaSegura);
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro);
    return res.status(500).json({
      erro: "Erro ao buscar usuários.",
    });
  }
}

export async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha, tipo_usuario, fk_organizacao } = req.body;

    if (!nome || !email || !senha || !tipo_usuario) {
      return res.status(400).json({
        erro: "Todos os campos obrigatórios devem ser preenchidos.",
      });
    }

    // Validação dos papéis permitidos no SaaS
    const tiposPermitidos = ["cliente", "tecnico", "admin_empresa"];
    if (!tiposPermitidos.includes(tipo_usuario)) {
      return res.status(400).json({
        erro: "Tipo de usuário inválido.",
      });
    }

    const emailExistente = await usuarioModel.verificarEmailExistente(email);

    if (Array.isArray(emailExistente) && emailExistente.length > 0) {
      return res.status(409).json({
        erro: "Email já cadastrado.",
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    // Define a organização (usa a enviada ou null como padrão)
    const orgId = fk_organizacao || null;

    await usuarioModel.criarUsuario(nome, email, hash, tipo_usuario, orgId);

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro no cadastro:", erro);
    return res.status(500).json({
      erro: "Erro ao cadastrar usuário.",
    });
  }
}

export async function buscarUsuarioPorId(req, res) {
  try {
    const { id } = req.params;

    const usuario = await usuarioModel.buscarUsuarioPorId(id);

    if (!usuario || usuario.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado.",
      });
    }

    const usuarioPublico = UsuarioSeguro(usuario[0]);

    return res.status(200).json(usuarioPublico);
  } catch (erro) {
    console.error("Erro ao buscar usuário por ID:", erro);
    return res.status(500).json({
      erro: "Erro ao buscar usuário.",
    });
  }
}

export async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: "E-mail e senha são obrigatórios para o login.",
      });
    }

    const usuarioEncontrado = await usuarioModel.buscarUsuarioPorEmail(email);

    if (!usuarioEncontrado || usuarioEncontrado.length === 0) {
      return res.status(401).json({
        erro: "Credenciais inválidas.",
      });
    }

    const usuario = usuarioEncontrado[0];

    const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

    if (!senhaVerificada) {
      return res.status(401).json({
        erro: "Credenciais inválidas.",
      });
    }

    const usuarioPublico = UsuarioSeguro(usuario);

    // 🔑 O SEGREDO DO SAAS: Incluir fk_organizacao no payload do JWT
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        tipo_usuario: usuario.tipo_usuario,
        fk_organizacao: usuario.fk_organizacao, // <- Crucial para o SaaS!
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: usuarioPublico,
      token,
    });
  } catch (erro) {
    console.error("Erro no login:", erro);
    return res.status(500).json({
      erro: "Erro interno do servidor.",
    });
  }
}
