// src/controllers/usuarioController.ts
import { Produto_LojaService } from '../services/produto_lojaService';
import {EnderecoService} from '../services/enderecoService';
import {UsuarioService} from '../services/usuarioService';
import {LojaService} from '../services/lojaService';
import {ProdutoService} from '../services/produtoService';





import Joi from "joi";

export class Produto_LojaController {
  async buscar(req, res) {
    try {
      const schema = Joi.object({
        id_produto_loja: Joi.number().integer().required().messages({
          "number.base": "Id do Produto deve ser um número",
          "number.integer": "O id do Produto deve ser um número inteiro!",
          "any.required": "O id do Produto é obrigatório!"
        }),
        id_usuario: Joi.number().integer().required().messages({
            "number.base": "Id do Usuário deve ser um número",
            "number.integer": "O id do Usuário deve ser um número inteiro!",
            "any.required": "O id do Usuário é obrigatório!"
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
      const usuario = await UsuarioService.buscar({id_usuario: value.id_usuario})
      if(usuario == null){
        return res.status(404).json({ message: 'É necessário estar logado no sistema' });
      }
      if(usuario.typeUser == 1 || produto_loja.endereco == null){
        return res.status(200).json({ message: 'Produto encontrado', produto_loja });
      }

      const endereco = await EnderecoService.buscarEndereco({id_usuario: usuario.id_usuario});
      if(endereco == null){
        return res.status(404).json({ message: 'Endereço não encontrado' });
      }
     
      const distancia = await EnderecoService.contarDistancia(endereco,produto_loja.endereco);

      return res.status(200).json({ message: 'Produto encontrado', produto_loja, distancia,endereco });

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
        id_usuario: Joi.number().integer().required().messages({
          "number.base": "Id do Usuário deve ser um número",
          "number.integer": "O id do Usuário deve ser um número inteiro!",
          "any.required": "O id do Usuário é obrigatório!"
        }),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      const usuario = await UsuarioService.buscar({id_usuario: value.id_usuario})
      if(usuario == null){
        return res.status(404).json({ message: 'É necessário estar logado no sistema' });
      }
      const endereco = await EnderecoService.buscarEndereco({id_usuario: usuario.id_usuario});
      if(endereco == null){
        if(usuario.typeUser == 1){
          const produto_loja = await Produto_LojaService.listar(null,value.nomes,value.categoria);
  
          return res.status(200).json({ message: 'Produto encontrado', produto_loja });
        }
        return res.status(404).json({ message: 'Endereço não encontrado' });
      }
      
      
      const produtos_loja = await Produto_LojaService.listar(endereco,value.nomes,value.categoria);

      
      return res.status(200).json({ message: 'Produtos encontrados', produtos_loja, });

    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
  async listarProdutosLoja(req, res) {
    try {
      const schema = Joi.object({
        id_loja: Joi.number().integer().required().messages({
          "number.base": "Id do Loja deve ser um número",
          "number.integer": "O id do Loja deve ser um número inteiro!",
          "any.required": "O id do Loja é obrigatório!"
        }),
        id_usuario: Joi.number().integer().required().messages({
            "number.base": "Id do Usuário deve ser um número",
            "number.integer": "O id do Usuário deve ser um número inteiro!",
            "any.required": "O id do Usuário é obrigatório!"
          }),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      const loja = await LojaService.buscarLoja({
        id_loja: value.id_loja
      });

      if (!loja) {
        return res.status(404).json({ message: 'Loja não encontrada' });
      }

      if(loja.usuario.id_usuario != value.id_usuario ){
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
        id_loja: Joi.number().integer().required().messages({
            "number.base": "Id do Loja deve ser um número",
            "number.integer": "O id do Loja deve ser um número inteiro!",
            "any.required": "O id do Loja é obrigatório!"
          }),
        id_produto: Joi.number().integer().required().messages({
            "number.base": "Id do Produto deve ser um número",
            "number.integer": "O id do Produto deve ser um número inteiro!",
            "any.required": "O id do Produto é obrigatório!"
        }),
        id_usuario: Joi.number().integer().required().messages({
          "number.base": "Id do Usuário deve ser um número",
          "number.integer": "O id do Usuário deve ser um número inteiro!",
          "any.required": "O id do Usuário é obrigatório!"
        }),
        
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        console.log('joi')
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }

      const produto_loja = await Produto_LojaService.buscarProdutoLoja({id_loja: value.id_loja, id_produto: value.id_produto});

      if (produto_loja) {
        return res.status(404).json({ message: 'Produto já está vinculado a essa loja' });
      }
      const loja = await LojaService.buscarLoja({id_loja: value.id_loja});
      if(loja == null){
        return res.status(404).json({ message: 'Loja não encontrada' });
      }
      if(loja.usuario.id_usuario != value.id_usuario ){
        return res.status(404).json({ message: 'Esse usuário não tem acesso para cadastrar produtos nessa loja' });

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
              id_usuario: Joi.number().integer().required().messages({
              "number.base": "Id do Usuário deve ser um número",
              "number.integer": "O id do Usuário deve ser um número inteiro!",
              "any.required": "O id do Usuário é obrigatório!"
            }),
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
          console.log('joi')
          return res.status(400).json({ message: error.details.map((err) => err.message) });
        }
        const produto_loja = await Produto_LojaService.buscarProdutoLoja({id_produto_loja: value.id_produto_loja})
        if(produto_loja == null){
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        if(produto_loja.loja.usuario.id_usuario != value.id_usuario ){
          return res.status(404).json({ message: 'Esse usuário não tem acesso para excluir produtos dessa loja' });
  
        }
        const result = await Produto_LojaService.excluir(produto_loja);
        
        res.status(201).json({ message: 'Produto Desvinculado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  
  
}
