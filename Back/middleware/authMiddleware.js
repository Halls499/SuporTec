import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não informado.",
    });
  }

  const token = authHeader.split(" ")[1];

  // Se não existir a segunda parte (o token em si), já barra aqui!
  if (!token) {
    return res.status(401).json({
      erro: "Formato do token inválido.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = decoded;

    next();
  } catch (erro) {
    return res.status(401).json({
      erro: "Token inválido.",
    });
  }
}