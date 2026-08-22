import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function enviarNotificacaoParaUsuario(
  id_usuario,
  tituloMensagem,
  corpoMensagem,
) {
  try {
    // 1. Busca os dados do usuário (nome e email) para o envio de email
    const [usuarios] = await pool.query(
      `SELECT nome, email FROM usuario WHERE id_usuario = ?`,
      [id_usuario],
    );

    if (usuarios && usuarios.length > 0) {
      const usuario = usuarios[0];
      if (usuario.email) {
        console.log("Tentando enviar e-mail para:", usuario.email);
        await enviarEmail(
          usuario.email,
          tituloMensagem,
          `Olá, ${usuario.nome || "Usuário"}.\n\n${corpoMensagem}`,
        );
      }
    }

    // 2. Tenta disparar o Push Notification (caso existam inscrições no banco)
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
    console.error("Erro geral na função de notificação:", err);
  }
}
