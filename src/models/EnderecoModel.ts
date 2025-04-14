// src/models/UsuarioModel.ts
import pool from '../config/db';
import { Endereco } from './Endereco';
import { RowDataPacket } from 'mysql2'; // Importando RowDataPacket
import { UsuarioService } from '../services/usuarioService';

export class EnderecoModel {
  // Buscar um usuário por email
  static async buscarEndereco(filtro: { id_usuario?: number; cep?: string; id_endereco?: number; }): Promise<Endereco | null> {
    let query = 'SELECT * FROM enderecos WHERE ';
    const params: any[] = [];
  
    if (filtro.id_usuario !== undefined) {
      query += 'id_usuario = ?';
      params.push(filtro.id_usuario);
    } else if (filtro.id_endereco !== undefined) {
      query += 'id = ?';
      params.push(filtro.id_endereco);
    }else {
      // Nenhum filtro válido foi passado
      return null;
    }
  
    const [rows] = await pool.execute(query, params);
  
    if (Array.isArray(rows) && rows.length > 0) {
      const endereco = rows[0] as RowDataPacket;
      const usuario = await UsuarioService.buscar({id_usuario: endereco.id_usuario});
  
      if (!usuario) {
        return null;
      }
   
      return new Endereco(
        endereco.rua,
        endereco.bairro,
        endereco.cidade,
        endereco.cep,
        endereco.uf,
        endereco.nmr,
        endereco.latitude,
        endereco.longitude,
        usuario,
        endereco.id,
        endereco.complemento
      );
    }
  
    return null;
  }
 
  static async criar(endereco: Endereco): Promise<void> {
    await pool.execute(
      'INSERT INTO enderecos (rua, bairro, cidade,cep,uf,nmr,latitude,longitude,complemento,id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
      [ endereco.rua, endereco.bairro, endereco.cidade, endereco.cep, endereco.uf, endereco.nmr, endereco.latitude,endereco.longitude,endereco.complemento ,endereco.usuario.id_usuario]
    );
  }
  static async editar(endereco: Endereco): Promise<void> {
    await pool.execute(
      'update enderecos set rua = ?, bairro = ?, cidade = ?,cep =? ,uf = ?,nmr =? ,latitude = ?,longitude =? ,complemento = ? WHERE id_usuario = ?',
      [endereco.rua,endereco.bairro,endereco.cidade,endereco.cep, endereco.uf, endereco.nmr,endereco.latitude,endereco.longitude,endereco.complemento,endereco.usuario.id_usuario]
    );
  }
}
