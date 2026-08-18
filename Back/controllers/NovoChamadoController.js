import * as chamadoModel from "../models/NovoChamadoModels.js";
import { enviarNotificacaoParaUsuario } from "../routes/PushRoutes.js";
import pool from "../config/database.js";

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

export async function listarMeusChamados(req, res) {
  const fk_cliente = req.usuario?.id_usuario;

  // Tratamento blindado para usar null se o usuário não tiver organização
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

export async function listarChamadosTecnico(req, res) {
  const fk_organizacao = req.usuario?.fk_organizacao || 1;

  try {
    const listaChamados =
      await chamadoModel.listarChamadosPorOrganizacao(fk_organizacao);
    return res
      .status(200)
      .json(Array.isArray(listaChamados) ? listaChamados : []);
  } catch (erro) {
    console.error("Erro ao listar chamados do técnico:", erro);
    return res.status(500).json({
      erro: "Erro ao buscar chamados do técnico.",
    });
  }
}

export async function buscarChamadoPorId(req, res) {
  try {
    const { id } = req.params;
    const fk_organizacao = req.usuario?.fk_organizacao || 1;

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

export async function atualizarChamado(req, res) {
  try {
    const { id } = req.params;
    const fk_organizacao = req.usuario?.fk_organizacao || 1;
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

    const clienteDono = await chamadoModel.buscarClienteDoChamado(id);

    if (clienteDono && clienteDono.fk_cliente) {
      await enviarNotificacaoParaUsuario(
        clienteDono.fk_cliente,
        "SuporTec - Chamado Atualizado",
        "O técnico alterou o status do seu chamado!",
      );
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

export async function cancelarChamadoPorId(req, res) {
  try {
    const { id } = req.params;
    const fk_cliente = req.usuario?.id_usuario;
    const fk_organizacao = req.usuario?.fk_organizacao || 1;

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

    // Atualiza apenas o status do chamado primeiro
    await pool.query("UPDATE chamado SET situacao = ? WHERE id_chamado = ?", [
      situacao,
      id,
    ]);

    // Bloco de XP seguro e Verificação de Conquistas
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

// ==========================================
// FUNÇÕES DO CHAT
// ==========================================

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

export async function enviarMensagemChamado(req, res) {
  const { id } = req.params;
  const { mensagem } = req.body;
  const id_remetente = req.usuario?.id_usuario || req.usuario?.id;

  try {
    if (!mensagem || !String(mensagem).trim()) {
      return res.status(400).json({ erro: "A mensagem não pode estar vazia." });
    }

    await pool.query(
      "INSERT INTO mensagem (fk_chamado, fk_remetente, texto, data_envio) VALUES (?, ?, ?, NOW())",
      [id, id_remetente, String(mensagem).trim()],
    );

    return res.status(201).json({ mensagem: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return res.status(500).json({ erro: "Erro ao enviar mensagem no chat." });
  }
}

// ==========================================
// FUNÇÕES AUXILIARES DE CONQUISTAS
// ==========================================

async function checarRegrasDeConquistas(idTecnico, idChamado) {
  try {
    const [totalChamadosResolvidos] = await pool.query(
      "SELECT COUNT(*) as total FROM chamado WHERE fk_tecnico = ? AND situacao = 'Resolvido'",
      [idTecnico],
    );

    if (totalChamadosResolvidos[0]?.total === 1) {
      await desbloquearConquista(idTecnico, 1);
    }

    const [chamadosAgeis] = await pool.query(
      `SELECT COUNT(*) as total FROM chamado 
       WHERE fk_tecnico = ? AND situacao = 'Resolvido' 
       AND TIMESTAMPDIFF(HOUR, data_abertura, data_fechamento) < 5`,
      [idTecnico],
    );

    if (chamadosAgeis[0]?.total >= 10) {
      await desbloquearConquista(idTecnico, 2);
    }

    const [chamadosSemanais] = await pool.query(
      `SELECT COUNT(*) as total FROM chamado 
       WHERE fk_tecnico = ? AND situacao = 'Resolvido' 
       AND data_fechamento >= DATE_SUB(NOW(), INTERVAL 1 WEEK)`,
      [idTecnico],
    );

    if (chamadosSemanais[0]?.total >= 10) {
      await desbloquearConquista(idTecnico, 3);
    }

    if (totalChamadosResolvidos[0]?.total >= 100) {
      await desbloquearConquista(idTecnico, 4);
    }

    const [chamadoRapidoAlta] = await pool.query(
      `SELECT id_chamado FROM chamado 
       WHERE id_chamado = ? AND fk_tecnico = ?  
       AND TIMESTAMPDIFF(MINUTE, data_abertura, data_fechamento) <= 60`,
      [idChamado, idTecnico],
    );

    if (chamadoRapidoAlta.length > 0) {
      await desbloquearConquista(idTecnico, 5);
    }

    const [chamadosConsecutivos] = await pool.query(
      `SELECT COUNT(DISTINCT DATE(data_fechamento)) as dias_consecutivos 
       FROM chamado
       WHERE fk_tecnico = ? AND situacao = 'Resolvido'
       AND data_fechamento >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      [idTecnico],
    );

    if (chamadosConsecutivos[0]?.dias_consecutivos >= 7) {
      await desbloquearConquista(idTecnico, 6);
    }

    const [chamadosForaHorario] = await pool.query(
      `SELECT id_chamado FROM chamado 
       WHERE fk_tecnico = ? AND situacao = 'Resolvido'
       AND (HOUR(data_fechamento) < 8 OR HOUR(data_fechamento) >= 18 OR DAYOFWEEK(data_fechamento) IN (1, 7))`,
      [idTecnico],
    );

    if (chamadosForaHorario.length > 0) {
      await desbloquearConquista(idTecnico, 7);
    }

    const [chamadosAltaPrioridade] = await pool.query(
      `SELECT id_chamado FROM chamado
       WHERE fk_tecnico = ? AND situacao = 'Resolvido' AND prioridade = 'Alta'
       AND TIMESTAMPDIFF(MINUTE, data_abertura, data_fechamento) <= 15`,
      [idTecnico],
    );

    if (chamadosAltaPrioridade.length > 0) {
      await desbloquearConquista(idTecnico, 8);
    }

    const [chamadosPorCategoria] = await pool.query(
      `SELECT categoria, COUNT(*) as total FROM chamado
       WHERE fk_tecnico = ? AND situacao = 'Resolvido'
       GROUP BY categoria`,
      [idTecnico],
    );

    if (chamadosPorCategoria.length > 0) {
      for (const cat of chamadosPorCategoria) {
        if (cat.total >= 50) {
          switch (cat.categoria) {
            case "Hardware":
              await desbloquearConquista(idTecnico, 9);
              break;
            case "Software":
              await desbloquearConquista(idTecnico, 10);
              break;
            case "Redes":
              await desbloquearConquista(idTecnico, 11);
              break;
            case "Impressoras":
              await desbloquearConquista(idTecnico, 12);
              break;
          }
        }
      }
    }

    const [chamadosSemana] = await pool.query(
      `SELECT COUNT(DISTINCT categoria) as categorias_distintas
       FROM chamado
       WHERE fk_tecnico = ? AND situacao = 'Resolvido'
       AND data_fechamento >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
       GROUP BY YEARWEEK(data_fechamento)`,
      [idTecnico],
    );

    if (chamadosSemana.some((semana) => semana.categorias_distintas >= 3)) {
      await desbloquearConquista(idTecnico, 13);
    }

    const [chamadosPrioridades] = await pool.query(
      `SELECT DISTINCT prioridade FROM chamado
       WHERE fk_tecnico = ? AND situacao = 'Resolvido'`,
      [idTecnico],
    );

    const prioridades = chamadosPrioridades.map((c) => c.prioridade);
    if (
      prioridades.includes("Baixa") &&
      prioridades.includes("Media") &&
      prioridades.includes("Alta")
    ) {
      await desbloquearConquista(idTecnico, 14);
    }

    const [chamadosMesmoDia] = await pool.query(
      `SELECT DATE(data_fechamento) as dia, categoria
       FROM chamado
       WHERE fk_tecnico = ? AND situacao = 'Resolvido'
       GROUP BY DATE(data_fechamento), categoria`,
      [idTecnico],
    );

    const diasCategorias = {};
    for (const chamado of chamadosMesmoDia) {
      if (!diasCategorias[chamado.dia]) diasCategorias[chamado.dia] = new Set();
      diasCategorias[chamado.dia].add(chamado.categoria);
    }

    if (
      Object.values(diasCategorias).some(
        (set) => set.has("Hardware") && set.has("Software"),
      )
    ) {
      await desbloquearConquista(idTecnico, 15);
    }

    const [chamadosTipoMesmoDia] = await pool.query(
      `SELECT DATE(data_fechamento) as dia, tipo_atendimento
       FROM chamado
       WHERE fk_tecnico = ? AND situacao = 'Resolvido'
       GROUP BY DATE(data_fechamento), tipo_atendimento`,
      [idTecnico],
    );

    const diasTipos = {};
    for (const chamado of chamadosTipoMesmoDia) {
      if (!diasTipos[chamado.dia]) diasTipos[chamado.dia] = new Set();
      diasTipos[chamado.dia].add(chamado.tipo_atendimento);
    }

    if (
      Object.values(diasTipos).some(
        (set) => set.has("Presencial") && set.has("Remoto"),
      )
    ) {
      await desbloquearConquista(idTecnico, 16);
    }

    const [usuario] = await pool.query(
      "SELECT nivel FROM usuario WHERE id_usuario = ?",
      [idTecnico],
    );

    if (usuario.length > 0 && usuario[0].nivel >= 5) {
      await desbloquearConquista(idTecnico, 17);
    }

    const [chamadosSeguidos] = await pool.query(
      `SELECT COUNT(*) as total FROM chamado
       WHERE fk_tecnico = ? AND situacao = 'Resolvido'
       GROUP BY categoria
       HAVING total >= 7`,
      [idTecnico],
    );

    if (chamadosSeguidos.length > 0) {
      await desbloquearConquista(idTecnico, 18);
    }

    const [conquistasUsuario] = await pool.query(
      "SELECT COUNT(*) as total FROM usuario_conquista WHERE fk_usuario = ?",
      [idTecnico],
    );

    if (conquistasUsuario[0]?.total >= 3) {
      await desbloquearConquista(idTecnico, 19);
    }

    if (usuario.length > 0 && usuario[0].nivel >= 250) {
      await desbloquearConquista(idTecnico, 20);
    }
  } catch (erro) {
    console.error("Erro na verificação de regras de conquista: ", erro);
  }
}

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
      console.log(
        `Conquista ID ${idConquista} desbloqueada para o técnico ${idTecnico}!`,
      );
    }
  } catch (erro) {
    console.error("Erro ao inserir desbloqueio de conquista: ", erro);
  }
}
