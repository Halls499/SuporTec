import * as mensagemModel from "../models/ChatModels.js";

export async function NovaMensagem(req, res) {
  const { mensagem, fk_usuario, fk_chamado } = req.body;

  try {
    // Validação robusta: verifica se os campos existem e se a mensagem não é apenas espaços vazios
    if (!mensagem || !String(mensagem).trim() || !fk_usuario || !fk_chamado) {
      return res
        .status(400)
        .json({ error: "Dados incompletos ou mensagem vazia para enviar." });
    }

    const novaMensagem = await mensagemModel.create({
      mensagem: String(mensagem).trim(), // Remove espaços extras nas pontas
      fk_usuario,
      fk_chamado,
    });

    return res.status(201).json(novaMensagem);
  } catch (error) {
    console.error("Erro ao criar nova mensagem:", error);
    return res.status(500).json({ error: "Erro ao criar nova mensagem" });
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
    return res
      .status(500)
      .json({
        error: "Não foi possível encontrar as mensagens desta conversa",
      });
  }
}
