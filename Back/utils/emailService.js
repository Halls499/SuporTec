import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Essa é a função que estava faltando ser exportada!
export async function enviarEmail(para, assunto, texto) {
  try {
    const info = await transporter.sendMail({
      from: `"SuporTec" <${process.env.EMAIL_USER}>`,
      to: para,
      subject: assunto,
      text: texto,
    });
    console.log("E-mail enviado com sucesso:", info.messageId);
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return false;
  }
}
