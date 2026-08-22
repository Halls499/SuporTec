import * as mensagemModel from "../models/ChatModels.js";

// Função para criar uma nova mensagem
export async function novaMensagem(req, res) {
  const { mensagem, texto, conteudo, fk_usuario, fk_chamado } = req.body;
  const textoMensagem = mensagem || texto || conteudo;
  const idUsuarioFinal =
    fk_usuario || req.usuario?.id_usuario || req.usuario?.id;

  try {
    if (
      !textoMensagem ||
      !String(textoMensagem).trim() ||
      !idUsuarioFinal ||
      !fk_chamado
    ) {
      return res
        .status(400)
        .json({ erro: "Dados incompletos ou mensagem vazia para enviar." });
    }

    // Passa o fk_usuario e o fk_remetente juntos para evitar o erro do banco
    const novaMensagemCriada = await mensagemModel.create({
      mensagem: String(textoMensagem).trim(),
      fk_usuario: Number(idUsuarioFinal),
      fk_remetente: Number(idUsuarioFinal),
      fk_chamado: Number(fk_chamado),
    });

    return res.status(201).json(novaMensagemCriada);
  } catch (error) {
    console.error("Erro ao criar nova mensagem:", error);
    return res
      .status(500)
      .json({ erro: "Erro ao criar nova mensagem", detalhes: error.message });
  }
}

// Função para listar mensagens por chamado
export async function listarMensagensPorChamado(req, res) {
  try {
    const id_chamado = req.params.id_chamado;

    if (!id_chamado) {
      return res.status(400).json({ erro: "ID do chamado não informado." });
    }

    const mensagens = await mensagemModel.findByChamado(id_chamado);

    return res.status(200).json(Array.isArray(mensagens) ? mensagens : []);
  } catch (error) {
    console.error("Erro ao listar mensagens:", error);
    return res.status(500).json({
      erro: "Não foi possível encontrar as mensagens desta conversa",
    });
  }
}
