import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../prismaClient';
import jwt from 'jsonwebtoken';

// Configuração do Passport.js com Google OAuth 2.0
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: "http://localhost:5000/api/auth/google/callback" // Backend processa a resposta
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.emails?.[0].value }
    });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = await prisma.user.create({
      data: {
        email: profile.emails?.[0].value || '',
        password: '', 
        name: profile.displayName || 'Usuário Google'
      }
    });

    return done(null, newUser);
  } catch (error) {
    return done(error, false);
  }
}));

// Serializar o usuário na sessão
passport.serializeUser((user: any, done) => {
  done(null, user.id); // 'id' agora é uma string (UUID)
});

// Desserializar o usuário da sessão
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } }); // 'id' agora é uma string (UUID)
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Função para gerar o token JWT
const generateToken = (userId: string) => { // userId agora é uma string
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

// Rota de login com sucesso após autenticação com o Google
export const googleLoginSuccess = (req: any, res: any) => {
  const token = generateToken(req.user.id); // 'id' agora é uma string (UUID)

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 2592000000,
  });

  // Usar a variável de ambiente para o redirecionamento
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // Valor padrão caso FRONTEND_URL não esteja definido

  // Redireciona para a home do frontend
  res.redirect(`${frontendUrl}/`); // Ajusta conforme o seu frontend
};
