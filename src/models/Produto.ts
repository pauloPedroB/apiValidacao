
export class Produto {

    id_produto?: number;
    nome_produto: String;
    categoria: String;
    img: String;

    constructor(
        nome_produto: String,
        categoria: String,
        img: String,
        id_produto?: number,



    ) {
      this.id_produto = id_produto;
      this.nome_produto = nome_produto;
      this.categoria = categoria;
      this.img = img;
    }
    

  }

