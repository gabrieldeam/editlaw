import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../prismaClient';
import jwt from 'jsonwebtoken';

// Configuração do Passport.js com Google OAuth 2.0
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Verificar se o usuário já existe no banco de dados
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.emails?.[0].value }
    });

    if (existingUser) {
      return done(null, existingUser);
    }

    // Se não existir, criar novo usuário com o campo 'name'
    const newUser = await prisma.user.create({
      data: {
        email: profile.emails?.[0].value || '',
        password: '', // Padrão vazio para Google, pois não utilizamos senha
        name: profile.displayName || 'Usuário Google' // Adiciona o nome ou um valor padrão
      }
    });

    return done(null, newUser);
  } catch (error) {
    return done(error, false);
  }
}));


// Serializar o usuário na sessão
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Desserializar o usuário da sessão
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Função para gerar o token JWT
const generateToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

// Rota de login com sucesso após autenticação com o Google
export const googleLoginSuccess = (req: any, res: any) => {
  const token = generateToken(req.user.id);
  res.status(200).json({ message: 'Login com Google bem-sucedido!', token });
};
