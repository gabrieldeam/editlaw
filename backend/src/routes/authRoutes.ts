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
    logoutUser
} from '../controllers/authController';
import passport from 'passport';
import { googleLoginSuccess } from '../controllers/authGoogle';

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
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: Email já registrado.
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
 *       401:
 *         description: Senha incorreta.
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
 *     summary: Envia um email para redefinição de senha.
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
 *     responses:
 *       200:
 *         description: Email de redefinição enviado.
 */
router.post('/reset-password', resetPassword);

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
 *                 type: number
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
 *                 type: number
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
 *     summary: Autenticação via Google
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
 *     summary: Callback após autenticação com Google
 *     tags: [Autenticação]
 *     description: Callback chamado pelo Google após autenticação.
 *     responses:
 *       200:
 *         description: Autenticação via Google bem-sucedida.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: number
 *                   description: O ID do usuário.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: O nome do usuário.
 *                   example: "John Doe"
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
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefine a senha de um usuário.
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
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               newPassword:
 *                 type: string
 *                 description: A nova senha escolhida pelo usuário.
 *                 example: "novaSenha123!"
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Senha redefinida com sucesso."
 *       400:
 *         description: Token inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido ou expirado."
 */
router.post('/reset-password', confirmResetPassword);

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

export default router;
