// src/controllers/usuarioController.ts
import { Request, Response } from 'express';
import { ClienteService } from '../services/clienteService';
import Joi from "joi";

export class ClienteController {
  async buscar(req, res) {
    try {
      const schema = Joi.object({
        id_usuario: Joi.number().integer().messages({
          "number.base": "Id do Usuário deve ser um número",
          "number.integer": "O id do Usuário deve ser um número inteiro!"
        }),
        cpf: Joi.string().pattern(/^\d{11}$/).messages({
          "string.pattern.base": "CPF deve conter 11 dígitos numéricos"
        })
      }).or('id_usuario', 'cpf').messages({
        'object.missing': 'É necessário informar o id_usuario ou o cpf'
      });

      const { error, value } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({ message: error.details.map((err) => err.message) });
      }

      const cliente = await ClienteService.buscarCliente({
        id: value.id_usuario,
        cpf: value.cpf
      });

      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      return res.status(200).json({ message: 'Cliente encontrado', cliente });

    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
}
