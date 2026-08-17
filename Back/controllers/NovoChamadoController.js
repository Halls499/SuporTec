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
    const listaChamados =
      await chamadoModel.listarChamadosPorOrganizacao(fk_organizacao);
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

// 🛠️ Atualização direta: o back-end apenas trabalha com o que o front-end mandou no body
export async function atualizarChamado(req, res) {
  try {
    const { id } = req.params;
    const fk_organizacao = req.usuario.fk_organizacao || 1;
    const dadosAtualizacao = req.body; // Contém situacao e fk_tecnico vindos diretamente do front

    // LOG DE VERIFICAÇÃO
    console.log("--- DEBUG ATUALIZAÇÃO ---");
    console.log("Dados recebidos do front:", dadosAtualizacao);
    console.log("-------------------------");
    console.log(`[PUSH TEST] Iniciando atualização do chamado ID: ${id}`);

    const atualizado = await chamadoModel.atualizarChamadoSaaS(
      id,
      fk_organizacao,
      dadosAtualizacao,
    );

    if (!atualizado) {
      console.log(`[PUSH TEST] Chamado ${id} não encontrado.`);
      return res
        .status(404)
        .json({ mensagem: "Chamado não encontrado para atualização." });
    }

    const clienteDono = await chamadoModel.buscarClienteDoChamado(id);
    console.log("[PUSH TEST] Cliente dono encontrado:", clienteDono);

    if (clienteDono && clienteDono.fk_cliente) {
      console.log(
        `[PUSH TEST] Tentando enviar push para o usuário: ${clienteDono.fk_cliente}`,
      );

      await enviarNotificacaoParaUsuario(
        clienteDono.fk_cliente,
        "SuporTec - Chamado Atualizado",
        "O técnico alterou o status do seu chamado!",
      );

      console.log(
        "[PUSH TEST] Comando de envio de push disparado com sucesso!",
      );
    } else {
      console.log(
        "[PUSH TEST] Cliente não encontrado ou ID do usuário inválido para push.",
      );
    }

    return res
      .status(200)
      .json({ mensagem: "Chamado atualizado com sucesso!" });
  } catch (error) {
    console.error("[PUSH TEST] Erro crítico ao atualizar chamado:", error);
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

export async function aceitarChamado(req, res) {
  const { id } = req.params; // ID do chamado vindo da URL
  const id_tecnico = req.usuario.id_usuario || req.usuario.id; // ID do técnico autenticado

  try {
    const [resultado] = await chamadoModel.aceitarChamadoModel(id_tecnico, id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Chamado não encontrado." });
    }

    return res.status(200).json({ mensagem: "Chamado aceito com sucesso!" });
  } catch (error) {
    console.error("Erro ao aceitar chamado:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}
