import { Request } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthContext {
  user?: {
    _key: string;
    email: string;
  };
}

export function contextBuilder({ req }: { req: Request }): AuthContext {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; 
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return { user: decoded as AuthContext['user'] };
    } catch (err) {
      console.warn('Token inválido:', err);
    }
  }
  return {}; 
}
