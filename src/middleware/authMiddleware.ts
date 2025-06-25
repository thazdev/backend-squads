import { Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthContext {
  user?: {
    _key: string;
    email: string;
  };
}

export function contextBuilder({ req }: { req: Request }): AuthContext {
  const PUBLIC_OPERATIONS = ['register', 'login'];

  const operationName: string | undefined = req.body?.operationName;

  if (operationName && PUBLIC_OPERATIONS.includes(operationName.toLowerCase())) {
    return {};                     // rota pública: sem autenticação
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return {};           // anônimo

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    return { user: decoded };
  } catch (err) {
    console.warn('Token inválido:', err);
    return {};
  }
}


