
import { Usuario } from "./Usuario";

export class Endereco {
    
    id?: number; 
    rua: String;
    bairro: String;
    cidade: String;
    cep: String;
    complemento?: String;
    uf: String;
    nmr: number;
    latitude: String;
    longitude: String;

    usuario: Usuario;

  
    constructor(
        rua: String,
        bairro: String,
        cidade: String,
        cep: String,
        uf: String,
        nmr: number,
        latitude: String,
        longitude: String,
        usuario: Usuario,
        id?: number,
        complemento?: String
    ) {
      this.rua = rua;
      this.bairro = bairro;
      this.cidade = cidade;
      this.cep = cep;
      this.uf = uf;
      this.nmr = nmr;
      this.latitude = latitude;
      this.longitude = longitude;
      this.usuario = usuario;
      this.id = id;
      this.complemento = complemento; 

    }
    

  }

