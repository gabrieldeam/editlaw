import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';  // Import para gerenciar caminhos de arquivos
import fs from 'fs';       // Import para manipulação de arquivos (exclusão de imagens)
import authRoutes from './routes/authRoutes';
import billingRoutes from './routes/billingRoutes';
import categoryRoutes from './routes/categoryRoutes';
import creditCardRoutes from './routes/creditCardRoutes';
import documentRoutes from './routes/documentRoutes';
import pageRoutes from './routes/pageRoutes';
import elementRoutes from './routes/elementRoutes';
import couponRoutes from './routes/couponRoutes';
import processPaymentRoute from './routes/process_payment';
import purchasedDocumentRoutes from './routes/purchasedDocumentRoutes';
import packageRoutes from './routes/packageRoutes';
import { prisma } from './prismaClient';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Configurar o Passport.js
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'editlaw API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Aponta para os controladores e rotas
};

const swaggerSpec = swaggerJsdoc(options);

// Middleware CORS para permitir localhost:3000
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // Caso esteja lidando com cookies ou autenticação
}));
app.use(express.json());
app.use(cookieParser());

// Servir arquivos estáticos da pasta 'upload'
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Swagger setup usando o spec gerado pelo swaggerJsdoc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', billingRoutes);
app.use('/api', categoryRoutes);
app.use('/api', documentRoutes);
app.use('/api', pageRoutes);
app.use('/api', elementRoutes);
app.use('/api', couponRoutes);
app.use('/api', creditCardRoutes);
app.use('/api', processPaymentRoute);
app.use('/api', purchasedDocumentRoutes);
app.use('/api', packageRoutes);

// Testar a Conexão com o Banco de Dados
async function testDBConnection() {
  try {
    await prisma.$connect();
    console.log('Conectado ao PostgreSQL com Prisma');
  } catch (err) {
    console.error('Não foi possível conectar ao PostgreSQL:', err);
  }
}

testDBConnection();

// Rota de Teste
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'API do EditLaw funcionando e conectada ao PostgreSQL via Prisma!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

// Criar a pasta 'upload' se não existir
const uploadDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
