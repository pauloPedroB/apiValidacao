// src/routes/usuarioRoutes.ts
import { Router } from 'express';
import { Produto_LojaController } from '../controllers/produto_lojaController';

import { authMiddleware } from '../middleware/authmiddleware';
import { dadosMiddleware } from '../middleware/dadosmiddleware';

const router = Router();
const produto_lojaController = new Produto_LojaController();

router.post('/buscar', async (req, res) => {
    try {
      await produto_lojaController.buscar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar Produto', error });
    }
  });
  router.post('/listarProdutosLoja',authMiddleware, dadosMiddleware, async (req, res) => {
    try {
      await produto_lojaController.listarProdutosLoja(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar Produto', error });
    }
  });
  router.post('/listar', async (req, res) => {
    try {
      await produto_lojaController.listar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar Produto', error });
    }
  });
  router.post('/criar',authMiddleware, dadosMiddleware, async (req, res) => {
    try {
      await produto_lojaController.criar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar Produto', error });
    }
  });

  router.delete('/excluir',authMiddleware, dadosMiddleware, async (req, res) => {
    try {
      await produto_lojaController.excluir(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir Produto', error });
    }
  });
export default router;
