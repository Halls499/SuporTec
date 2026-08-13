import * as chamadoModel from "../models/NovoChamadoModels.js";
import { enviarNotificacaoParaUsuario } from "../routes/PushRoutes.js";

export async function AbrirNovoChamado(req, res) {
  const {
    titulo,
    descricao,
    categoria,
    prioridade,
    tipo_atendimento,
    endereco,
    empresa,
    setor,
    sala,
    tipo_contato,
    contato,
  } = req.body;

  const fk_cliente = req.usuario.id_usuario;
  const fk_organizacao = req.usuario.fk_organizacao || 1;

  try {
    if (
      !titulo ||
      !categoria ||
      !prioridade ||
      !tipo_atendimento ||
      !tipo_contato ||
      !contato
    ) {
      return res.status(400).json({
        erro: "Campos obrigatórios não preenchidos.",
      });
    }

    const dadosChamado = {
      fk_organizacao,
      titulo,
      descricao,
      categoria,
      prioridade,
      tipo_atendimento,
      endereco,
      empresa,
      setor,
      sala,
      tipo_contato,
      contato,
      fk_cliente,
    };

    await chamadoModel.abrirChamado(dadosChamado);

    return res.status(201).json({
      mensagem: "Chamado criado com sucesso!",
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({
      erro: "Erro interno ao abrir chamado.",
    });
  }
}

export async function listarMeusChamados(req, res) {
  const fk_cliente = req.usuario.id_usuario;
  const fk_organizacao = req.usuario.fk_organizacao || 1;

  try {
    const listaChamados =
      await chamadoModel.listarChamadosPorClienteEOrganizacao(
        fk_cliente,
        fk_organizacao,
      );

    return res.status(200).json(listaChamados);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({
      erro: "Erro ao buscar chamados.",
    });
  }
}

export async function listarChamadosTecnico(req, res) {
  const fk_organizacao = req.usuario.fk_organizacao || 1;

  try {
    const listaChamados = await chamadoModel.listarChamadosPorOrganizacao(fk_organizacao);
    return res.status(200).json(listaChamados);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({
      erro: "Erro ao buscar chamados do técnico.",
    });
  }
}

export async function buscarChamadoPorId(req, res) {
  try {
    const { id } = req.params;
    const fk_organizacao = req.usuario.fk_organizacao || 1;

    const chamado = await chamadoModel.buscarChamadoPorIdEOrganizacao(
      id,
      fk_organizacao,
    );

    if (!chamado) {
      return res.status(404).json({
        mensagem: "Chamado não encontrado ou sem permissão de acesso.",
      });
    }

    return res.status(200).json(chamado);
  } catch (error) {
    console.error("Erro ao buscar detalhes do chamado:", error);
    return res.status(500).json({
      mensagem: "Erro interno no servidor ao buscar chamado.",
      erro: error.message,
    });
  }
}

// 🛠️ Atualização via PUT e disparo da Notificação Push
export async function atualizarChamado(req, res) {
  try {
    const { id } = req.params;
    const fk_organizacao = req.usuario.fk_organizacao || 1;
    const dadosAtualizacao = req.body;

    const atualizado = await chamadoModel.atualizarChamadoSaaS(id, fk_organizacao, dadosAtualizacao);

    if (!atualizado) {
      return res.status(404).json({ mensagem: "Chamado não encontrado para atualização." });
    }

    const clienteDono = await chamadoModel.buscarClienteDoChamado(id);

    if (clienteDono && clienteDono.fk_cliente) {
      await enviarNotificacaoParaUsuario(
        clienteDono.fk_cliente,
        "SuporTec - Chamado Atualizado",
        "O técnico alterou o status do seu chamado!"
      );
    }

    return res.status(200).json({ mensagem: "Chamado atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar chamado:", error);
    return res.status(500).json({
      mensagem: "Erro interno no servidor ao atualizar chamado.",
      erro: error.message,
    });
  }
}

export async function cancelarChamadoPorId(req, res) {
  try {
    const { id } = req.params;
    const fk_cliente = req.usuario.id_usuario;
    const fk_organizacao = req.usuario.fk_organizacao || 1;

    const canceladoComSucesso = await chamadoModel.cancelarChamadoSaaS(
      id,
      fk_cliente,
      fk_organizacao,
    );

    if (!canceladoComSucesso) {
      return res.status(400).json({
        mensagem: "Não foi possível cancelar o chamado.",
      });
    }

    return res.status(200).json({ mensagem: "Chamado cancelado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cancelar chamado:", error);
    return res.status(500).json({
      mensagem: "Erro interno no servidor ao cancelar chamado.",
      erro: error.message,
    });
  }
}