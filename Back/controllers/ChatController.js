
import * as mensagemModel from "../models/ChatModels.js";

export async function NovaMensagem(req, res) {
  const { mensagem, fk_usuario, fk_chamado } = req.body;

  try {
    if (!mensagem || !fk_usuario || !fk_chamado) {
      return res.status(400).json({ error: "Dados incompletos para enviar a mensagem." });
    }

    const novaMensagem = await mensagemModel.create({
      mensagem,
      fk_usuario,
      fk_chamado
    });

    res.status(201).json(novaMensagem);
  } catch (error) {
    console.error("Erro ao criar nova mensagem:", error);
    res.status(500).json({ error: "Erro ao criar nova mensagem" });
  }
}

export async function ListarMensagensPorChamado(req, res) {
  try {
    const id_chamado = req.params.id_chamado;
    const mensagens = await mensagemModel.findByChamado(id_chamado);

    res.status(200).json(Array.isArray(mensagens) ? mensagens : []);
  } catch (error) {
    console.error("Erro ao listar mensagens:", error);
    res.status(500).json({ error: "Não foi possível encontrar as mensagens desta conversa" });
  }
}