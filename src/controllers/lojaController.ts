// src/controllers/usuarioController.ts
import { Loja } from '../models/Loja';
import { LojaService } from '../services/lojaService';
import { UsuarioService } from '../services/usuarioService';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';


import Joi from "joi";

export class LojaController {
  async buscar(req, res) {
    try {
      const schema = Joi.object({
        id_usuario: Joi.number().integer().messages({
          "number.base": "Id do Usuário deve ser um número",
          "number.integer": "O id do Usuário deve ser um número inteiro!"
        }),
        id_loja: Joi.number().integer().messages({
          "number.base": "Id do Cliente deve ser um número",
          "number.integer": "O id do Cliente deve ser um número inteiro!"
        }),
        cnpj: Joi.string().pattern(/^\d{14}$/).messages({
          "string.pattern.base": "CNPJ deve conter 14 dígitos numéricos"
        })
      }).or('id_usuario', 'cnpj','id_loja').messages({
        'object.missing': 'É necessário informar o id_usuario ou o cnpj'
      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      const loja = await LojaService.buscarLoja({
        id: value.id_usuario,
        cnpj: value.cnpj,
        id_loja: value.id_loja
      });

      if (!loja) {
        return res.status(404).json({ message: 'Loja não encontrada' });
      }

      return res.status(200).json({ message: 'Loja encontrada', loja });

    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
  async criar(req, res) {
    try {
      const { cnpj, nomeFantasia, razaoSocial, telefone,celular,abertura,id_usuario} = req.body;

      const schema = Joi.object({
        cnpj: Joi.string().pattern(/^\d{14}$/).messages({
          "string.pattern.base": "CNPJ deve conter 14 dígitos numéricos",
          "any.required": "O campo CNPJ é obrigatório!"
        }),
        nomeFantasia: Joi.string().max(65).required().messages({
          "string.max": "O Nome Fantasia deve ter no máximo 65 caracteres!",
          "any.required": "O campo Nome Fantasia é obrigatório!"
        }),
        razaoSocial: Joi.string().max(65).required().messages({
            "string.max": "O Razão Social deve ter no máximo 65 caracteres!",
            "any.required": "O campo Razão Social é obrigatório!"
        }),
        telefone: Joi.string().required().pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/).message(
          'Telefone inválido'
        ),
        celular: Joi.string().required().pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/).message(
          'Celular inválido'
        ),
        abertura: Joi.date().required().messages({
          'date.base': 'Data de nascimento inválida',
          'date.less': 'O cliente deve ter mais de 18 anos',
          'any.required': 'Data de nascimento é obrigatória'
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
      if (!cnpjValidator.isValid(value.cnpj)) {
        return res.status(400).json({ message: 'CNPJ INVÁLIDO' });
      }
      const loja = await LojaService.buscarLoja({cnpj: value.cnpj,});

      if (loja) {
        return res.status(404).json({ message: 'Já existe uma Loja cadastrado com esse CNPJ' });
      }

      const usuario = await UsuarioService.buscar({id_usuario: value.id_usuario});

      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
      }
      usuario.typeUser = 2;
      
      await UsuarioService.atualizarTipo(usuario);

      const result = await LojaService.criar({
        cnpj,
        nomeFantasia,
        razaoSocial,
        telefone,
        celular,
        abertura,
        usuario, 
      });
      
      const nova_loja = await LojaService.buscarLoja({cnpj: value.cnpj});

      res.status(201).json({ message: 'Loja criada com sucesso',nova_loja });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}
