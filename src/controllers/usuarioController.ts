// src/controllers/usuarioController.ts
import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuarioService';
import { Usuario } from '../models/Usuario';

import Joi from "joi";
import { TokenService } from '../services/tokenService';
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;



export class UsuarioController {
  // Método para criar um novo usuário
  async criar(req, res) {
    try {
      const { email_usuario, pass_usuario, confirm_pass } = req.body;

      const schema = Joi.object({
        email_usuario: Joi.string().email().max(120).required().messages({
          "string.email": "O email deve ser válido!",
          "string.max": "O email deve ter no máximo 120 caracteres!",
          "any.required": "O campo email é obrigatório!"
        }),
        pass_usuario: Joi.string().min(8).max(25).required().messages({
          "string.min": "A senha deve ter pelo menos 8 caracteres!",
          "string.max": "A senha deve ter no máximo 25 caracteres!",
          "any.required": "O campo senha é obrigatório!"
        }),
        confirm_pass: Joi.string().min(8).max(25).required().messages({
          "string.min": "A confirmação de senha deve ter pelo menos 8 caracteres!",
          "string.max": "A confirmação de senha deve ter no máximo 25 caracteres!",
          "any.required": "O campo confirmação de senha é obrigatório!"
        }),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      if (pass_usuario != confirm_pass) {
        return res.status(404).json({ message: 'Senha e confirmação devem ser iguais!' });
      }

      // Verifica se o email já está cadastrado
      const verify_usuario = await UsuarioService.buscar({email_usuario: email_usuario});


      if (verify_usuario) {
        return res.status(404).json({ message: 'Email já cadastrado!' });
      }

      const typeUser = null
      // Passa o objeto com os dados do novo usuário para o método de salvar
      const result = await UsuarioService.salvar({
        email_usuario,
        pass_usuario: pass_usuario,
        typeUser
      });

      const usuario = await UsuarioService.buscar({email_usuario: email_usuario});
      const token = jwt.sign(
        { usuario }, // payload
        SECRET_KEY,
        { expiresIn: '1h' } // expiração
      );

      res.status(201).json({ message: 'Usuário criado com sucesso', token });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async login(req, res) {
    const { email_usuario, pass_usuario } = req.body;

    const schema = Joi.object({
      email_usuario: Joi.string().email().max(120).required().messages({
        "string.email": "O email deve ser válido!",
        "string.max": "O email deve ter no máximo 120 caracteres!",
        "any.required": "O campo email é obrigatório!"
      }),
      pass_usuario: Joi.string().min(8).max(25).required().messages({
        "string.min": "A senha deve ter pelo menos 8 caracteres!",
        "string.max": "A senha deve ter no máximo 25 caracteres!",
        "any.required": "O campo senha é obrigatório!"
      }),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ message: error.details.map((err) => err.message) });
    }


    try {
      const usuario = await UsuarioService.login(email_usuario, pass_usuario);
      
      const token = jwt.sign(
        { usuario },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
  

      res.status(200).json({ message: 'Login bem-sucedido',token });

    } catch (error) {
      console.log(error)
      res.status(500).json({ message: (error as Error).message });
    }
  }

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
        return res.status(400).json({ message: error.details.map((err) => err.message) });

      } 

      res.status(200).json({ message: 'Usuário encontrado', usuario_req });

    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  async buscarporEmail(req, res) {
    try {
      const schema = Joi.object({
        email_usuario: Joi.string().email().max(120).messages({
          "string.email": "O email deve ser válido!",
          "string.max": "O email deve ter no máximo 120 caracteres!",
        }),
        id_user: Joi.number().integer().messages({
          "number.base": "Id do Usuário deve ser um número",
          "number.integer": "O id do Usuário deve ser um número inteiro!",
          "any.required": "O id do Usuário é obrigatório!"
        })
      }).or('id_user', 'email_usuario').messages({
        'object.missing': 'É necessário informar o id_usuario ou o email_usuario'
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      const usuario = await UsuarioService.buscar({email_usuario: value.email_usuario,id_usuario: value.id_user});
      if (!usuario) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }
      const token = jwt.sign(
        { usuario }, // payload
        SECRET_KEY,
        { expiresIn: '1h' } // expiração
      );

      res.status(200).json({ message: 'Usuário encontrado', token });

    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  
  async resetPass(req, res) {
    try {
      const { pass_usuario, confirm_pass, id_token } = req.body;

      const schema = Joi.object({
        pass_usuario: Joi.string().min(8).max(25).required().messages({
          "string.min": "A senha deve ter pelo menos 6 caracteres!",
          "string.max": "A senha deve ter no máximo 25 caracteres!",
          "any.required": "O campo senha é obrigatório!"
        }),
        confirm_pass: Joi.string().min(8).max(25).required().messages({
          "string.min": "A confirmação de senha deve ter pelo menos 6 caracteres!",
          "string.max": "A confirmação de senha deve ter no máximo 25 caracteres!",
          "any.required": "O campo confirmação de senha é obrigatório!"
        }),
        id_token: Joi.string().max(64).required().messages({
          "string.max": "O token deve ter no máximo 64 caracteres!",
          "any.required": "O id do Token é obrigatório!"
        }),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      if (pass_usuario != confirm_pass) {
        return res.status(404).json({ message: 'Senha e confirmação devem ser iguais!' });
      }

      const token = await TokenService.buscar(id_token);
      if (!token || !token?.id_user.id_usuario) {
        return res.status(404).json({ message: "Token não encontrado" });
      }

      const usuario = await UsuarioService.buscar({id_usuario: token.id_user.id_usuario});

      if (!usuario || !usuario.id_usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
      }
      await TokenService.verificar(token.id_token,usuario.id_usuario)
      
      await TokenService.atualizar(token);

      usuario.pass_usuario = pass_usuario;
      await UsuarioService.resetPass(usuario);


      res.status(201).json({ message: 'Senha alterada com Sucesso' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  
}
