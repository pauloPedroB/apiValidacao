import { Produto } from "./Produto";
import { Loja } from "./Loja";
import { Endereco } from "./Endereco";


export class Produto_Loja {

    id_produto_loja?: number;
    produto: Produto;
    loja: Loja;
    endereco?: Endereco;

    constructor(
        produto: Produto,
        loja: Loja,
        id_produto_loja?: number,
        endereco?: Endereco,
    ) {
      this.id_produto_loja = id_produto_loja;
      this.produto = produto;
      this.loja = loja;
      this.endereco= endereco;

    }
    

  }




