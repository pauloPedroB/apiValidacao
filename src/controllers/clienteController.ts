// src/controllers/usuarioController.ts
import { Request, Response } from 'express';
import { ClienteService } from '../services/clienteService';
import { UsuarioService } from '../services/usuarioService';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';


import Joi from "joi";

export class ClienteController {
  async buscar(req, res) {
    try {
      const schema = Joi.object({
        id_usuario: Joi.number().integer().messages({
          "number.base": "Id do Usuário deve ser um número",
          "number.integer": "O id do Usuário deve ser um número inteiro!"
        }),
        id_cliente: Joi.number().integer().messages({
          "number.base": "Id do Cliente deve ser um número",
          "number.integer": "O id do Cliente deve ser um número inteiro!"
        }),
        cpf: Joi.string().pattern(/^\d{11}$/).messages({
          "string.pattern.base": "CPF deve conter 11 dígitos numéricos"
        })
      }).or('id_usuario', 'cpf','id_cliente').messages({
        'object.missing': 'É necessário informar o id_usuario ou o cpf'
      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      const cliente = await ClienteService.buscarCliente({
        id: value.id_usuario,
        cpf: value.cpf,
        id_cliente: value.id_cliente
      });

      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      return res.status(200).json({ message: 'Cliente encontrado', cliente });

    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
  async criar(req, res) {
    try {
      const { cpf, nome, dtNascimento, telefone,genero,carro,id_usuario} = req.body;

      const dataMinima = new Date();
      dataMinima.setFullYear(dataMinima.getFullYear() - 18);

      const schema = Joi.object({
        cpf: Joi.string().pattern(/^\d{11}$/).messages({
          "string.pattern.base": "CPF deve conter 11 dígitos numéricos",
          "any.required": "O campo cpf é obrigatório!"
        }),
        nome: Joi.string().max(65).required().messages({
          "string.max": "O nome deve ter no máximo 65 caracteres!",
          "any.required": "O campo nome é obrigatório!"
        }),
        dtNascimento: Joi.date().less(dataMinima).required().messages({
          'date.base': 'Data de nascimento inválida',
          'date.less': 'O cliente deve ter mais de 18 anos',
          'any.required': 'Data de nascimento é obrigatória'
        }),
        telefone: Joi.string().min(8).max(25).required().messages({
          "string.min": "A confirmação de senha deve ter pelo menos 8 caracteres!",
          "string.max": "A confirmação de senha deve ter no máximo 25 caracteres!",
          "any.required": "O campo confirmação de senha é obrigatório!"
        }),
        genero: Joi.number().integer().messages({
          "number.base": "O campo genero deve ser um número",
          "number.integer": "O campo genero deve ser um número inteiro!",
          "any.required": "O campo genero é obrigatório!"
        }),
        carro: Joi.number().integer().messages({
          "number.base": "O campo carro deve ser um número",
          "number.integer": "O campo carro deve ser um número inteiro!",
          "any.required": "O campo carro é obrigatório!"
        }),
        id_usuario: Joi.number().integer().messages({
          "number.base": "Id do Usuário deve ser um número",
          "number.integer": "O id do Usuário deve ser um número inteiro!",
          "any.required": "O id do Usuário é obrigatório!"
        }),
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      if (!cpfValidator.isValid(cpf)) {
        return res.status(400).json({ message: 'CPF INVÁLIDO' });
      }
      const cliente = await ClienteService.buscarCliente({cpf: cpf,});

      if (cliente) {
        return res.status(404).json({ message: 'Já existe um cliente cadastrado com esse CPF' });
      }

      const usuario = await UsuarioService.buscar({id_usuario: id_usuario});

      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
      }
      usuario.typeUser = 3;
      
      await UsuarioService.atualizarTipo(usuario);

      const result = await ClienteService.criar({
        cpf, nome, dtNascimento, telefone,genero,carro,usuario
      });
      
      const novo_cliente = await ClienteService.buscarCliente({cpf: cpf,});

      res.status(201).json({ message: 'Cliente criado com sucesso',novo_cliente });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}
