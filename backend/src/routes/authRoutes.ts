import { Router } from 'express';
import { 
    registerUser, 
    loginUser, 
    resetPassword, 
    checkAuth, 
    deleteAccount, 
    editEmail, 
    getUserInfo,
    confirmResetPassword,
    logoutUser,
    isAdmin,
    getAllUsers
} from '../controllers/authController';
import passport from 'passport';
import { googleLoginSuccess } from '../controllers/authGoogle';
import { verifyRole } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: Email já registrado ou senha inválida.
 *       500:
 *         description: Erro ao registrar usuário.
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza o login do usuário.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *       400:
 *         description: Usuário não possui senha ou a senha é inválida.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao realizar login.
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Solicita a redefinição de senha enviando um email com um token.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: O email do usuário que deseja redefinir a senha.
 *                 example: "usuario@example.com"
 *     responses:
 *       200:
 *         description: Email de redefinição enviado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao enviar email de redefinição.
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /api/auth/confirm-reset-password:
 *   post:
 *     summary: Redefine a senha do usuário utilizando o token JWT.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: O token JWT enviado por email para verificação.
 *               newPassword:
 *                 type: string
 *                 description: A nova senha escolhida pelo usuário.
 *                 example: "NovaSenha123!"
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso.
 *       400:
 *         description: Token inválido ou expirado ou senha inválida.
 */
router.post('/confirm-reset-password', confirmResetPassword);

/**
 * @swagger
 * /api/auth/check-auth:
 *   get:
 *     summary: Verifica se o usuário está autenticado.
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Autenticado.
 *       401:
 *         description: Token inválido ou expirado.
 */
router.get('/check-auth', checkAuth);

/**
 * @swagger
 * /api/auth/delete-account:
 *   delete:
 *     summary: Exclui a conta do usuário.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: O ID do usuário a ser excluído.
 *     responses:
 *       200:
 *         description: Conta excluída com sucesso.
 *       500:
 *         description: Erro ao excluir conta.
 */
router.delete('/delete-account', deleteAccount);

/**
 * @swagger
 * /api/auth/edit-email:
 *   put:
 *     summary: Atualiza o email do usuário.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               newEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email atualizado com sucesso.
 *       500:
 *         description: Erro ao atualizar email.
 */
router.put('/edit-email', editEmail);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Inicia autenticação via Google.
 *     tags: [Autenticação]
 *     description: Redireciona para a página de login do Google.
 *     responses:
 *       302:
 *         description: Redireciona para o Google.
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback após autenticação com Google.
 *     tags: [Autenticação]
 *     responses:
 *       302:
 *         description: Redireciona o usuário após autenticação com Google.
 */
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleLoginSuccess);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Retorna os dados do usuário autenticado.
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado retornados com sucesso.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao buscar informações do usuário.
 */
router.get('/me', getUserInfo);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Realiza o logout do usuário removendo o token do cookie.
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso.
 *       500:
 *         description: Erro ao realizar o logout.
 */
router.post('/logout', logoutUser);

/**
 * @swagger
 * /api/auth/is-admin:
 *   get:
 *     summary: Verifica se o usuário autenticado é um administrador.
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: O usuário é um administrador.
 *       403:
 *         description: O usuário não é um administrador.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao verificar o papel do usuário.
 */
router.get('/is-admin', isAdmin);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Retorna todos os usuários cadastrados com email, nome e role.
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *       500:
 *         description: Erro ao buscar usuários.
 */
router.get('/users', verifyRole('ADMIN'), getAllUsers);

export default router;
