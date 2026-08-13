import express from "express";
import webpush from "web-push";
import pool from "../config/database.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configuração das Chaves VAPID
webpush.setVapidDetails(
  'mailto:contato@suportec.com',
  'BEVANANHE89wDqDfDCKtDZSwi6uSPD8NIrxcbgRIQxeZpzo_Bl5acZ5L8Wh-SlpAZAas_lhNIRdvP8BL9iEUJl0',
  'dTKpsaf5-zl_3KrnjtByPjNC7aIMBgJyzJ1vlbkoq9U'
);

// Rota para salvar a inscrição do navegador
router.post("/salvar-inscricao", verificarToken, async (req, res) => {
  const { endpoint, keys } = req.body;
  const id_usuario = req.usuarioId; // Obtido do token JWT

  // 🔍 LOG 1: Confirma se a requisição chegou na rota e quem é o usuário
  console.log("🔔 Requisição recebida em /salvar-inscricao para o usuário ID:", id_usuario);

  try {
    const query = `REPLACE INTO push_subscriptions (id_usuario, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)`;
    await pool.query(query, [id_usuario, endpoint, keys.p256dh, keys.auth]);
    
    // 🔍 LOG 2: Confirma que gravou no banco com sucesso
    console.log("✅ Inscrição salva/atualizada com sucesso no MySQL!");
    res.status(200).json({ mensagem: "Inscrição salva com sucesso!" });
  } catch (err) {
    // 🔍 LOG 3: Mostra se deu erro no banco de dados
    console.error("❌ ERRO CRÍTICO ao salvar inscrição no banco:", err);
    res.status(500).json({ erro: "Erro ao salvar inscrição" });
  }
});

// Função auxiliar exportável para disparar notificações de qualquer lugar do sistema
export async function enviarNotificacaoParaUsuario(id_usuario, tituloMensagem, corpoMensagem) {
  try {
    const [results] = await pool.query(`SELECT * FROM push_subscriptions WHERE id_usuario = ?`, [id_usuario]);
    
    if (results.length === 0) {
      console.log(`⚠️ Nenhuma inscrição push encontrada para o usuário ID: ${id_usuario}`);
      return;
    }

    results.forEach(sub => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      const payload = JSON.stringify({
        title: tituloMensagem,
        body: corpoMensagem
      });

      webpush.sendNotification(pushSubscription, payload)
        .then(() => console.log(`🚀 Push enviado com sucesso para o usuário ${id_usuario}`))
        .catch(error => console.error("❌ Erro ao enviar push notification via web-push:", error));
    });
  } catch (err) {
    console.error("❌ Erro ao buscar inscrições para envio:", err);
  }
}

export default router;