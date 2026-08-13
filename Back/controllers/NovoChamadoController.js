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

  // 🏢 Pegando id do cliente E o id da organização vindo do token JWT
  const fk_cliente = req.usuario.id_usuario;
  const fk_organizacao = req.usuario.fk_organizacao || 1;

  console.log(
    `👉 CHAMADO DA ORG ${fk_organizacao} CRIADO PELO CLIENTE ${fk_cliente}`,
  );

  try {
    // 1. Validação dos campos obrigatórios
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

    // 2. Montando o objeto que o Model espera receber (incluindo fk_organizacao)
    const dadosChamado = {
      fk_organizacao, // 👈 Crucial para o SaaS!
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

    // 3. Chamando a função do Model
    await chamadoModel.abrirChamado(dadosChamado);

    // 4. Retornando sucesso
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
    // 🏢 Garante que só busca chamados do cliente DENTRO da empresa dele
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

// 👨‍💻 Função para a visão do TÉCNICO
export async function listarChamadosTecnico(req, res) {
  const fk_organizacao = req.usuario.fk_organizacao || 1;

  try {
    // 🏢 Busca TODOS os chamados da empresa (sem filtrar por id_cliente)
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

    // 🏢 Valida o ID do chamado + a Empresa do usuário logado (Isolamento SaaS)
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

// 🛠️ NOVO: Função para o técnico atualizar/responder o chamado e disparar a Notificação Push
export async function atualizarChamado(req, res) {
  try {
    const { id } = req.params;
    const fk_organizacao = req.usuario.fk_organizacao || 1;
    const dadosAtualizacao = req.body;

    // 1. Atualiza o chamado no banco via Model (você já deve ter essa função no seu model)
    const atualizado = await chamadoModel.atualizarChamadoSaaS(id, fk_organizacao, dadosAtualizacao);

    if (!atualizado) {
      return res.status(404).json({ mensagem: "Chamado não encontrado para atualização." });
    }

    // 2. Descobre quem é o cliente dono deste chamado para mandar a notificação para ele
    const clienteDono = await chamadoModel.buscarClienteDoChamado(id);

    if (clienteDono && clienteDono.fk_cliente) {
      // 🚀 Dispara a notificação push para o celular do cliente
      await enviarNotificacaoParaUsuario(
        clienteDono.fk_cliente,
        "SuporTec - Chamado Atualizado",
        "O técnico respondeu ou atualizou o seu chamado!"
      );
    }

    return res.status(200).json({ mensagem: "Chamado atualizado com sucesso e notificação disparada!" });
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

    // 🏢 Cancela validando cliente E empresa
    const canceladoComSucesso = await chamadoModel.cancelarChamadoSaaS(
      id,
      fk_cliente,
      fk_organizacao,
    );

    if (!canceladoComSucesso) {
      return res.status(400).json({
        mensagem:
          "Não foi possível cancelar o chamado. Ele pode não existir, não pertencer a você ou já estar finalizado/cancelado.",
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