// src/routes/usuarioRoutes.ts
import { Router } from 'express';
import { ClienteController } from '../controllers/clienteController';

const router = Router();
const clienteController = new ClienteController();



export default router;
