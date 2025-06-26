import { Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthContext {
  user?: {
    _key: string;
    email: string;
  } | null;
}

export function contextBuilder({ req }: { req: Request }): AuthContext {
  const PUBLIC_OPERATIONS = ["register", "login"];
  const operationName = (req.body?.operationName || "").toLowerCase();

  if (PUBLIC_OPERATIONS.includes(operationName)) {
    return { user: null }; // Permite requisições públicas
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return { user: decoded as AuthContext["user"] };
    } catch (err) {
      console.warn("Token inválido:", err);
    }
  }

  // Não lança erro aqui — deixa os resolvers decidirem
  return { user: null };
}
