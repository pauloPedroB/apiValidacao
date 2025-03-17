// src/models/UsuarioModel.ts
import pool from '../config/db';
import { Usuario } from './Usuario';  // O modelo de dados sem a lógica de negócio
import { RowDataPacket } from 'mysql2'; // Importando RowDataPacket
import bcrypt from 'bcryptjs';

export class UsuarioModel {
  // Buscar um usuário por email
  static async buscarPorEmail(email: string): Promise<Usuario | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE email_usuario = ?',
      [email]
    );

    // Garantindo que "rows" seja do tipo RowDataPacket[]
    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0] as RowDataPacket; // Cast para RowDataPacket
      return new Usuario(user.id_usuario, user.email_usuario, user.pass_usuario, user.typeUser, user.verificado);
    }

    return null;
  }
  static async buscarPorId(id_usuario: number): Promise<Usuario | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE id_usuario = ?',
      [id_usuario]
    );

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
}
