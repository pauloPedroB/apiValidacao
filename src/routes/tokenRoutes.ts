// src/routes/usuarioRoutes.ts
import { Router } from 'express';
import { TokenController } from '../controllers/tokenController';

const router = Router();
const tokenController = new TokenController();

router.get('/validar/:id_token/:id_user', async (req, res) => {
  try {
    await tokenController.atualizar(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao validar Token', error });
  }
});

router.post('/criar', async (req, res) => {
  try {
    await tokenController.criar(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar token', error });
  }
});

export default router;
