// src/services/usuarioService.ts
import { TokenModel } from '../models/TokenModel';
import { Token } from '../models/Token';
import { Usuario } from '../models/Usuario';
const crypto = require('crypto');

export class TokenService {
    static async buscar(id_token: string): Promise<Token | null> {
        const token = await TokenModel.buscar(id_token);
    
        if (!token) {
            return null
        }
        return token;
    }
    static async salvar(usuario: Usuario): Promise<Token> {
        
        const id_token = crypto.randomBytes(32).toString('hex');
        const dt_cr = new Date();
        const usado = false;
        const novoToken = new Token(
          id_token, 
          dt_cr,
          usado,
          usuario
        );
        await TokenModel.salvar(novoToken);
        return novoToken
      }
    static async verificar(id_token: string,id_user:number): Promise<Token | null> {
        const token = await TokenModel.buscar(id_token);
    
        if (!token) {
            throw new Error("Token inválido");
        }

        if(token.usado == true){
            throw new Error("Token já ultilizado"); 
        }
        if(token.id_user.id_usuario != id_user){
            throw new Error("Usuário vinculado ao token não é o mesmo usuário que está acessando o sistema"); 
        }
        const dataCriacao = new Date(token.dt_cr);

        const dataAtual = new Date();

        const diferencaEmMs = dataAtual.getTime() - dataCriacao.getTime();

        const diferencaEmHoras = diferencaEmMs / (1000 * 60 * 60);

        if (diferencaEmHoras > 2) {
            throw new Error("Token expirado");
        }
       
    
        return token;
    }
    static async atualizar(token: Token): Promise<void> {
    
          await TokenModel.atualizar(token);
    }

}
