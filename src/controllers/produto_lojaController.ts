// src/controllers/usuarioController.ts
import { Produto_LojaService } from '../services/produto_lojaService';
import {EnderecoService} from '../services/enderecoService';
import {UsuarioService} from '../services/usuarioService';
import {ProdutoService} from '../services/produtoService';
import { Usuario } from '../models/Usuario';

import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY;




import Joi from "joi";
import { Loja } from '../models/Loja';

export class Produto_LojaController {
  async buscar(req, res) {
    try {
      const schema = Joi.object({
        id_produto_loja: Joi.number().integer().required().messages({
          "number.base": "Id do Produto deve ser um número",
          "number.integer": "O id do Produto deve ser um número inteiro!",
          "any.required": "O id do Produto é obrigatório!"
        }),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      const produto_loja = await Produto_LojaService.buscarProdutoLoja({id_produto_loja: value.id_produto_loja});

      if (!produto_loja) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      const token = req.headers['authorization']?.split(' ')[1]; // Ex: "Bearer <token>"
  
      if (!token) {
        return res.status(200).json({ message: 'Produto encontrado', produto_loja });
      }

      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const usuario_token = decoded;
        const usuario = await UsuarioService.buscar({id_usuario: usuario_token.usuario.id_usuario, email_usuario: usuario_token.usuario.email_usuario});
        if(usuario == null){
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        if(usuario.typeUser == 1 || produto_loja.endereco == null){
          return res.status(200).json({ message: 'Produto encontrado', produto_loja });
        }
        const endereco = await EnderecoService.buscarEndereco({id_usuario: usuario.id_usuario});
        if(endereco == null){
          return res.status(404).json({ message: 'Seu Endereço não foi encontrado' });
        }
      
        const distancia = await EnderecoService.contarDistancia(endereco,produto_loja.endereco);

        return res.status(200).json({ message: 'Produto encontrado', produto_loja, distancia,endereco });
      } 
      catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Token inválido ou expirado' });
      }
      
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
  async listar(req, res) {
    try {
      const schema = Joi.object({
        nomes: Joi.array().items(Joi.string()),
        categoria: Joi.string().allow(null, '').max(50).messages({
            "string.max": "A categoria deve ter no máximo 50 caracteres!",
        }),
      });
      const token = req.headers['authorization']?.split(' ')[1]; // Ex: "Bearer <token>"
  
     
      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }

      if (!token) {
        const produtos_loja = await Produto_LojaService.listar(null,value.nomes,value.categoria);
        return res.status(200).json({ message: 'Produto encontrado', produtos_loja });
      }

      try {

        const decoded = jwt.verify(token, SECRET_KEY);
        const usuario_token = decoded;
        const usuario = await UsuarioService.buscar({id_usuario: usuario_token.usuario.id_usuario, email_usuario: usuario_token.usuario.email_usuario});
        if(usuario == null){
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const endereco = await EnderecoService.buscarEndereco({id_usuario: usuario.id_usuario});
        if(endereco == null){
          if(usuario.typeUser == 1){
            const produtos_loja = await Produto_LojaService.listar(null,value.nomes,value.categoria);
    
            return res.status(200).json({ message: 'Produto encontrado', produtos_loja });
          }
          return res.status(404).json({ message: 'Endereço não encontrado' });
        }
        const produtos_loja = await Produto_LojaService.listar(endereco,value.nomes,value.categoria);
        return res.status(200).json({ message: 'Produtos encontrados', produtos_loja, });

      } 
      catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Token inválido ou expirado' });
      }
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
  async listarProdutosLoja(req, res) {
    try {
      const schema = Joi.custom((value, helpers) => {
        if (!(value instanceof Usuario)) {
          return helpers.error('any.invalid');
        }
        return value; // está ok
      }, 'Classe Usuario');
      const usuario_req = req.usuario

      const { error } = schema.validate(usuario_req);
      if (error) {
        return res.status(400).json({ message: ['Usuário do token inválido'] });
      }

      const schemaLoja = Joi.custom((value, helpers) => {
        if (!(value instanceof Loja)) {
          return helpers.error('any.invalid');
        }
        return value; // está ok
      }, 'Classe Loja');
      const loja = req.loja

      const { error:errorLoja } = schemaLoja.validate(loja);
      if (errorLoja) {
        return res.status(400).json({ message: ['Loja do token inválida'] });
      }

      if(loja.usuario.id_usuario != usuario_req.id_usuario ){
        return res.status(404).json({ message: 'Esse usuário não tem acesso aos produtos de outra loja' });

      }
  
      const produtos_loja = await Produto_LojaService.listarProdutosLoja(loja);


      return res.status(200).json({ message: 'Produto encontrado', produtos_loja,loja });

    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
  async criar(req, res) {
    try {
      const schema = Joi.object({
        id_produto: Joi.number().integer().required().messages({
            "number.base": "Id do Produto deve ser um número",
            "number.integer": "O id do Produto deve ser um número inteiro!",
            "any.required": "O id do Produto é obrigatório!"
        }),
      });
      const schemaUser = Joi.custom((value, helpers) => {
        if (!(value instanceof Usuario)) {
          return helpers.error('any.invalid');
        }
        return value; // está ok
      }, 'Classe Usuario');

      const schemaLoja = Joi.custom((value, helpers) => {
        if (!(value instanceof Loja)) {
          return helpers.error('any.invalid');
        }
        return value; // está ok
      }, 'Classe Loja');
      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        console.log('joi')
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }

      const usuario_req = req.usuario

      const { error:errorUser } = schemaUser.validate(usuario_req);
      if (errorUser) {
        return res.status(400).json({ message: ['Usuário do token inválido'] });
      }

      const loja = req.loja

      const { error:errorLoja } = schemaLoja.validate(loja);
      if (errorLoja) {
        return res.status(400).json({ message: ['Loja do token inválida'] });
      }
      if(loja.usuario.id_usuario != usuario_req.id_usuario ){
        return res.status(404).json({ message: 'Esse usuário não tem acesso para cadastrar produtos nessa loja' });
      }

      const produto_loja = await Produto_LojaService.buscarProdutoLoja({id_loja: loja.id_loja, id_produto: value.id_produto});

      if (produto_loja) {
        return res.status(404).json({ message: 'Produto já está vinculado a essa loja' });
      }
      
      const produto = await ProdutoService.buscarProduto(value.id_produto);
      if(produto == null){
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      
      const result = await Produto_LojaService.criar({
        loja,produto
      });
      
      res.status(201).json({ message: 'Produto Vinculado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  
  async excluir(req, res) {
    try {
        const schema = Joi.object({
          id_produto_loja: Joi.number().integer().required().messages({
              "number.base": "Id do Produto deve ser um número",
              "number.integer": "O id do Produto deve ser um número inteiro!",
              "any.required": "O id do Produto é obrigatório!"
          }),
        });
        const schemaUser = Joi.custom((value, helpers) => {
          if (!(value instanceof Usuario)) {
            return helpers.error('any.invalid');
          }
          return value; // está ok
        }, 'Classe Usuario');

        const schemaLoja = Joi.custom((value, helpers) => {
          if (!(value instanceof Loja)) {
            return helpers.error('any.invalid');
          }
          return value; // está ok
        }, 'Classe Loja');
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
          console.log('joi')
          return res.status(400).json({ message: error.details.map((err) => err.message) });
        }

        const usuario_req = req.usuario

        const { error:errorUser } = schemaUser.validate(usuario_req);
        if (errorUser) {
          return res.status(400).json({ message: ['Usuário do token inválido'] });
        }

        const loja = req.loja

        const { error:errorLoja } = schemaLoja.validate(loja);
        if (errorLoja) {
          return res.status(400).json({ message: ['Loja do token inválida'] });
        }
        const produto_loja = await Produto_LojaService.buscarProdutoLoja({id_produto_loja: value.id_produto_loja})
        if(produto_loja == null)
        {
          return res.status(404).json({ message: 'Produto não encontrado' });
        }

        if (produto_loja.loja.usuario.id_usuario != usuario_req.id_usuario) {
          return res.status(404).json({ message: 'Esse usuário não tem acesso para excluir produtos nessa loja' });
        }

        const result = await Produto_LojaService.excluir(produto_loja);
        
        res.status(201).json({ message: 'Produto Desvinculado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  
  
}
