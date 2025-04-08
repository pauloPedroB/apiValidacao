// src/models/UsuarioModel.ts
import pool from '../config/db';
import { Cliente } from './Cliente';
import { RowDataPacket } from 'mysql2'; // Importando RowDataPacket
import { UsuarioService } from '../services/usuarioService';

export class ClienteModel {
  // Buscar um usuário por email
  static async buscarCliente(filtro: { id_usuario?: number; cpf?: string }): Promise<Cliente | null> {
    let query = 'SELECT * FROM clientes WHERE ';
    const params: any[] = [];
  
    if (filtro.id_usuario !== undefined) {
      query += 'id_usuario = ?';
      params.push(filtro.id_usuario);
    } else if (filtro.cpf !== undefined) {
      query += 'cpf = ?';
      params.push(filtro.cpf);
    } else {
      // Nenhum filtro válido foi passado
      return null;
    }
  
    const [rows] = await pool.execute(query, params);
  
    if (Array.isArray(rows) && rows.length > 0) {
      const cliente = rows[0] as RowDataPacket;
      const usuario = await UsuarioService.buscar({id_usuario: cliente.id_usuario});
  
      if (!usuario) {
        return null;
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
