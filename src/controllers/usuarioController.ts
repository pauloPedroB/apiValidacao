// src/controllers/usuarioController.ts
import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuarioService';
import Joi from "joi";
import { TokenService } from '../services/tokenService';



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
      const usuario = await UsuarioService.buscarPorEmail(email_usuario);

      if (usuario) {
        return res.status(404).json({ message: 'Email já cadastrado!' });
      }

      const typeUser = null
      // Passa o objeto com os dados do novo usuário para o método de salvar
      const result = await UsuarioService.salvar({
        email_usuario,
        pass_usuario: pass_usuario,
        typeUser
      });

      const novo_usuario = await UsuarioService.buscarPorEmail(email_usuario);

      res.status(201).json({ message: 'Usuário criado com sucesso', novo_usuario });
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

      res.status(200).json({ message: 'Login bem-sucedido', usuario });

    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async buscarPorEmail(req, res) {
    const { email_usuario, } = req.body;
    try {
      const schema = Joi.object({
        email_usuario: Joi.string().email().max(120).required().messages({
          "string.email": "O email deve ser válido!",
          "string.max": "O email deve ter no máximo 120 caracteres!",
          "any.required": "O campo email é obrigatório!"
        }),

      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }

      const usuario = await UsuarioService.buscarPorEmail(email_usuario);
      if (!usuario) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }

      res.status(200).json({ message: 'Usuário encontrado', usuario });

    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  async buscarPorId(req, res) {
    const { id_user, } = req.body;
    try {
      const schema = Joi.object({
        id_user: Joi.number().integer().required().messages({
          "any.required": "Entre no sistema para conseguirmos validar seu usuário!",
          "number.base": "Entre no sistema para conseguirmos validar seu usuário!",
          "number.integer": "O id do usuário deve ser um número inteiro!"
      }),

      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }

      const usuario = await UsuarioService.buscarPorId(id_user);
      if (!usuario) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }

      res.status(200).json({ message: 'Usuário encontrado', usuario });

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

      const usuario = await UsuarioService.buscarPorId(token.id_user.id_usuario);

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
  async atualizarTipo(req, res) {
    try {
      const { typeUser, id_user } = req.body;

      const schema = Joi.object({
          id_user: Joi.number().integer().required().messages({
            "any.required": "Entre no sistema para conseguirmos validar seu usuário!",
            "number.base": "Entre no sistema para conseguirmos validar seu usuário!",
            "number.integer": "O id do usuário deve ser um número inteiro!"
        }),
          typeUser: Joi.number().integer().required().messages({
            "any.required": "Entre no sistema para conseguirmos validar seu usuário!",
            "number.base": "Entre no sistema para conseguirmos validar seu usuário!",
            "number.integer": "O id do usuário deve ser um número inteiro!"
        }),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      
      const usuario = await UsuarioService.buscarPorId(id_user);

      if (!usuario || !usuario.id_usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
      }
      usuario.typeUser = typeUser;
      await UsuarioService.atualizarTipo(usuario);


      res.status(201).json({ message: 'Tipo de usuário alterado com Sucesso' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }


}
