import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { LojaService } from '../services/lojaService';
import { ClienteService } from '../services/clienteService';



const SECRET_KEY = process.env.SECRET_KEY;

export const dadosMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const token_dados = req.headers['token_dados'];

  if (!token_dados) {
    console.log('teste')
    return res.status(401).json({ message: 'Token Dados não fornecido' });
  }

  try {
    const decoded = jwt.verify(token_dados as string, SECRET_KEY as string) as any;
    
    let encontrouAlgo = false;

    if (decoded?.loja?.cnpj) {
      const loja = await LojaService.buscarLoja({ cnpj: decoded.loja.cnpj });
      if (loja) {
        req['loja'] = loja;
        encontrouAlgo = true;
      }
    }

    if (decoded?.cliente?.cpf) {
      const cliente = await ClienteService.buscarCliente({ cpf: decoded.cliente.cpf });
      if (cliente) {
        req['cliente'] = cliente;
        encontrouAlgo = true;
      }
    }

    if (encontrouAlgo) {
      return next();
    }

    return res.status(400).json({ message: 'Não encontramos cliente ou loja vinculados ao seu usuário' });

  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Token Dados inválido ou expirado' });
  }
};

