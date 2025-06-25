import { Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthContext {
  user?: {
    _key: string;
    email: string;
  };
}

export function contextBuilder({ req }: { req: Request }): AuthContext {
  const PUBLIC_OPERATIONS = ["register", "login"];

  // nome da operação GraphQL enviada pelo cliente
  const opName: string | undefined = req.body?.operationName;

  // se for pública, não exige autenticação
  if (opName && PUBLIC_OPERATIONS.includes(opName)) return {};

  /* ---------- rotas privadas ---------- */
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return {};            // sem token → segue anônimo

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as any;
    return { user: decoded };       // ctx.user disponível
  } catch (err) {
    console.warn("Token inválido:", err);
    return {};                      // token ruim → segue anônimo
  }
}
