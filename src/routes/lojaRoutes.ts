// src/routes/usuarioRoutes.ts
import { Router } from 'express';
import { LojaController } from '../controllers/lojaController';

const router = Router();
const lojaController = new LojaController();

router.post('/id_user', async (req, res) => {
    try {
      await lojaController.buscar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar Loja', error });
    }
  });
  router.post('/criar', async (req, res) => {
    try {
      await lojaController.criar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar Loja', error });
    }
  });
export default router;
