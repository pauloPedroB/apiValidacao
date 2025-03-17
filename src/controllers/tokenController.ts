// src/controllers/usuarioController.ts
import { Request, Response } from 'express';
import { TokenService } from '../services/tokenService';
import { UsuarioService } from '../services/usuarioService';
import Joi from "joi";



export class TokenController {

    async criar(req, res) 
    {
        const {id_user} = req.body;

        try {
            const schema = Joi.object({
                id_user: Joi.number().integer().required().messages({
                  "number.base": "A idade deve ser um número!",
                  "number.integer": "O id do usuário deve ser um número inteiro!",
                  "any.required": "O campo email é obrigatório!"
                }),
                
              });
            
              const { error, value } = schema.validate(req.body, { abortEarly: false });
            
              if (error) {
                return res.status(400).json({ message: error.details.map((err) => err.message) });
              }
            const usuario = await UsuarioService.buscarPorId(id_user);
            if(!usuario){
                return res.status(404).json({ message: "Usuario Não encontrado" });
            }
            const novo_token = await TokenService.salvar(usuario);

            res.status(201).json({ message: 'Token criado com sucesso',novo_token});

        } catch (error) {
            console.log(error)
        res.status(500).json({ message: (error as Error).message });
        }
    }

    async buscar(req, res) {
        const { id_token, } = req.params;
        try {
            const schema = Joi.object({
                id_token: Joi.string().max(64).required().messages({
                    "string.max": "O token deve ter no máximo 64 caracteres!",
                    "any.required": "O id do Token é obrigatório!"
                }),
                });
            
            const { error, value } = schema.validate(req.params, { abortEarly: false });
        
            if (error) {
                return res.status(400).json({ message: error.details.map((err) => err.message) });
            }
            const token = await TokenService.buscar(id_token);
            if (!token) {
                return res.status(404).json({ message: "Token não encontrado" });
            }
            res.status(200).json({ message: "Token Encontrado com sucesso",token });
        } catch (error) {

            console.log(error)
            res.status(500).json({ message: (error as Error).message });
        }
    }
 
    async atualizar(req, res) {
        const { id_token,id_user } = req.params;
        try {
            const schema = Joi.object({
                id_user: Joi.number().integer().required().messages({
                    "number.base": "A id do Usuário deve ser um número!",
                    "number.integer": "O id do usuário deve ser um número inteiro!",
                    "any.required": "O id do Usuário é obrigatório!"
                }),
                id_token: Joi.string().max(64).required().messages({
                    "string.max": "O token deve ter no máximo 64 caracteres!",
                    "any.required": "O id do Token é obrigatório!"
                }),
                });
            
            const { error, value } = schema.validate(req.params, { abortEarly: false });
        
            if (error) {
                return res.status(400).json({ message: error.details.map((err) => err.message) });
            }
            const token = await TokenService.verificar(id_token,id_user);
            if (!token) {
                return res.status(404).json({ message: "Token não encontrado" });
            }
    
            await TokenService.atualizar(token);
            
            res.status(200).json({ message: "Token atualizado com sucesso",token });
        } catch (error) {

            console.log(error)
            res.status(500).json({ message: (error as Error).message });
        }
    }
    
  
}
