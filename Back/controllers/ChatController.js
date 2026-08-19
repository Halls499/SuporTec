import * as mensagemModel from "../models/ChatModels.js";

export async function NovaMensagem(req, res) {
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
        .json({ error: "Dados incompletos ou mensagem vazia para enviar." });
    }

    // Passa o fk_usuario e o fk_remetente juntos para evitar o erro do banco
    const novaMensagem = await mensagemModel.create({
      mensagem: String(textoMensagem).trim(),
      fk_usuario: Number(idUsuarioFinal),
      fk_remetente: Number(idUsuarioFinal),
      fk_chamado: Number(fk_chamado),
    });

    return res.status(201).json(novaMensagem);
  } catch (error) {
    console.error("Erro ao criar nova mensagem:", error);
    return res
      .status(500)
      .json({ error: "Erro ao criar nova mensagem", detalhes: error.message });
  }
}

export async function ListarMensagensPorChamado(req, res) {
  try {
    const id_chamado = req.params.id_chamado;

    if (!id_chamado) {
      return res.status(400).json({ error: "ID do chamado não informado." });
    }

    const mensagens = await mensagemModel.findByChamado(id_chamado);

    return res.status(200).json(Array.isArray(mensagens) ? mensagens : []);
  } catch (error) {
    console.error("Erro ao listar mensagens:", error);
    return res.status(500).json({
      error: "Não foi possível encontrar as mensagens desta conversa",
    });
  }
}
