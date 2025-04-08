// src/services/usuarioService.ts
import { Cliente } from '../models/Cliente';
import { ClienteModel } from '../models/ClienteModel';



export class ClienteService {
    static async buscarCliente(filtro: { id?: number; cpf?: string }): Promise<Cliente | null> {
        let cliente: Cliente | null =  null;
        if (filtro.id !== undefined) {
            cliente = await ClienteModel.buscarCliente({id_usuario: filtro.id});
        }
        else if (filtro.cpf !== undefined) {
            cliente = await ClienteModel.buscarCliente({ cpf: filtro.cpf });
        }
        else {
            throw new Error("Nenhum parâmetro enviado");
          }
      
    
        if (!cliente){
          throw new Error("Cliente não encontrado");
        }
        return cliente
    
      }
}
