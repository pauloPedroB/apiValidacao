// src/controllers/usuarioController.ts
import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuarioService';
import Joi from "joi";



export class UsuarioController {
  // Método para criar um novo usuário
async criar(req, res) {
  try {
      const { email_usuario, pass_usuario } = req.body;

      const schema = Joi.object({
        email_usuario: Joi.string().email().max(120).required().messages({
          "string.email": "O email deve ser válido!",
          "string.max": "O email deve ter no máximo 120 caracteres!",
          "any.required": "O campo email é obrigatório!"
        }),
        pass_usuario: Joi.string().min(6).max(25).required().messages({
          "string.min": "A senha deve ter pelo menos 6 caracteres!",
          "string.max": "A senha deve ter no máximo 25 caracteres!",
          "any.required": "O campo senha é obrigatório!"
        }),
      });
    
      const { error, value } = schema.validate(req.body, { abortEarly: false });
    
      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
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
        "string.min": "A senha deve ter pelo menos 6 caracteres!",
        "string.max": "A senha deve ter no máximo 25 caracteres!",
        "any.required": "O campo senha é obrigatório!"
      }),
    });
  
    const { error, value } = schema.validate(req.body, { abortEarly: false });
  
    if (error) {
      return res.status(400).json({ message: error.details.map((err) => err.message) });
    }

  
    try {
      const usuario = await UsuarioService.login(email_usuario,pass_usuario);
  
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
      if(!usuario){
        return res.status(400).json({ message: 'Usuário não encontrado'});
      }
  
      res.status(200).json({ message: 'Usuário encontrado', usuario });
  
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }


  async verificar(req, res) {
    const { email_usuario } = req.params;
    try {
      const schema = Joi.object({
        email_usuario: Joi.string().email().max(120).required().messages({
          "string.email": "O email deve ser válido!",
          "string.max": "O email deve ter no máximo 120 caracteres!",
          "any.required": "O campo email é obrigatório!"
        }),
      });
    
      const { error, value } = schema.validate(req.params, { abortEarly: false });
    
      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }
      console.log(email_usuario)
      const usuario = await UsuarioService.buscarPorEmail(email_usuario);

      if(!usuario){
        return res.status(500).json({ message: "Usuário não encontrado" });
      }

      const verificado = await UsuarioService.verificar(usuario);
      

      res.status(200).json({ message: 'Usuario Validado', verificado });
  
    } catch (error) {

      res.status(500).json({ message: (error as Error).message });
    }
  }
  
}
