// src/routes/usuarioRoutes.ts
import { Router } from 'express';
import { ProdutoController } from '../controllers/produtoController';

import { authMiddleware } from '../middleware/authmiddleware';

const router = Router();
const produtoController = new ProdutoController();

router.post('/buscar', async (req, res) => {
    try {
      await produtoController.buscar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar Produto', error });
    }
  });
  router.get('/categorias', async (req, res) => {
    try {
      await produtoController.listar_categorias(res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar Categorias', error });
    }
  });
  router.post('/listar',authMiddleware, async (req, res) => {
    try {
      await produtoController.buscarProdutos(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar Produto', error });
    }
  });
  router.post('/criar',authMiddleware, async (req, res) => {
    try {
      await produtoController.criar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar Produto', error });
    }
  });
  router.post('/editar',authMiddleware, async (req, res) => {
    try {
      await produtoController.editar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao editar Produto', error });
    }
  });
  router.delete('/excluir',authMiddleware, async (req, res) => {
    try {
      await produtoController.excluir(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao editar Produto', error });
    }
  });
export default router;
