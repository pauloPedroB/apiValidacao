// src/controllers/usuarioController.ts
import { Loja } from '../models/Loja';
import { LojaService } from '../services/lojaService';
import { UsuarioService } from '../services/usuarioService';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { Usuario } from '../models/Usuario';
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');




import Joi from "joi";

export class LojaController {
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

      const loja = await LojaService.buscarLoja({usuario: usuario_req,});

      if (!loja) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
      const token_dados = jwt.sign(
        { loja },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      return res.status(200).json({ message: 'Loja encontrada', token_dados });

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


      if (!cnpjValidator.isValid(value.cnpj)) {
        return res.status(400).json({ message: 'CNPJ INVÁLIDO' });
      }
      const verify_loja = await LojaService.buscarLoja({cnpj: value.cnpj,});

      if (verify_loja) {
        return res.status(404).json({ message: 'Já existe uma Loja cadastrado com esse CNPJ' });
      }

      if(usuario_req.typeUser != null){
        return res.status(404).json({ message: 'Este usuário já está vinculado a uma Loja, Cliente ou Administrador' });
      }
      usuario_req.typeUser = 2;
      
      await UsuarioService.atualizarTipo(usuario_req);

      const result = await LojaService.criar({
        cnpj,
        nomeFantasia,
        razaoSocial,
        telefone,
        celular,
        abertura,
        usuario: usuario_req, 
      });
      
      const loja = await LojaService.buscarLoja({cnpj: value.cnpj});

      const token_dados = jwt.sign(
        { loja },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      res.status(201).json({ message: 'Loja criada com sucesso',token_dados });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}
