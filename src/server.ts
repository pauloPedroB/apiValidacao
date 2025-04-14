// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuarioRoutes';
import tokenRoutes from './routes/tokenRoutes';
import clienteRoutes from './routes/clienteRoutes';
import lojaRoutes from './routes/lojaRoutes';
import enderecoRoutes from './routes/enderecoRoutes';
import produtoRoutes from './routes/produtoRoutes';




dotenv.config();

const app = express();


app.use(express.json());
app.use('/usuarios', usuarioRoutes);
app.use('/tokens', tokenRoutes);
app.use('/clientes', clienteRoutes);
app.use('/lojas', lojaRoutes);
app.use('/enderecos', enderecoRoutes);
app.use('/produtos', produtoRoutes);





const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
