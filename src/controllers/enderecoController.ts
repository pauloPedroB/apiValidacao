// src/controllers/usuarioController.ts
import { Endereco } from '../models/Endereco';
import { EnderecoService } from '../services/enderecoService';
import { UsuarioService } from '../services/usuarioService';
import { Usuario } from '../models/Usuario';
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

import Joi from "joi";

export class EnderecoController {
  async buscar(req, res) {
    try {
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
      

     
      const endereco = await EnderecoService.buscarEndereco({
        id_usuario: usuario_req.id_usuario,
      });

      if (!endereco) {
        return res.status(404).json({ message: 'Endereço não encontrado' });
      }
      if(endereco.usuario.id_usuario != usuario_req.id_usuario){
        return res.status(404).json({ message: 'Esse usuário não tem acesso à esse endereço' });
      }
      const token_endereco = jwt.sign(
        { endereco:endereco },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ message: 'Endereço encontrado', token_endereco });

    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
  async criar(req, res) {
    try {
      const schema = Joi.object({
        cep: Joi.string().pattern(/^\d{8}$/).required().messages({
          "string.pattern.base": "CEP deve conter 8 dígitos numéricos",
          "any.required": "O campo CEP é obrigatório!"
        }),
        rua: Joi.string().max(65).required().messages({
          "string.max": "A rua deve ter no máximo 65 caracteres!",
          "any.required": "A rua é obrigatória!"
        }),
        bairro: Joi.string().max(40).required().messages({
            "string.max": "O bairro deve ter no máximo 40 caracteres!",
            "any.required": "o Bairro é obrigatório!"
        }),
        cidade: Joi.string().max(40).required().messages({
            "string.max": "A cidade deve ter no máximo 40 caracteres!",
            "any.required": "A cidade é obrigatória!"
        }),
        uf: Joi.string().max(2).required().messages({
            "string.max": "A UF deve ter no máximo 2 caracteres!",
            "any.required": "A UF é obrigatória!"
        }),
        nmr: Joi.number().integer().messages({
            "number.base": "O número deve ser um número",
            "number.integer": "O número deve ser um número inteiro!",
            "any.required": "O número é obrigatório!"
        }),
        complemento: Joi.string().max(200).allow('').messages({
            "string.max": "A complemento deve ter no máximo 200 caracteres!",
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
      
      const endereco = await EnderecoService.buscarEndereco({id_usuario: usuario_req.id_usuario});
      if(endereco != null){
        return res.status(400).json({ message: 'Já existe um endereço vinculado a esse Usuário' });

      }

      const [sucesso,enderecoValidado] = await EnderecoService.BuscarCEP(value.cep,value.nmr);
      if(sucesso == false){
        return res.status(400).json({ message: 'Erro ao encontrar CEP'+ endereco });
      }
      let nova_rua = value.rua;
      let novo_bairro = value.bairro;
      let nova_cidade = value.cidade;
      let nova_uf = value.uf;

      if(enderecoValidado.rua != ""){
        nova_rua = enderecoValidado.rua
      }
      if(enderecoValidado.bairro != ""){
        novo_bairro = enderecoValidado.bairro
      }
      if(enderecoValidado.cidade != ""){
        nova_cidade = enderecoValidado.cidade
      }
      if(enderecoValidado.uf != ""){
        nova_uf = enderecoValidado.uf
      }
      const result = await EnderecoService.criar({
        rua: nova_rua,
        bairro: novo_bairro,
        cidade: nova_cidade,
        uf: nova_uf,
        cep: value.cep,
        nmr: value.nmr,
        latitude: enderecoValidado.latitude,
        longitude: enderecoValidado.longitude,
        usuario: usuario_req,
        complemento: value.complemento
      });
      
      
      const novo_endereco = await EnderecoService.buscarEndereco({id_usuario: usuario_req.id_usuario});

      const token_endereco = jwt.sign(
        { endereco:novo_endereco },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      res.status(201).json({ message: 'Endereço criado com sucesso',token_endereco });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: (error as Error).message });
    }
  }
  async editar(req, res) {
    try {
      const schema = Joi.object({
        cep: Joi.string().pattern(/^\d{8}$/).messages({
          "string.pattern.base": "CEP deve conter 8 dígitos numéricos",
          "any.required": "O campo CEP é obrigatório!"
        }),
        rua: Joi.string().max(65).required().messages({
          "string.max": "A rua deve ter no máximo 65 caracteres!",
          "any.required": "A rua é obrigatória!"
        }),
        bairro: Joi.string().max(40).required().messages({
            "string.max": "O bairro deve ter no máximo 40 caracteres!",
            "any.required": "o Bairro é obrigatório!"
        }),
        cidade: Joi.string().max(40).required().messages({
            "string.max": "A cidade deve ter no máximo 40 caracteres!",
            "any.required": "A cidade é obrigatória!"
        }),
        uf: Joi.string().max(2).required().messages({
            "string.max": "A UF deve ter no máximo 2 caracteres!",
            "any.required": "A UF é obrigatória!"
        }),
        nmr: Joi.number().integer().messages({
            "number.base": "O número deve ser um número",
            "number.integer": "O número deve ser um número inteiro!",
            "any.required": "O número é obrigatório!"
        }),
        complemento: Joi.string().max(200).allow('').messages({
            "string.max": "A complemento deve ter no máximo 200 caracteres!",
        }),
        id_endereco: Joi.number().integer().messages({
          "number.base": "Id do Endereço deve ser um número",
          "number.integer": "O id do Endereço deve ser um número inteiro!",
          "any.required": "O id do Endereço é obrigatório!"
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
      
      
      const endereco = await EnderecoService.buscarEndereco({id_endereco: value.id_endereco});
      if(endereco == null){
        return res.status(400).json({ message: 'Endereço não encontrado' });
      }
      if(endereco.usuario.id_usuario != usuario_req.id_usuario){
        return res.status(400).json({ message: 'Esse usuário não pode editar o endereço de outro usuário' });
      }

      const [sucesso,enderecoValidado] = await EnderecoService.BuscarCEP(value.cep,value.nmr);
      if(sucesso == false){
        return res.status(400).json({ message: 'Erro ao encontrar CEP'+ endereco });
      }
      let nova_rua = value.rua;
      let novo_bairro = value.bairro;
      let nova_cidade = value.cidade;
      let nova_uf = value.uf;

      if(enderecoValidado.rua != ""){
        nova_rua = enderecoValidado.rua
      }
      if(enderecoValidado.bairro != ""){
        novo_bairro = enderecoValidado.bairro
      }
      if(enderecoValidado.cidade != ""){
        nova_cidade = enderecoValidado.cidade
      }
      if(enderecoValidado.uf != ""){
        nova_uf = enderecoValidado.uf
      }
      const result = await EnderecoService.editar({
        rua: nova_rua,
        bairro: novo_bairro,
        cidade: nova_cidade,
        uf: nova_uf,
        cep: value.cep,
        nmr: value.nmr,
        latitude: enderecoValidado.latitude,
        longitude: enderecoValidado.longitude,
        usuario: endereco.usuario,
        complemento: value.complemento
      });
      
      

      const novo_endereco = await EnderecoService.buscarEndereco({id_usuario: value.id_usuario});
      const token_endereco = jwt.sign(
        { endereco:novo_endereco },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.status(201).json({ message: 'Endereço criado com sucesso',token_endereco });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  
}
