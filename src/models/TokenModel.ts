// src/models/UsuarioModel.ts
import pool from '../config/db';
import { Token } from './Token';  // O modelo de dados sem a lógica de negócio
import { RowDataPacket } from 'mysql2'; // Importando RowDataPacket
import { UsuarioService } from '../services/usuarioService';

export class TokenModel {
  // Buscar um usuário por email
  static async buscar(token: string): Promise<Token | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM tokens WHERE id_token = ?',
      [token]
    );

    // Garantindo que "rows" seja do tipo RowDataPacket[]
    if (Array.isArray(rows) && rows.length > 0) {
      const token = rows[0] as RowDataPacket; // Cast para RowDataPacket
      const usuario = await UsuarioService.buscar({id_usuario: token.id_user});
      if (!usuario) {
        return null;
      }

      return new Token(token.id_token, token.dt_cr, token.usado, usuario);
    }

    return null;
  }
  // Buscar um usuário por email
  static async atualizar(token: Token): Promise<void>{
    await pool.execute(
        'update tokens set usado = true WHERE id_token = ?',
      [token.id_token]
    );

  }
  static async salvar(token: Token): Promise<void> {

    await pool.execute(
      'INSERT INTO tokens (id_token, dt_cr, usado,id_user) VALUES (?, ?, ?,?)',
      [token.id_token, token.dt_cr, token.usado,token.id_user.id_usuario]
    );
  }
  
}
