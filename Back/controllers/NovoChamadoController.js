import * as chamadoModel from "../models/NovoChamadoModels.js";
import { enviarNotificacaoParaUsuario } from "../utils/emailService.js";
import pool from "../config/database.js";

// Função para abrir um novo chamado
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

  const fk_cliente = req.usuario?.id_usuario;
  const fk_organizacao = req.usuario?.fk_organizacao
    ? Number(req.usuario.fk_organizacao)
    : null;

  try {
    if (
      !titulo ||
      !categoria ||
      !prioridade ||
      !tipo_atendimento ||
      !tipo_contato ||
      !contato ||
      !fk_cliente
    ) {
      return res.status(400).json({
        erro: "Campos obrigatórios não preenchidos ou usuário não autenticado.",
      });
    }

    const dadosChamado = {
      fk_organizacao,
      titulo,
      descricao: descricao || "",
      categoria,
      prioridade,
      tipo_atendimento,
      endereco: endereco || null,
      empresa: empresa || null,
      setor: setor || null,
      sala: sala || null,
      tipo_contato,
      contato,
      fk_cliente,
    };

    await chamadoModel.abrirChamado(dadosChamado);

    // Buscar e-mail do cliente para notificação de abertura
    try {
      const [usuarioResult] = await pool.query(
        "SELECT email FROM usuario WHERE id_usuario = ?",
        [fk_cliente],
      );
      if (usuarioResult.length > 0 && usuarioResult[0].email) {
        // Enviar e-mail de notificação para o cliente
        await enviarNotificacaoParaUsuario(
          usuarioResult[0].email,
          "SuporTec - Chamado Aberto",
          `Olá! Seu chamado "${titulo}" foi aberto com sucesso no sistema.`,
        );
      }
    } catch (emailErr) {
      console.error("Erro ao enviar e-mail de abertura:", emailErr);
    }

    return res.status(201).json({
      mensagem: "Chamado criado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao abrir chamado:", erro);
    return res.status(500).json({
      erro: "Erro interno ao abrir chamado.",
    });
  }
}

// Função para listar chamados do cliente
export async function listarMeusChamados(req, res) {
  const fk_cliente = req.usuario?.id_usuario;
  const fk_organizacao = req.usuario?.fk_organizacao
    ? Number(req.usuario.fk_organizacao)
    : null;

  try {
    const listaChamados =
      await chamadoModel.listarChamadosPorClienteEOrganizacao(
        fk_cliente,
        fk_organizacao,
      );

    return res
      .status(200)
      .json(Array.isArray(listaChamados) ? listaChamados : []);
  } catch (erro) {
    console.error("Erro ao listar chamados:", erro);
    return res.status(500).json({
      erro: "Erro ao buscar chamados.",
    });
  }
}

// Função para buscar detalhes de um chamado específico do cliente
export async function buscarChamadoPorIdCliente(req, res) {
  const { id } = req.params;
  const fk_cliente = req.usuario?.id_usuario;
  const fk_organizacao = req.usuario?.fk_organizacao
    ? Number(req.usuario.fk_organizacao)
    : null;

  try {
    const chamado = await chamadoModel.buscarChamadoPorIdClienteEOrganizacao(
      id,
      fk_cliente,
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

// Função para cancelar um chamado específico do cliente
export async function cancelarChamadoPorIdCliente(req, res) {
  const { id } = req.params;
  const fk_cliente = req.usuario?.id_usuario;
  const fk_organizacao = req.usuario?.fk_organizacao
    ? Number(req.usuario.fk_organizacao)
    : null;

  try {
    const canceladoComSucesso =
      await chamadoModel.cancelarChamadoPorIdClienteEOrganizacao(
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

// Função para listar chamados da organização para o técnico
export async function listarChamadosTecnico(req, res) {
  try {
    const listaChamados = await chamadoModel.listarChamadosPorOrganizacao();
    return res.status(200).json(listaChamados);
  } catch (erro) {
    console.error("ERRO CRÍTICO NO CONTROLLER:", erro);
    return res.status(500).json({ erro: "Erro ao buscar chamados." });
  }
}

// Função para buscar detalhes de um chamado específico do técnico
export async function buscarChamadoPorId(req, res) {
  try {
    const { id } = req.params;
    const chamado = await chamadoModel.buscarChamadoPorIdTecnico(id);

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

// Função para atualizar um chamado específico do técnico
export async function atualizarChamado(req, res) {
  try {
    const { id } = req.params;
    const fk_organizacao = req.usuario?.fk_organizacao
      ? Number(req.usuario.fk_organizacao)
      : null;
    const dadosAtualizacao = req.body;

    const atualizado = await chamadoModel.atualizarChamadoSaaS(
      id,
      fk_organizacao,
      dadosAtualizacao,
    );

    if (!atualizado) {
      return res
        .status(404)
        .json({ mensagem: "Chamado não encontrado para atualização." });
    }

    // Buscar cliente dono do chamado e enviar e-mail
    const clienteDono = await chamadoModel.buscarClienteDoChamado(id);
    if (clienteDono && clienteDono.fk_cliente) {
      const [usuarioResult] = await pool.query(
        "SELECT email FROM usuario WHERE id_usuario = ?",
        [clienteDono.fk_cliente],
      );
      if (usuarioResult.length > 0 && usuarioResult[0].email) {
        // Enviar e-mail de notificação para o cliente sobre a atualização do chamado
        await enviarNotificacaoParaUsuario(
          usuarioResult[0].email,
          "SuporTec - Chamado Atualizado",
          `O status do seu chamado #${id} foi alterado para: ${dadosAtualizacao.situacao || "Atualizado"}.`,
        );
      }
    }

    return res
      .status(200)
      .json({ mensagem: "Chamado atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro crítico ao atualizar chamado:", error);
    return res.status(500).json({
      mensagem: "Erro interno no servidor ao atualizar chamado.",
      erro: error.message,
    });
  }
}

// Função para cancelar um chamado específico do técnico
export async function cancelarChamadoPorId(req, res) {
  try {
    const { id } = req.params;
    const fk_cliente = req.usuario?.id_usuario;
    const fk_organizacao = req.usuario?.fk_organizacao
      ? Number(req.usuario.fk_organizacao)
      : null;

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

// Função para aceitar um chamado específico do técnico
export async function aceitarChamado(req, res) {
  const { id } = req.params;
  const id_tecnico = req.usuario?.id_usuario || req.usuario?.id;

  try {
    const resultado = await chamadoModel.aceitarChamadoModel(id_tecnico, id);
    const affectedRows = resultado[0]?.affectedRows || resultado?.affectedRows;

    if (!affectedRows || affectedRows === 0) {
      return res.status(404).json({ erro: "Chamado não encontrado." });
    }

    return res.status(200).json({ mensagem: "Chamado aceito com sucesso!" });
  } catch (error) {
    console.error("ERRO DETALHADO AO ACEITAR CHAMADO:", error);
    return res
      .status(500)
      .json({ erro: "Erro interno no servidor.", detalhes: error.message });
  }
}

// Função para atualizar o status de um chamado específico do técnico
export async function atualizarStatusChamado(req, res) {
  const { id } = req.params;
  const { situacao } = req.body;

  try {
    const [chamados] = await pool.query(
      "SELECT * FROM chamado WHERE id_chamado = ?",
      [id],
    );
    if (chamados.length === 0) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    const chamado = chamados[0];
    const tecnicoId = chamado.fk_tecnico;

    await pool.query("UPDATE chamado SET situacao = ? WHERE id_chamado = ?", [
      situacao,
      id,
    ]);

    if (situacao === "Resolvido" && tecnicoId) {
      try {
        let xpGanho = 50;
        if (chamado.prioridade === "Media") xpGanho = 80;
        if (chamado.prioridade === "Alta") xpGanho = 120;

        const [usuarios] = await pool.query(
          "SELECT xp, nivel FROM usuario WHERE id_usuario = ?",
          [tecnicoId],
        );

        if (usuarios.length > 0) {
          let novoXp = (usuarios[0].xp || 0) + xpGanho;
          let nivelAtual = usuarios[0].nivel || 1;
          let xpProximoNivel = nivelAtual * 100;
          let novoNivel = nivelAtual;

          if (novoXp >= xpProximoNivel) {
            novoNivel += 1;
          }

          await pool.query(
            "UPDATE usuario SET xp = ?, nivel = ? WHERE id_usuario = ?",
            [novoXp, novoNivel, tecnicoId],
          );
        }
        // Checar regras de conquistas após atualizar o status do chamado
        await checarRegrasDeConquistas(tecnicoId, id);
      } catch (xpError) {
        console.warn(
          "Aviso: Sistema de XP/Conquistas ignorado devido a erro.",
          xpError,
        );
      }
    }

    return res.json({ mensagem: "Status atualizado com sucesso!" });
  } catch (erro) {
    console.error("Erro ao atualizar status:", erro);
    return res
      .status(500)
      .json({ erro: "Erro interno no servidor", detalhes: erro.message });
  }
}

// Função para listar chamados por técnico
export async function listarChamadosPorTecnico(req, res) {
  const id_tecnico = req.usuario?.id_usuario || req.usuario?.id;
  try {
    const [chamados] = await pool.query(
      "SELECT * FROM chamado WHERE fk_tecnico = ?",
      [id_tecnico],
    );
    return res.status(200).json(chamados);
  } catch (error) {
    console.error("Erro ao listar chamados:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
}

// Função para buscar as mensagens de um chamado específico
export async function buscarMensagensChamado(req, res) {
  const { id } = req.params;
  try {
    const [mensagens] = await pool.query(
      "SELECT * FROM mensagem WHERE fk_chamado = ? ORDER BY data_envio ASC",
      [id],
    );
    return res.status(200).json(Array.isArray(mensagens) ? mensagens : []);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return res.status(500).json({ erro: "Erro ao buscar mensagens do chat." });
  }
}

// Função para enviar uma mensagem em um chamado específico
export async function enviarMensagemChamado(req, res) {
  const { id } = req.params;
  const { mensagem, texto, conteudo } = req.body;
  const textoMensagem = mensagem || texto || conteudo;
  const id_usuario = req.usuario?.id_usuario || req.usuario?.id;

  try {
    if (!textoMensagem || !String(textoMensagem).trim()) {
      return res.status(400).json({ erro: "A mensagem não pode estar vazia." });
    }

    if (!id_usuario) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    await pool.query(
      `INSERT INTO mensagem (fk_chamado, fk_usuario, fk_remetente, mensagem, data_envio) 
       VALUES (?, ?, ?, ?, NOW())`,
      [
        Number(id),
        Number(id_usuario),
        Number(id_usuario),
        String(textoMensagem).trim(),
      ],
    );

    return res.status(201).json({ mensagem: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return res.status(500).json({ erro: "Erro ao salvar mensagem no banco." });
  }
}

// Função para checar regras de conquistas após a resolução de um chamado
async function checarRegrasDeConquistas(idTecnico, idChamado) {
  try {
    const [totalChamadosResolvidos] = await pool.query(
      "SELECT COUNT(*) as total FROM chamado WHERE fk_tecnico = ? AND situacao = 'Resolvido'",
      [idTecnico],
    );

    if (totalChamadosResolvidos[0]?.total === 1) {
      await desbloquearConquista(idTecnico, 1);
    }
  } catch (erro) {
    console.error("Erro na verificação de regras de conquista: ", erro);
  }
}

// Função para desbloquear uma conquista para o técnico
async function desbloquearConquista(idTecnico, idConquista) {
  try {
    const [jaTem] = await pool.query(
      "SELECT * FROM usuario_conquista WHERE fk_usuario = ? AND fk_conquista = ?",
      [idTecnico, idConquista],
    );

    if (jaTem.length === 0) {
      await pool.query(
        "INSERT INTO usuario_conquista (fk_usuario, fk_conquista) VALUES (?, ?)",
        [idTecnico, idConquista],
      );
    }
  } catch (erro) {
    console.error("Erro ao inserir desbloqueio de conquista: ", erro);
  }
}
