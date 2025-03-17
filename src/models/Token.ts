import { Usuario } from "./Usuario";

// src/models/Usuario.ts
export class Token {
    id_token: string; 
    dt_cr: Date;
    usado: boolean;
    id_user: Usuario;
  
    constructor(
        id_token: string,
        dt_cr: Date,
        usado: boolean,
        id_user: Usuario,
      ) {
        this.id_token = id_token;
        this.dt_cr = dt_cr;
        this.usado = usado;
        this.id_user = id_user;
      }

  }

