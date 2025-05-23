// src/routes/usuarioRoutes.ts
import { Router } from 'express';
import { LojaController } from '../controllers/lojaController';
import { authMiddleware } from '../middleware/authmiddleware';



const router = Router();
const lojaController = new LojaController();

router.post('/id_user', authMiddleware, async (req, res) => {
    try {
      await lojaController.buscar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar Loja', error });
    }
  });
  router.post('/criar', authMiddleware, async (req, res) => {
    try {
      await lojaController.criar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar Loja', error });
    }
  });
export default router;
