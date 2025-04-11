import { Usuario } from "./Usuario";

export class Loja {
    
    id_loja?: number; 
    cnpj: String;
    nomeFantasia: String;
    razaoSocial: String;
    telefone: String;
    celular: String;
    abertura: Date;
    usuario: Usuario;

  
    constructor(
        cnpj: String,
        nomeFantasia: String,
        razaoSocial: String,
        telefone: String,
        celular: String,
        abertura: Date,
        usuario: Usuario,
        id_loja?: number


    ) {
      this.id_loja = id_loja;
      this.cnpj = cnpj;
      this.nomeFantasia = nomeFantasia;
      this.razaoSocial = razaoSocial;
      this.telefone = telefone;
      this.celular = celular;
      this.abertura = abertura;
      this.usuario = usuario;
    }
    

  }

