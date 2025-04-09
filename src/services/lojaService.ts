// src/services/usuarioService.ts
import { Loja } from '../models/Loja';
import { Usuario } from '../models/Usuario';

import { LojaModel } from '../models/LojaModel';



export class ClienteService {
    static async buscarLoja(filtro: { id?: number; cnpj?: string; id_loja?: number; }): Promise<Loja | null> {
      let loja: Loja | null =  null;
      if (filtro.id !== undefined) {
            loja = await LojaModel.buscarLoja({id_usuario: filtro.id});
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
    static async criar(cliente: { cnpj: String; nomeFantasia: String; razaoSocial: String; telefone: String; celular: String; abertura: Date; usuario: Usuario; }): Promise<void> {
  
    //const loja = new Loja(
      //  loja.cnpj,
        //loja.nomeFantasia,
       // loja.razaoSocial,
        //loja.telefone,
        //loja.celular,
        //loja.abertura,
        //usuario,
        //);

      //await ClienteModel.criar(novo_cliente);
    }
}
