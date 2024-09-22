import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import authRoutes from './routes/authRoutes';
import { prisma } from './prismaClient';

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
      title: 'EditLaw API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Aponta também para os controladores
};


const swaggerSpec = swaggerJsdoc(options);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger setup usando o spec gerado pelo swaggerJsdoc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);

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

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
