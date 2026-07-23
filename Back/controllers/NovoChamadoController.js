import * as chamadoModel from "../models/NovoChamadoModels.js"; // Ou o nome exato do seu arquivo de model!

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

  // Pegando o id do usuário do middleware JWT
  const fk_cliente = req.usuario.id_usuario;
  console.log("👉 ID DO CLIENTE EXTRAÍDO DO TOKEN:", fk_cliente);

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

    // 2. Montando o objeto que o Model espera receber
    const dadosChamado = {
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

  try {
    const listaChamados = await chamadoModel.listarChamadosPorCliente(fk_cliente);

    return res.status(200).json(listaChamados);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao buscar chamados.",
    });
  }
}