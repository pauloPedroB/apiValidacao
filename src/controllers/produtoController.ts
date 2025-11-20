// src/controllers/usuarioController.ts
import { Usuario } from '../models/Usuario';
import { ProdutoService } from '../services/produtoService';


import Joi from "joi";

export class ProdutoController {
  async buscar(req, res) {
    try {
      const schema = Joi.object({
        id_produto: Joi.number().integer().required().messages({
          "number.base": "Id do Produto deve ser um número",
          "number.integer": "O id do Produto deve ser um número inteiro!",
          "any.required": "O id do Produto é obrigatório!"
        }),
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      
      const produto = await ProdutoService.buscarProduto(value.id_produto);

      if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      return res.status(200).json({ message: 'Produto encontrado', produto });

    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
  async listar_categorias(res) {
    try {
      
      const categorias = await ProdutoService.listar_categorias();

      return res.status(200).json({ message: 'Categorias encontradas', categorias });

    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
  async criar(req, res) {
    try {
      const schema = Joi.object({
        nome_produto: Joi.string().max(150).required().messages({
          "string.max": "O Nome do Produto deve ter no máximo 150 caracteres!",
          "any.required": "O Nome do Produto é obrigatório!"
        }),
        img: Joi.string().max(300).required().messages({
            "string.max": "O campo img deve ter no máximo 300 caracteres!",
            "any.required": "O campo img é obrigatório!"
        }),
        categoria: Joi.string().max(50).messages({
            "string.max": "A categoria deve ter no máximo 50 caracteres!",
        }),
       
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        console.log('joi')
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }

      const schemaUser = Joi.custom((value, helpers) => {
        if (!(value instanceof Usuario)) {
          return helpers.error('any.invalid');
        }
        return value; // está ok
      }, 'Classe Usuario');
      const usuario_req = req.usuario

      const { error: errorUser } = schemaUser.validate(usuario_req);
      if (errorUser) {
        return res.status(400).json({ message: ['Usuário do token inválido'] });
      }
      if(usuario_req.typeUser != 1){
        return res.status(404).json({ message: 'Seu usuário não tem acesso para cadastrar produtos' });
      }
      
      const result = await ProdutoService.criar({
        nome_produto: value.nome_produto,
        categoria: value.categoria,
        img: value.img
      });
      
      res.status(201).json({ message: 'Produto criado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  async editar(req, res) {
    try {
        const schema = Joi.object({
            id_produto: Joi.number().integer().required().messages({
                "number.base": "Id do Produto deve ser um número",
                "number.integer": "O id do Produto deve ser um número inteiro!",
                "any.required": "O id do Produto é obrigatório!"
                }),
            nome_produto: Joi.string().max(150).required().messages({
                "string.max": "O Nome do Produto deve ter no máximo 150 caracteres!",
                "any.required": "O Nome do Produto é obrigatório!"
            }),
            img: Joi.string().max(300).required().messages({
                "string.max": "O campo img deve ter no máximo 300 caracteres!",
                "any.required": "O campo img é obrigatório!"
            }),
            categoria: Joi.string().max(50).messages({
                "string.max": "A categoria deve ter no máximo 50 caracteres!",
            }),
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
  
        if (error) {
          console.log('joi')
          return res.status(400).json({ message: error.details.map((err) => err.message) });
        }
        const schemaUser = Joi.custom((value, helpers) => {
          if (!(value instanceof Usuario)) {
            return helpers.error('any.invalid');
          }
          return value; // está ok
        }, 'Classe Usuario');
        const usuario_req = req.usuario
  
        const { error: errorUser } = schemaUser.validate(usuario_req);
        if (errorUser) {
          return res.status(400).json({ message: ['Usuário do token inválido'] });
        }
        if(usuario_req.typeUser != 1){
          return res.status(404).json({ message: 'Seu usuário não tem acesso para editar produtos' });
        }
        const produto = await ProdutoService.buscarProduto(value.id_produto)
        if(produto == null){
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        produto.categoria = value.categoria;
        produto.img = value.img;
        produto.nome_produto = value.nome_produto;

        const result = await ProdutoService.editar(produto);
        
        res.status(201).json({ message: 'Produto editado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  async excluir(req, res) {
    try {
        const schema = Joi.object({
            id_produto: Joi.number().integer().required().messages({
                "number.base": "Id do Produto deve ser um número",
                "number.integer": "O id do Produto deve ser um número inteiro!",
                "any.required": "O id do Produto é obrigatório!"
                }),
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
  
        if (error) {
          console.log('joi')
          return res.status(400).json({ message: error.details.map((err) => err.message) });
        }
        const schemaUser = Joi.custom((value, helpers) => {
          if (!(value instanceof Usuario)) {
            return helpers.error('any.invalid');
          }
          return value; // está ok
        }, 'Classe Usuario');
        const usuario_req = req.usuario
  
        const { error: errorUser } = schemaUser.validate(usuario_req);
        if (errorUser) {
          return res.status(400).json({ message: ['Usuário do token inválido'] });
        }
        if(usuario_req.typeUser != 1){
          return res.status(404).json({ message: 'Seu usuário não tem acesso para excluir produtos' });
        }
        const produto = await ProdutoService.buscarProduto(value.id_produto)
        if(produto == null){
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        const result = await ProdutoService.excluir(produto);
        
        res.status(201).json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  async buscarProdutos(req, res) {
    try {
      const schema = Joi.object({
        nomes: Joi.array().items(Joi.string()),
        categoria: Joi.string().allow(null, '').max(50).messages({
            "string.max": "A categoria deve ter no máximo 50 caracteres!",
        }),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      const schemaUser = Joi.custom((value, helpers) => {
        if (!(value instanceof Usuario)) {
          return helpers.error('any.invalid');
        }
        return value; // está ok
      }, 'Classe Usuario');
      const usuario_req = req.usuario

      const { error: errorUser } = schemaUser.validate(usuario_req);
      if (errorUser) {
        return res.status(400).json({ message: ['Usuário do token inválido'] });
      }
      if(usuario_req.typeUser != 1 && usuario_req.typeUser != 2){
        return res.status(404).json({ message: 'Seu usuário não tem acesso para listar produtos' });
      }
      const produtos = await ProdutoService.buscarProdutos(value.nomes,value.categoria);

      return res.status(200).json({ message: 'Produtos encontrados', produtos });

    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
  
}
