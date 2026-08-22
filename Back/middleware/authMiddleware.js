import jwt from "jsonwebtoken";

// Middleware para verificar o token JWT
export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não informado.",
    });
  }

  // Garante a divisão correta do parâmetro Bearer
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      erro: "Formato do token inválido. Esperado: Bearer <token>",
    });
  }

  // Extrai o token da segunda parte do header
  const token = parts[1];

  if (!process.env.JWT_SECRET) {
    console.error("ERRO CRÍTICO: JWT_SECRET não definida no ambiente.");
    return res.status(500).json({
      erro: "Erro interno de configuração de autenticação.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Injeta os dados do usuário logado na requisição
    req.usuario = decoded;

    return next();
  } catch (erro) {
    if (erro.name === "TokenExpiredError") {
      return res.status(401).json({
        erro: "Token expirado. Faça login novamente.",
      });
    }

    return res.status(401).json({
      erro: "Token inválido.",
    });
  }
}

// Middleware auxiliar para autorização por tipo de usuário
export function autorizarTipos(...tiposPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !tiposPermitidos.includes(req.usuario.tipo_usuario)) {
      return res.status(403).json({
        erro: "Acesso negado. Você não tem permissão para realizar esta ação.",
      });
    }
    next();
  };
}
