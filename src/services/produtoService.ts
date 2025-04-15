// src/services/usuarioService.ts
import { Produto } from '../models/Produto';

import { ProdutoModel } from '../models/ProdutoModel';



export class ProdutoService {
    static async buscarProduto(id_produto: number): Promise<Produto | null> {
        const produto = await ProdutoModel.buscarProduto(id_produto);

      if (!produto){
        return null
      }
      return produto
    }
    static async criar(produto: { nome_produto: String, categoria: String, img: String}): Promise<void> {
  
        const novo_produto = new Produto(
            produto.nome_produto,
            produto.categoria,
            produto.img
            );

        await ProdutoModel.criar(novo_produto);
    }

    static async editar(produto: Produto): Promise<void> {

        await ProdutoModel.editar(produto);
    }
    static async excluir(produto: Produto): Promise<void> {

        await ProdutoModel.excluir(produto);
    }
    static async buscarProdutos(palavras?: string[], categoria?: string): Promise<Produto[]> {
        const produtos = await ProdutoModel.buscarProdutos(palavras,categoria);

        return produtos
    }

}
