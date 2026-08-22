import express from "express";
import webpush from "web-push";
import pool from "../config/database.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import { enviarEmail } from "../utils/emailService.js";

const router = express.Router();

webpush.setVapidDetails(
  "mailto:contato@suportec.com",
  "BEVANANHE89wDqDfDCKtDZSwi6uSPD8NIrxcbgRIQxeZpzo_Bl5acZ5L8Wh-SlpAZAas_lhNIRdvP8BL9iEUJl0",
  "dTKpsaf5-zl_3KrnjtByPjNC7aIMBgJyzJ1vlbkoq9U",
);

router.post("/salvar-inscricao", verificarToken, async (req, res) => {
  const { endpoint, keys } = req.body;

  // Ajustado para buscar de onde o middleware realmente injeta o usuário:
  const id_usuario =
    req.usuario?.id_usuario || req.usuario?.id || req.usuarioId;

  if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
    return res.status(400).json({ erro: "Dados de inscrição incompletos." });
  }

  if (!id_usuario) {
    return res
      .status(401)
      .json({ erro: "Usuário não identificado pelo token." });
  }

  try {
    const query = `REPLACE INTO push_subscriptions (id_usuario, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)`;
    await pool.query(query, [id_usuario, endpoint, keys.p256dh, keys.auth]);

    return res.status(200).json({ mensagem: "Inscrição salva com sucesso!" });
  } catch (err) {
    console.error("Erro ao salvar inscrição:", err);
    return res.status(500).json({ erro: "Erro ao salvar inscrição" });
  }
});

export async function enviarNotificacaoParaUsuario(
  id_usuario,
  tituloMensagem,
  corpoMensagem,
) {
  try {
    // 1. Busca os dados do usuário (incluindo o e-mail) direto na tabela usuario
    const [usuarios] = await pool.query(
      `SELECT nome, email FROM usuario WHERE id_usuario = ?`,
      [id_usuario]
    );

    if (usuarios && usuarios.length > 0) {
      const usuario = usuarios[0];
      if (usuario.email) {
        // Envia o e-mail
        await enviarEmail(
          usuario.email,
          tituloMensagem,
          `Olá, ${usuario.nome || "Usuário"}.\n\n${corpoMensagem}`
        );
      }
    }

    // 2. Dispara o Push Notification (caso o usuário tenha configurado)
    const [results] = await pool.query(
      `SELECT * FROM push_subscriptions WHERE id_usuario = ?`,
      [id_usuario],
    );

    if (Array.isArray(results) && results.length > 0) {
      results.forEach((sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        };

        const payload = JSON.stringify({
          title: tituloMensagem,
          body: corpoMensagem,
        });

        webpush.sendNotification(pushSubscription, payload).catch((error) => {
          console.error("Erro ao enviar push:", error);
        });
      });
    }
  } catch (err) {
    console.error("Erro ao enviar notificações:", err);
  }
}

export default router;
