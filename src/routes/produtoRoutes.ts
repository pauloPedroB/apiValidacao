// src/routes/usuarioRoutes.ts
import { Router } from 'express';
import { ProdutoController } from '../controllers/produtoController';

const router = Router();
const produtoController = new ProdutoController();

router.post('/buscar', async (req, res) => {
    try {
      await produtoController.buscar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar Produto', error });
    }
  });
  router.post('/listar', async (req, res) => {
    try {
      await produtoController.buscarProdutos(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao encontrar Produto', error });
    }
  });
  router.post('/criar', async (req, res) => {
    try {
      await produtoController.criar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar Produto', error });
    }
  });
  router.post('/editar', async (req, res) => {
    try {
      await produtoController.editar(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao editar Produto', error });
    }
  });
  router.delete('/excluir', async (req, res) => {
    try {
      await produtoController.excluir(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao editar Produto', error });
    }
  });
export default router;
