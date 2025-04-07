// src/models/UsuarioModel.ts
import pool from '../config/db';
import { Cliente } from './Cliente';
import { RowDataPacket } from 'mysql2'; // Importando RowDataPacket
import { UsuarioService } from '../services/usuarioService';

export class ClienteModel {
  // Buscar um usuário por email
  static async buscarPorId(id_cliente: number): Promise<Cliente | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM clientes WHERE id_cliente = ?',
      [id_cliente]
    );

    // Garantindo que "rows" seja do tipo RowDataPacket[]
    if (Array.isArray(rows) && rows.length > 0) {
      const cliente = rows[0] as RowDataPacket; // Cast para RowDataPacket
      const usuario = await UsuarioService.buscarPorId(cliente.id_usuario)
      
      if(!usuario){
        return null
      }
    
      return new Cliente(
        cliente.id_cliente,
        cliente.cpf,
        cliente.nome,
        cliente.telefone,
        cliente.dtNascimento,
        cliente.genero,
        cliente.carro,
        usuario
    );
    }

    return null;
  }
  
}
