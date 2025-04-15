// src/services/usuarioService.ts
import { Produto_Loja} from '../models/Produto_Loja';
import { Loja} from '../models/Loja';
import { Produto} from '../models/Produto';


import { Produto_LojaModel } from '../models/Produto_LojaModel';
import { Endereco } from '../models/Endereco';


export class Produto_LojaService {
    static async buscarProdutoLoja(filtro: {id_produto_loja?:number, id_loja?:number, id_produto?:number}): Promise<Produto_Loja | null> {
    let produto_loja: Produto_Loja | null =  null;

    if (filtro.id_produto_loja !== undefined) {
        produto_loja = await Produto_LojaModel.buscarProdutoLoja({id_produto_loja: filtro.id_produto_loja});
      } 
    else if (filtro.id_loja !== undefined && filtro.id_produto !== undefined) {
        produto_loja = await Produto_LojaModel.buscarProdutoLoja({id_loja: filtro.id_loja, id_produto: filtro.id_produto});
    }
    else {
        // Nenhum filtro válido foi passado
        return null;
    }
      if (!produto_loja){
        return null
      }
      return produto_loja
    }
    static async listarProdutosLoja(loja: Loja): Promise<Produto_Loja[] | null> {
        
          
        const produtos_loja = await Produto_LojaModel.listarProdutosLoja(loja)
          if (!produtos_loja){
            return null
          }
          return produtos_loja
        }
    
    static async listar(endereco_user?: Endereco|null,palavras?: string[], categoria?: string): Promise<Produto_Loja[]> {
      let produto_loja: Produto_Loja[];
      
      if(endereco_user){
        produto_loja = await Produto_LojaModel.listar(endereco_user,palavras,categoria);
      }
      else{
        produto_loja = await Produto_LojaModel.listar(null,palavras,categoria);

      }
   
      return produto_loja
    }
    static async criar(produto_loja: { loja: Loja, produto: Produto}): Promise<void> {
  
        const novo_produto_loja = new Produto_Loja(
            produto_loja.produto,
            produto_loja.loja
            );

        await Produto_LojaModel.criar(novo_produto_loja);
    }

    static async excluir(produto_loja: Produto_Loja): Promise<void> {

        await Produto_LojaModel.excluir(produto_loja);
    }
   

}
