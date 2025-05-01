// src/models/UsuarioModel.ts
import pool from '../config/db';
import { Loja } from './Loja';
import { RowDataPacket } from 'mysql2'; // Importando RowDataPacket
import { Usuario } from './Usuario';


export class LojaModel {
  // Buscar um usuário por email
  static async buscarLoja(filtro: { id_usuario?: number; cnpj?: string; id_loja?: number; }): Promise<Loja | null> {
    let query = 'SELECT * FROM lojas JOIN usuarios ON usuarios.id_usuario = lojas.id_usuario WHERE ';
    const params: any[] = [];
  
    if (filtro.id_usuario !== undefined) {
      query += 'lojas.id_usuario = ?';
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
      const usuario = new Usuario(loja.id_usuario, loja.email_usuario, loja.pass_usuario, loja.typeUser, loja.verificado);
   
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
      'INSERT INTO lojas (cnpj, nomeFantasia, razaoSocial,telefone,celular,abertura,id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [loja.cnpj, loja.nomeFantasia, loja.razaoSocial, loja.telefone, loja.celular, loja.abertura, loja.usuario.id_usuario]
    );
  }
  
  static async editar(loja: Loja): Promise<void> {
    await pool.execute(
      'update lojas set nomeFantasia = ?, razaoSocial = ?,telefone =? ,celular = ?,abertura =? ,id_usuario = ?',
      [loja.nomeFantasia, loja.razaoSocial, loja.telefone, loja.celular, loja.abertura, loja.usuario.id_usuario]
    );
  }
  
}
