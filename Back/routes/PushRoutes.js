import express from "express";
import webpush from "web-push";
import pool from "../config/database.js";
import { verificarToken } from "../middleware/authMiddleware.js";

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
    const [results] = await pool.query(
      `SELECT * FROM push_subscriptions WHERE id_usuario = ?`,
      [id_usuario],
    );

    if (!Array.isArray(results) || results.length === 0) return;

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
  } catch (err) {
    console.error("Erro ao buscar inscrições:", err);
  }
}

export default router;