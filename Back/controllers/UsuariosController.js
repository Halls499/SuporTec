import * as usuarioModel from "../models/UsuariosModels.js";
import bcrypt from "bcrypt";
import UsuarioSeguro from "../utils/UsuarioSeguro.js";
import jwt from "jsonwebtoken";

export async function listarUsuarios(req, res) {
  try {
    const lista = await usuarioModel.listarUsuarios();

    const listaSegura = lista.map((usuario) => UsuarioSeguro(usuario));

    return res.status(200).json(listaSegura);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao buscar usuários.",
    });
  }
}

export async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha, tipo_usuario } = req.body;

    if (!nome || !email || !senha || !tipo_usuario) {
      return res.status(400).json({
        erro: "Todos os campos são obrigatórios.",
      });
    }

    const emailExistente = await usuarioModel.verificarEmailExistente(email);

    if (emailExistente.length > 0) {
      return res.status(409).json({
        erro: "Email já cadastrado.",
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    await usuarioModel.criarUsuario(nome, email, hash, tipo_usuario);

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao cadastrar usuário.",
    });
  }
}

export async function buscarUsuarioPorId(req, res) {
  try {
    const { id } = req.params;

    const usuario = await usuarioModel.buscarUsuarioPorId(id);

    if (usuario.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado.",
      });
    }

    const usuarioPublico = UsuarioSeguro(usuario[0]);

    return res.status(200).json(usuarioPublico);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao buscar usuário.",
    });
  }
}

export async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    console.log("Email recebido:", email);

    const usuarioEncontrado = await usuarioModel.buscarUsuarioPorEmail(email);

    console.log("Resultado da busca:", usuarioEncontrado);

    if (usuarioEncontrado.length === 0) {
      return res.status(401).json({
        erro: "Credenciais inválidas.",
      });
    }

    const senhaVerificada = await bcrypt.compare(
      senha,
      usuarioEncontrado[0].senha
    );

    if (!senhaVerificada) {
      return res.status(401).json({
        erro: "Credenciais inválidas.",
      });
    }

    const usuarioPublico = UsuarioSeguro(usuarioEncontrado[0]);

    const token = jwt.sign(
      {
        id_usuario: usuarioEncontrado[0].id_usuario,
        tipo_usuario: usuarioEncontrado[0].tipo_usuario,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: usuarioPublico,
      token,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro interno do servidor.",
    });
  }
}