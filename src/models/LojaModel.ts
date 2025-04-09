// src/models/UsuarioModel.ts
import pool from '../config/db';
import { Loja } from './Loja';
import { RowDataPacket } from 'mysql2'; // Importando RowDataPacket
import { UsuarioService } from '../services/usuarioService';

export class LojaModel {
  // Buscar um usuário por email
  static async buscarLoja(filtro: { id_usuario?: number; cnpj?: string; id_loja?: number; }): Promise<Loja | null> {
    let query = 'SELECT * FROM clientes WHERE ';
    const params: any[] = [];
  
    if (filtro.id_usuario !== undefined) {
      query += 'id_usuario = ?';
      params.push(filtro.id_usuario);
    } else if (filtro.cnpj !== undefined) {
      query += 'cnpj = ?';
      params.push(filtro.cnpj);
    } else if (filtro.id_loja !== undefined) {
      query += 'id_loja = ?';
      params.push(filtro.id_loja);
    }else {
      // Nenhum filtro válido foi passado
      return null;
    }
  
    const [rows] = await pool.execute(query, params);
  
    if (Array.isArray(rows) && rows.length > 0) {
      const loja = rows[0] as RowDataPacket;
      const usuario = await UsuarioService.buscar({id_usuario: loja.id_usuario});
  
      if (!usuario) {
        return null;
      }
   
      return new Loja(
        loja.cnpj,
        loja.nomeFantasia,
        loja.razaoSocial,
        loja.telefone,
        loja.celular,
        loja.abertura,
        usuario,
        loja.id_loja,
      );
    }
  
    return null;
  }
 
  static async criar(loja: Loja): Promise<void> {

    await pool.execute(
      'INSERT INTO clientes (cnpj, nomeFantasia, razaoSocial,telefone,celular,abertura,id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [loja.cnpj, loja.nomeFantasia, loja.razaoSocial, loja.telefone, loja.celular, loja.abertura, loja.usuario.id_usuario]
    );
  }
}
