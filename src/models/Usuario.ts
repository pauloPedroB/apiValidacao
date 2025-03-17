// src/models/Usuario.ts
export class Usuario {
    id_usuario?: number;  // Tornando a propriedade opcional
    email_usuario: string;
    pass_usuario: string;
    typeUser?: number | null;
    verificado?: Date;
  
    constructor(
      id_usuario: number | undefined,  // Permitindo que seja undefined
      email_usuario: string,
      pass_usuario: string,
      typeUser: number | null,
      verificado?: Date
    ) {
      this.id_usuario = id_usuario;
      this.email_usuario = email_usuario;
      this.pass_usuario = pass_usuario;
      this.typeUser = typeUser;
      this.verificado = verificado;
    }
  }
  