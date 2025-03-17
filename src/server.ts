// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuarioRoutes';
import tokenRoutes from './routes/tokenRoutes';


dotenv.config();

const app = express();

app.use(express.json());
app.use('/usuarios', usuarioRoutes);
app.use('/tokens', tokenRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
