import { Router } from 'express';
import { getAllPackages, getPackageById, createPackage, updatePackage, deletePackage } from '../controllers/packageController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Gerenciamento de pacotes
 */

/**
 * @swagger
 * /packages:
 *   get:
 *     summary: Retorna a lista de pacotes
 *     tags: [Packages]
 *     responses:
 *       200:
 *         description: A lista de pacotes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Package'
 */
router.get('/packages', getAllPackages);

/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Retorna um pacote pelo ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pacote
 *     responses:
 *       200:
 *         description: Dados do pacote.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Pacote não encontrado
 */
router.get('/packages/:id', getPackageById);

/**
 * @swagger
 * /packages:
 *   post:
 *     summary: Cria um novo pacote
 *     tags: [Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Package'
 *     responses:
 *       201:
 *         description: Pacote criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       500:
 *         description: Erro ao criar o pacote
 */
router.post('/packages', createPackage);

/**
 * @swagger
 * /packages/{id}:
 *   put:
 *     summary: Atualiza um pacote pelo ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pacote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Package'
 *     responses:
 *       200:
 *         description: Pacote atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Pacote não encontrado
 */
router.put('/packages/:id', updatePackage);

/**
 * @swagger
 * /packages/{id}:
 *   delete:
 *     summary: Deleta um pacote pelo ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pacote
 *     responses:
 *       204:
 *         description: Pacote deletado com sucesso
 *       404:
 *         description: Pacote não encontrado
 */
router.delete('/packages/:id', deletePackage);

export default router;
