import { Usuario } from "./Usuario";

// src/models/Usuario.ts
export class Cliente {
    id_cliente?: number; 
    cpf: String;
    nome: String;
    telefone: String;
    dtNascimento: Date;
    genero: number;
    carro: number;
    usuario: Usuario;
  
    constructor(
      cpf: String,
      nome: String,
      telefone: String,
      dtNascimento: Date,
      genero: number,
      carro: number,
      usuario: Usuario,
      id_cliente?: number // ← agora ele vem por último e é opcional
    ) {
      this.id_cliente = id_cliente;
      this.cpf = cpf;
      this.nome = nome;
      this.telefone = telefone;
      this.dtNascimento = dtNascimento;
      this.genero = genero;
      this.carro = carro;
      this.usuario = usuario;
    }
    

  }

