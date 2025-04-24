import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UsuarioService } from '../services/usuarioService';


const SECRET_KEY = process.env.SECRET_KEY;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const token = req.headers['authorization']?.split(' ')[1]; // Ex: "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const usuario_token = decoded;
    const usuario = await UsuarioService.buscar({id_usuario: usuario_token.usuario.id_usuario, email_usuario: usuario_token.usuario.email_usuario});
    if (!usuario) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }
    req['usuario'] = usuario
    
    next(); // Passa o controle para a próxima função/middleware
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
