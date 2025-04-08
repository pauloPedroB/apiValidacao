// src/routes/usuarioRoutes.ts
import { Router } from 'express';
import { ClienteController } from '../controllers/clienteController';

const router = Router();
const clienteController = new ClienteController();

router.post('/id_user', async (req, res) => {
    try {
      await clienteController.buscar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar cliente', error });
    }
  });
  router.post('/criar', async (req, res) => {
    try {
      await clienteController.criar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar Cliente', error });
    }
  });
export default router;
