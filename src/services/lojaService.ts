// src/services/usuarioService.ts
import { Loja } from '../models/Loja';
import { Usuario } from '../models/Usuario';

import { LojaModel } from '../models/LojaModel';



export class LojaService {
    static async buscarLoja(filtro: { usuario?: Usuario; cnpj?: string; id_loja?: number; }): Promise<Loja | null> {
      let loja: Loja | null =  null;
      if (filtro.usuario !== undefined) {
        loja = await LojaModel.buscarLoja({id_usuario: filtro.usuario.id_usuario});
      }
      else if (filtro.cnpj !== undefined) {
            loja = await LojaModel.buscarLoja({ cnpj: filtro.cnpj });
      }
      else if (filtro.id_loja !== undefined) {
            loja = await LojaModel.buscarLoja({ id_loja: filtro.id_loja });
      }
      else {
          throw new Error("Nenhum parâmetro enviado");
        }
    
  
      if (!loja){
        return null
      }
      return loja
    }
    static async criar(loja: { cnpj: String; nomeFantasia: String; razaoSocial: String; telefone: String; celular: String; abertura: Date; usuario: Usuario; }): Promise<void> {
  
    const nova_loja = new Loja(
        loja.cnpj,
        loja.nomeFantasia,
        loja.razaoSocial,
        loja.telefone,
        loja.celular,
        loja.abertura,
        loja.usuario,
        );

      await LojaModel.criar(nova_loja);
    }
}
