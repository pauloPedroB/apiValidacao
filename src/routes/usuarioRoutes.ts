// src/routes/usuarioRoutes.ts
import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';

const router = Router();
const usuarioController = new UsuarioController();

// Definindo as rotas corretamente com async/await
router.post('/criar', async (req, res) => {
  try {
    await usuarioController.criar(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
});

router.post('/login', async (req, res) => {
    try {
      await usuarioController.login(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar usuário', error });
    }
  });

router.post('/buscar', async (req, res) => {
  try {
    await usuarioController.buscarPorEmail(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao encontrar usuário', error });
  }
});

router.post('/id', async (req, res) => {
  try {
    await usuarioController.buscarPorId(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao encontrar usuário', error });
  }
});

router.post('/resetPass', async (req, res) => {
  try {
    await usuarioController.resetPass(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao resetar senha', error });
  }
});




export default router;
