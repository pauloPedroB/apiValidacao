// src/models/UsuarioModel.ts
import pool from '../config/db';
import { Produto_Loja } from './Produto_Loja';
import { RowDataPacket } from 'mysql2';
import { Loja } from './Loja';
import { Endereco } from './Endereco';

import { Usuario } from './Usuario';
import { Produto } from './Produto';

export class Produto_LojaModel {
  // Buscar um usuário por email
  static async buscarProdutoLoja(produto_loja: {id_produto_loja?:number, id_loja?:number, id_produto?:number}): Promise<Produto_Loja | null> {
    let query = 'SELECT * FROM produto_loja '+
    'INNER JOIN produtos ON produtos.id_produto = produto_loja.id_produto ' +
    'INNER JOIN lojas ON lojas.id_loja = produto_loja.id_loja '+
    'INNER JOIN usuarios ON usuarios.id_usuario = lojas.id_usuario '+
    'INNER JOIN enderecos ON usuarios.id_usuario = enderecos.id_usuario '+
    'WHERE ';

    if (produto_loja.id_produto_loja !== undefined) {
        query += 'produto_loja.id_produto_loja = ' + produto_loja.id_produto_loja;
      } 
    else if (produto_loja.id_loja !== undefined && produto_loja.id_produto !== undefined) {
        query += 'produto_loja.id_loja = ' + produto_loja.id_loja + ' and produto_loja.id_produto = ' + produto_loja.id_produto;
    }
    else {
        // Nenhum filtro válido foi passado
        return null;
    }
  
    const [rows] = await pool.execute(query);
  
    if (Array.isArray(rows) && rows.length > 0) {
        const produto_loja = rows[0] as RowDataPacket;
        const produto = new Produto(produto_loja.nome_produto,produto_loja.categoria,produto_loja.img,produto_loja.id_produto,);
        const usuario =  new Usuario(produto_loja.id_usuario, produto_loja.email_usuario, produto_loja.pass_usuario, produto_loja.typeUser, produto_loja.verificado);

        const loja =new Loja(produto_loja.cnpj,produto_loja.nomeFantasia,produto_loja.razaoSocial,produto_loja.telefone,produto_loja.celular,produto_loja.abertura,usuario,produto_loja.id_loja,);
        const endereco = new Endereco(
          produto_loja.rua,
          produto_loja.bairro,
          produto_loja.cidade,
          produto_loja.cep,
          produto_loja.uf,
          produto_loja.nmr,
          produto_loja.latitude,
          produto_loja.longitude,
          usuario,
          produto_loja.id,
          produto_loja.complemento
        );
        
      
      return new Produto_Loja(
        produto,
        loja,
        produto_loja.id_produto_loja,
        endereco,

      );
    }
  
    return null;
  }
  static async listarProdutosLoja(loja:Loja): Promise<Produto_Loja[] | null> {
    let query = 'SELECT *'+ 
    'FROM produto_loja '+
    'INNER JOIN produtos ON produtos.id_produto = produto_loja.id_produto '+
    'WHERE produto_loja.id_loja = '+loja.id_loja;

    const [rows] = await pool.execute(query);
    const produtos_loja: Produto_Loja[] = [];

    
    if (Array.isArray(rows)) {
       
        for (const row of rows as RowDataPacket[]) {
            const produto = new Produto(
                row.nome_produto,
                row.categoria,
                row.img,
                row.id_produto,
            );
            
            produtos_loja.push(new Produto_Loja(
                produto,
                loja,
                row.id_produto_loja
            ));
        }
        
    }
    return produtos_loja;
  }
  static async listar( endereco_user?: Endereco|null,palavras?: string[], categoria?: string): Promise<Produto_Loja[]> {
    const params: any[] = [];
    let query = ""
    if(endereco_user){
      query += 'SELECT pl.*, l.*, p.*, e.*, u.id_usuario,' +
      'ROUND(6371 * ACOS(' +
        'COS(RADIANS('+endereco_user.latitude+')) * COS(RADIANS(e.latitude)) * ' +
        'COS(RADIANS(e.longitude) - RADIANS('+endereco_user.longitude+')) + ' +
        'SIN(RADIANS('+endereco_user.latitude+')) * SIN(RADIANS(e.latitude))' +
      '), 2) AS distancia';
    }
    else{
      query += 'SELECT pl.*, l.id_loja, p.*, u.id_usuario ';
    }
  
    if (palavras && palavras.length > 0) {
      // expressão para calcular relevância
      const relevanciaExpr = palavras.map(() => '(p.nome_produto LIKE ?)').join(' + ');
      query += `, (${relevanciaExpr}) AS relevancia `;
    } else {
      query += ', 0 AS relevancia ';
    }
    
    if(endereco_user){
      query += 'FROM produto_loja pl ' +
              'JOIN lojas l ON pl.id_loja = l.id_loja ' +
              'JOIN produtos p ON pl.id_produto = p.id_produto ' +
              'JOIN enderecos e ON e.id_usuario = l.id_usuario '+
              'JOIN usuarios u ON u.id_usuario = l.id_usuario ';
    }
    else{
      query += 'FROM produto_loja pl ' +
              'JOIN lojas l ON pl.id_loja = l.id_loja ' +
              'JOIN produtos p ON pl.id_produto = p.id_produto ' +
              'JOIN usuarios u ON u.id_usuario = l.id_usuario '
    }
  
    const conditions: string[] = [];
  
    if (palavras && palavras.length > 0) {
      const likeConditions = palavras.map(() => 'p.nome_produto LIKE ?').join(' OR ');
      conditions.push(`(${likeConditions})`);
  
      // Preenche os parâmetros duas vezes: uma pra relevância, uma pro WHERE
      palavras.forEach(p => {
        const like = `%${p}%`;
        params.push(like); // relevância
      });
      palavras.forEach(p => {
        const like = `%${p}%`;
        params.push(like); // WHERE
      });
    }
  
    if (categoria) {
      conditions.push('p.categoria = ?');
      params.push(categoria);
    }
  
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
  
    if (endereco_user) {
      if (palavras && palavras.length > 0) {
        query += ' ORDER BY distancia ASC';
        query += ', relevancia DESC';
      }
      else{
        query += ' ORDER BY RAND()';
      }
    } else {
      if (palavras && palavras.length > 0) {
        query += ' ORDER BY relevancia DESC';
      } else {
        query += ' ORDER BY RAND()';
      }
    }
    query += ' LIMIT 40';
  
    const [rows] = await pool.execute(query,params);
    const produtos_loja: Produto_Loja[] = [];

    
    if (Array.isArray(rows)) {
       
        for (const row of rows as RowDataPacket[]) {
            const usuario = new Usuario(row.id_usuario, row.email_usuario, row.pass_usuario, row.typeUser, row.verificado);
            const loja = new Loja(
              row.cnpj,
              row.nomeFantasia,
              row.razaoSocial,
              row.telefone,
              row.celular,
              row.abertura,
              usuario,
              row.id_loja,
            )
            const produto = new Produto(
                row.nome_produto,
                row.categoria,
                row.img,
                row.id_produto,
            );
            let endereco: Endereco | undefined;
            if(endereco_user){
              endereco = new Endereco(
                row.rua,
                row.bairro,
                row.cidade,
                row.cep,
                row.uf,
                row.nmr,
                row.latitude,
                row.longitude,
                usuario,
                row.id,
                row.complemento
              );
            }
            else{
              endereco = undefined;
            }
            
            let distancia = 0
            if(endereco_user){
              distancia = row.distancia
            }

            produtos_loja.push(new Produto_Loja(
                produto,
                loja,
                row.id_produto_loja,
                endereco,
                distancia

            ));
            
        }
        
    }
    
    return produtos_loja;
  }
 
  static async criar(produto_loja: Produto_Loja): Promise<void> {
    await pool.execute(
      'INSERT INTO produto_loja (id_produto, id_loja) VALUES (?, ?)',
      [ produto_loja.produto.id_produto, produto_loja.loja.id_loja]
    );
  }
  static async excluir(produto_loja: Produto_Loja): Promise<void> {
    await pool.execute(
      'delete from produto_loja WHERE id_produto = ? and id_loja = ?',
      [produto_loja.produto.id_produto, produto_loja.loja.id_loja]
    );
  }
  

  
}
