// src/routes/pageRoutes.ts

import express from 'express';
import {
  getPagesByDocumentId,
  getPagesByPurchasedDocumentId,
  createPage,
  updatePage,
  deletePage,
} from '../controllers/pageController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pages
 *   description: Operações relacionadas a Páginas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Page:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da página
 *         documentId:
 *           type: string
 *           format: uuid
 *           description: ID do documento ao qual a página pertence
 *         pageNumber:
 *           type: integer
 *           description: Número da página dentro do documento
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora de criação da página
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora da última atualização da página
 */

/**
 * @swagger
 * /api/pages/document/{documentId}:
 *   get:
 *     summary: Obter todas as páginas pelo ID do documento
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do documento para o qual as páginas serão retornadas
 *     responses:
 *       200:
 *         description: Lista de páginas associadas ao documento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Page'
 *       404:
 *         description: Nenhuma página encontrada para o documento especificado
 *       500:
 *         description: Erro ao buscar páginas
 */
router.get('/pages/document/:documentId', getPagesByDocumentId);

/**
 * @swagger
 * components:
 *   schemas:
 *     Page:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da página
 *         documentId:
 *           type: string
 *           format: uuid
 *           description: ID do documento ao qual a página pertence
 *         pageNumber:
 *           type: integer
 *           description: Número da página dentro do documento
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora de criação da página
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora da última atualização da página
 */

/**
 * @swagger
 * /api/pages/document/{documentId}:
 *   get:
 *     summary: Obter todas as páginas pelo ID do documento
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do documento para o qual as páginas serão retornadas
 *     responses:
 *       200:
 *         description: Lista de páginas associadas ao documento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Page'
 *       404:
 *         description: Nenhuma página encontrada para o documento especificado
 *       500:
 *         description: Erro ao buscar páginas
 */
router.get('/pages/purchasedDocument/:purchasedDocumentId', getPagesByPurchasedDocumentId);

/**
 * @swagger
 * /api/pages:
 *   post:
 *     summary: Criar uma nova página
 *     tags: [Pages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentId
 *               - pageNumber
 *             properties:
 *               documentId:
 *                 type: string
 *                 format: uuid
 *                 description: ID do documento ao qual a página pertence
 *               pageNumber:
 *                 type: integer
 *                 description: Número da página dentro do documento
 *     responses:
 *       201:
 *         description: Página criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       400:
 *         description: Dados inválidos ou página duplicada
 *       500:
 *         description: Erro ao criar página
 */
router.post('/pages', createPage);

/**
 * @swagger
 * /api/pages/{id}:
 *   put:
 *     summary: Atualizar uma página existente
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da página a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentId:
 *                 type: string
 *                 format: uuid
 *                 description: Novo ID do documento ao qual a página pertence
 *               pageNumber:
 *                 type: integer
 *                 description: Novo número da página dentro do documento
 *     responses:
 *       200:
 *         description: Página atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       400:
 *         description: Dados inválidos ou página duplicada
 *       404:
 *         description: Página não encontrada
 *       500:
 *         description: Erro ao atualizar página
 */
router.put('/pages/:id', updatePage);

/**
 * @swagger
 * /api/pages/{id}:
 *   delete:
 *     summary: Deletar uma página
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da página a ser deletada
 *     responses:
 *       204:
 *         description: Página deletada com sucesso
 *       404:
 *         description: Página não encontrada
 *       500:
 *         description: Erro ao deletar página
 */
router.delete('/pages/:id', deletePage);

export default router;
