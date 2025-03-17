// src/services/usuarioService.ts
import { UsuarioModel } from '../models/UsuarioModel';
import { Usuario } from '../models/Usuario';
import bcrypt from 'bcryptjs';

export class UsuarioService {
  // Buscar um usuário por email
  static async buscarPorEmail(email: string): Promise<Usuario | null> {
    const usuario = UsuarioModel.buscarPorEmail(email);

    if (!usuario){
      throw new Error("Usuário não encontrado"); 
    }

    return usuario
  }
  static async buscarPorId(id: number): Promise<Usuario | null> {
    return await UsuarioModel.buscarPorId(id);
  }
  static async login(email: string, pass_usuario: string): Promise<Usuario | null> {
    const usuario = await UsuarioModel.buscarPorEmail(email);

    if (!usuario) {
        throw new Error("Usuário não encontrado"); 
    }

    const senhasIguais = await bcrypt.compare(pass_usuario, usuario.pass_usuario);

    if (!senhasIguais) {
        throw new Error("Senha incorreta");
    }

    return usuario;
  }

  // Salvar um novo usuário
  static async salvar(usuario: { email_usuario: string; pass_usuario: string; typeUser: number|null; }): Promise<void> {
    const hashedPassword = await bcrypt.hash(usuario.pass_usuario, 10);

    const novoUsuario = new Usuario(
      undefined,  // O id_usuario será gerado automaticamente no banco
      usuario.email_usuario,
      usuario.pass_usuario = hashedPassword,
      usuario.typeUser  // Agora passando o typeUser corretamente
    );
    await UsuarioModel.salvar(novoUsuario);
  }
  static async verificar(usuario: Usuario): Promise<Date> {

    const dataAtual = new Date();
   
    await UsuarioModel.verificar(usuario,dataAtual);
    return dataAtual
  }

  static async resetPass(usuario: Usuario): Promise<void> {
    const hashedPassword = await bcrypt.hash(usuario.pass_usuario, 10);
    usuario.pass_usuario = hashedPassword
    await UsuarioModel.resetPass(usuario);
  }

}
