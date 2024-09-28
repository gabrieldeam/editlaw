// src/routes/pageRoutes.ts

import express from 'express';
import {
  getAllPages,
  getPageById,
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
 * /api/pages:
 *   get:
 *     summary: Obter todas as páginas com paginação e filtro opcional por documentId
 *     tags: [Pages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página para paginação
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: documentId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar páginas por ID do documento associado
 *     responses:
 *       200:
 *         description: Lista de páginas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Page'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalDocuments:
 *                   type: integer
 *       500:
 *         description: Erro ao buscar páginas
 */
router.get('/pages', getAllPages);

/**
 * @swagger
 * /api/pages/{id}:
 *   get:
 *     summary: Obter uma página específica por ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da página a ser obtida
 *     responses:
 *       200:
 *         description: Página encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       404:
 *         description: Página não encontrada
 *       500:
 *         description: Erro ao buscar página
 */
router.get('/pages/:id', getPageById);

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
