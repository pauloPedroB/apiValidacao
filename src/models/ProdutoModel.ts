// src/models/UsuarioModel.ts
import pool from '../config/db';
import { Produto } from './Produto';
import { RowDataPacket } from 'mysql2';
import { UsuarioService } from '../services/usuarioService';

export class ProdutoModel {
  // Buscar um usuário por email
  static async buscarProduto(id_produto:number): Promise<Produto | null> {
    let query = 'SELECT * FROM produtos WHERE id_produto = ' + id_produto;
  
    const [rows] = await pool.execute(query);
  
    if (Array.isArray(rows) && rows.length > 0) {
      const produto = rows[0] as RowDataPacket;
  
   
      return new Produto(
        produto.nome_produto,
        produto.categoria,
        produto.img,
        produto.id_produto,
      );
    }
  
    return null;
  }
 
  static async criar(produto: Produto): Promise<void> {
    await pool.execute(
      'INSERT INTO produtos (nome_produto, img,categoria) VALUES (?, ?, ?)',
      [ produto.nome_produto, produto.img, produto.categoria]
    );
  }
  static async editar(produto: Produto): Promise<void> {
    await pool.execute(
      'update produtos set nome_produto = ?, img = ?, categoria = ? WHERE id_produto = ?',
      [produto.nome_produto, produto.img, produto.categoria,produto.id_produto]
    );
  }
  static async excluir(produto: Produto): Promise<void> {
    await pool.execute(
      'delete from produtos WHERE id_produto = ?',
      [produto.id_produto]
    );
  }

  static async buscarProdutos(palavras?: string[], categoria?: string): Promise<Produto[]> {
    let query = 'SELECT *, ';
    const params: any[] = [];
  
    if (palavras && palavras.length > 0) {
      // Cria expressão de relevância
      const relevanciaExpr = palavras.map(() => '(nome_produto LIKE ?)').join(' + ');
      query += `(${relevanciaExpr}) AS relevancia FROM produtos WHERE `;
  
      // Adiciona os LIKEs para o WHERE
      const likeConditions = palavras.map(() => 'nome_produto LIKE ?').join(' OR ');
      query += likeConditions;
  
      // Preenche os parâmetros duas vezes (uma pra relevancia, outra pro WHERE)
      palavras.forEach(palavra => {
        const like = `%${palavra}%`;
        params.push(like); // para relevancia
      });
      palavras.forEach(palavra => {
        const like = `%${palavra}%`;
        params.push(like); // para WHERE
      });
  
      // Se tiver categoria, adiciona mais filtro
      if (categoria) {
        query += ' AND categoria = ?';
        params.push(categoria);
      }
  
      query += ' ORDER BY relevancia DESC';
    } else {
      query += '0 AS relevancia FROM produtos';
      if (categoria) {
        query += ' WHERE categoria = ?';
        params.push(categoria);
      }
    }
  
    query += ' LIMIT 100';
  
    const [rows] = await pool.execute(query, params);
  
    const produtos: Produto[] = [];
  
    if (Array.isArray(rows)) {
      for (const row of rows) {
        const produto = row as RowDataPacket;
        produtos.push(new Produto(
          produto.nome_produto,
          produto.categoria,
          produto.img,
          produto.id_produto,
        ));
      }
    }
  
    return produtos;
  }
  
  
}
