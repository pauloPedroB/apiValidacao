// src/models/UsuarioModel.ts
import pool from '../config/db';
import { Usuario } from './Usuario';  // O modelo de dados sem a lógica de negócio
import { RowDataPacket } from 'mysql2'; // Importando RowDataPacket
import bcrypt from 'bcryptjs';

export class UsuarioModel {
  // Buscar um usuário por email
  static async buscar(filtro: { id_usuario?: number; email_usuario?: string }): Promise<Usuario | null> {
    let query = 'SELECT * FROM usuarios WHERE ';
    const params: any[] = [];
  
    if (filtro.id_usuario !== undefined) {
      query += 'id_usuario = ?';
      params.push(filtro.id_usuario);
    } else if (filtro.email_usuario !== undefined) {
      query += 'email_usuario = ?';
      params.push(filtro.email_usuario);
    } else {
      // Nenhum filtro válido foi passado
      return null;
    }
    const [rows] = await pool.execute(query, params);

    // Garantindo que "rows" seja do tipo RowDataPacket[]
    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0] as RowDataPacket; // Cast para RowDataPacket
      return new Usuario(user.id_usuario, user.email_usuario, user.pass_usuario, user.typeUser, user.verificado);
    }

    return null;
  }


  // Criar um novo usuário no banco
  static async salvar(usuario: Usuario): Promise<void> {

    await pool.execute(
      'INSERT INTO usuarios (email_usuario, pass_usuario, typeUser) VALUES (?, ?, ?)',
      [usuario.email_usuario, usuario.pass_usuario, usuario.typeUser]
    );
  }
  static async verificar(usuario: Usuario,dataAtual: Date): Promise<void> {

    await pool.execute(
      'update usuarios set verificado = ? WHERE id_usuario = ?',
      [dataAtual,usuario.id_usuario]
    );
  }
  static async resetPass(usuario: Usuario): Promise<void>{
    await pool.execute(
        'update usuarios set pass_usuario = ? WHERE id_usuario = ?',
      [usuario.pass_usuario,usuario.id_usuario]
    );

  }

  static async atualizarTipo(usuario: Usuario): Promise<void>{
    await pool.execute(
        'update usuarios set typeUser = ? WHERE id_usuario = ?',
      [usuario.typeUser,usuario.id_usuario]
    );

  }
}
