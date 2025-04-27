// src/routes/usuarioRoutes.ts
import { Router } from 'express';
import { EnderecoController } from '../controllers/enderecoController';

import { authMiddleware } from '../middleware/authmiddleware';
import { dadosMiddleware } from '../middleware/dadosmiddleware';

const router = Router();
const enderecoController = new EnderecoController();

router.post('/id_user',authMiddleware, dadosMiddleware, async (req, res) => {
    try {
      await enderecoController.buscar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar Endereco', error });
    }
  });
  router.post('/criar',authMiddleware, dadosMiddleware, async (req, res) => {
    try {
      await enderecoController.criar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar Endereco', error });
    }
  });
  router.post('/editar',authMiddleware, dadosMiddleware, async (req, res) => {
    try {
      await enderecoController.editar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao editar Endereco', error });
    }
  });
export default router;
