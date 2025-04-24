// src/services/usuarioService.ts
import { Cliente } from '../models/Cliente';
import { Usuario } from '../models/Usuario';

import { ClienteModel } from '../models/ClienteModel';



export class ClienteService {
    static async buscarCliente(filtro: { usuario?: Usuario; cpf?: string; id_cliente?: number; }): Promise<Cliente | null> {
      let cliente: Cliente | null =  null;
      if (filtro.usuario !== undefined) {
          cliente = await ClienteModel.buscarCliente({id_usuario: filtro.usuario.id_usuario});
      }
      else if (filtro.cpf !== undefined) {
          cliente = await ClienteModel.buscarCliente({ cpf: filtro.cpf });
      }
      else if (filtro.id_cliente !== undefined) {
        cliente = await ClienteModel.buscarCliente({ id_cliente: filtro.id_cliente });
      }
      else {
          throw new Error("Nenhum parâmetro enviado");
        }
    
  
      if (!cliente){
        return null
      }
      return cliente
    }
    static async criar(cliente: { cpf: String; nome: String; telefone: String; dtNascimento: Date; genero: number; carro: number; usuario: Usuario; }): Promise<void> {
  
      const novo_cliente =  new Cliente(
        cliente.cpf,
        cliente.nome,
        cliente.telefone,
        cliente.dtNascimento,
        cliente.genero,
        cliente.carro,
        cliente.usuario
      );

      await ClienteModel.criar(novo_cliente);
    }
}
