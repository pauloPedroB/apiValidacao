import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

export const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.headers['authorization']?.split(' ')[1]; // Ex: "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req['usuario'] = decoded;
    next(); // Passa o controle para a próxima função/middleware
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
