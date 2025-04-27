// src/controllers/usuarioController.ts
import { ClienteService } from '../services/clienteService';
import { UsuarioService } from '../services/usuarioService';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { Usuario } from '../models/Usuario';
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;



import Joi from "joi";

export class ClienteController {
  async buscar(req, res) {
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

      const cliente = await ClienteService.buscarCliente({usuario: usuario_req,});

      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
      const token_dados = jwt.sign(
        { cliente },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      return res.status(200).json({ message: 'Cliente encontrado', token_dados });

    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
  async criar(req, res) {
    try {
      const { cpf, nome, dtNascimento, telefone,genero,carro} = req.body;

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
        telefone: Joi.string().pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/).message(
          'Telefone inválido'
        ),
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
        return res.status(400).json({ message: 'Usuário do token inválido' });
      }

      if (!cpfValidator.isValid(cpf)) {
        return res.status(400).json({ message: 'CPF INVÁLIDO' });
      }
      const verify_cliente = await ClienteService.buscarCliente({cpf: cpf,});

      if (verify_cliente) {
        return res.status(404).json({ message: 'Já existe um cliente cadastrado com esse CPF' });
      }

      if(usuario_req.typeUser != null){
        return res.status(404).json({ message: 'Este usuário já está vinculado a uma Loja, Cliente ou Administrador' });
      }
      usuario_req.typeUser = 3;
      
      await UsuarioService.atualizarTipo(usuario_req);

      const result = await ClienteService.criar({
        cpf, nome, dtNascimento, telefone,genero,carro,usuario: usuario_req
      });

      
      
      const cliente = await ClienteService.buscarCliente({cpf: cpf,});
      const token_dados = jwt.sign(
        { cliente },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.status(201).json({ message: 'Cliente criado com sucesso',token_dados });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}
