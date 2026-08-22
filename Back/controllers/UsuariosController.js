import * as usuarioModel from "../models/UsuariosModels.js";
import bcrypt from "bcrypt";
import UsuarioSeguro from "../utils/UsuarioSeguro.js";
import jwt from "jsonwebtoken";
import * as organizacaoModel from "../models/OrganizacaoModel.js";
import pool from "../config/database.js";

// Função para listar todos os usuários
export async function listarUsuarios(req, res) {
  try {
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

// Função para cadastrar um novo usuário
export async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha, tipo_usuario, organizacao } = req.body;

    if (!nome || !email || !senha || !tipo_usuario) {
      return res.status(400).json({
        erro: "Todos os campos obrigatórios devem ser preenchidos.",
      });
    }

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

    let orgId = null;

    // Se o usuário digitou o nome de uma organização
    if (organizacao && organizacao.trim() !== "") {
      // 1. Verifica se a organização já existe no banco pelo nome
      let orgCadastrada = await organizacaoModel.buscarOrganizacaoPorNome(
        organizacao.trim(),
      );

      if (!orgCadastrada || orgCadastrada.length === 0) {
        // 2. Se não existir, cria a organização automaticamente e obtém o ID gerado
        const novaOrg = await organizacaoModel.criarOrganizacao(
          organizacao.trim(),
        );
        orgId = novaOrg.insertId || novaOrg.id_organizacao; // Ajuste conforme o retorno do seu banco/model
      } else {
        orgId = orgCadastrada[0].id_organizacao;
      }
    }

    // Cria o usuário vinculando o ID da organização (ou null)
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

// Função para buscar um usuário por ID
export async function buscarUsuarioPorId(req, res) {
  try {
    const { id } = req.params;

    const usuario = await usuarioModel.buscarUsuarioPorId(id);

    if (!usuario || usuario.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado.",
      });
    }

    // Retorna apenas os dados seguros do usuário, sem a senha
    const usuarioPublico = UsuarioSeguro(usuario[0]);

    return res.status(200).json(usuarioPublico);
  } catch (erro) {
    console.error("Erro ao buscar usuário por ID:", erro);
    return res.status(500).json({
      erro: "Erro ao buscar usuário.",
    });
  }
}

// Função para login do usuário
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

    // Pega o primeiro usuário encontrado (deve ser único)
    const usuario = usuarioEncontrado[0];

    // Verifica a senha fornecida com a senha armazenada no banco
    const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

    if (!senhaVerificada) {
      return res.status(401).json({
        erro: "Credenciais inválidas.",
      });
    }

    // Remove a senha do objeto antes de enviar a resposta
    const usuarioPublico = UsuarioSeguro(usuario);

    // Gera o token JWT com os dados do usuário
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        tipo_usuario: usuario.tipo_usuario,
        fk_organizacao: usuario.fk_organizacao,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d", // Token válido por 30 dias
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

// Função para atualizar o perfil do usuário
export async function atualizarPerfil(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, foto } = req.body;

    // Busca o usuário atual antes para pegar o email original, caso o novo venha vazio
    const [usuarioExistente] = await pool.query(
      "SELECT email FROM usuario WHERE id_usuario = ?",
      [id],
    );
    const emailFinal = email || usuarioExistente[0].email;

    const [resultado] = await pool.query(
      "UPDATE usuario SET nome = ?, email = ?, foto = ? WHERE id_usuario = ?",
      [nome, emailFinal, foto, id],
    );

    return res.status(200).json({ mensagem: "Perfil atualizado!" });
  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro);
    return res.status(500).json({ erro: "Erro ao atualizar perfil." });
  }
}
