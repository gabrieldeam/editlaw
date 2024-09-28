// src/routes/documentRoutes.ts

import { Router } from 'express';
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentsWithoutPages,
} from '../controllers/documentController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Operações relacionadas a documentos
 */

/**
 * @swagger
 * /documents/no-pages:
 *   get:
 *     summary: Recuperar todos os documentos sem páginas cadastradas
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: Lista de documentos sem páginas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *                 total:
 *                   type: integer
 *                   description: Total de documentos sem páginas
 *             examples:
 *               application/json:
 *                 value:
 *                   documents: 
 *                     - id: "uuid-do-documento-1"
 *                       title: "Título do Documento 1"
 *                       preco: 100.0
 *                       precoDesconto: null
 *                       descricao: "Descrição do Documento 1"
 *                       autor: "Autor 1"
 *                       image: "/upload/imagem1.jpg"
 *                       categoryId: "uuid-da-categoria-1"
 *                       createdAt: "2024-04-01T00:00:00.000Z"
 *                       updatedAt: "2024-04-01T00:00:00.000Z"
 *                       category:
 *                         id: "uuid-da-categoria-1"
 *                         name: "Categoria 1"
 *                         description: "Descrição da Categoria 1"
 *                   total: 2
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value:
 *                   message: "Erro ao buscar documentos sem páginas"
 *                   error: "Descrição do erro"
 */
router.get('/documents/no-pages', getDocumentsWithoutPages);

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Obter todos os documentos com paginação
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de documentos por página
 *     responses:
 *       200:
 *         description: Lista de documentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalDocuments:
 *                   type: integer
 *       500:
 *         description: Erro no servidor
 */
router.get('/documents', getAllDocuments);

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Obter um documento por ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do documento
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Documento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Documento não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/documents/:id', getDocumentById);

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Criar um novo documento
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - preco
 *               - descricao
 *               - autor
 *             properties:
 *               title:
 *                 type: string
 *               preco:
 *                 type: number
 *               precoDesconto:
 *                 type: number
 *               descricao:
 *                 type: string
 *               autor:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Documento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/documents', createDocument);

/**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     summary: Atualizar um documento existente
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do documento a ser atualizado
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               preco:
 *                 type: number
 *               precoDesconto:
 *                 type: number
 *               descricao:
 *                 type: string
 *               autor:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Documento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Documento não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/documents/:id', updateDocument);

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Deletar um documento
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do documento a ser deletado
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Documento deletado com sucesso
 *       404:
 *         description: Documento não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/documents/:id', deleteDocument);

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         preco:
 *           type: number
 *         precoDesconto:
 *           type: number
 *           nullable: true
 *         descricao:
 *           type: string
 *         autor:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         category:
 *           $ref: '#/components/schemas/Category'
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nome:
 *           type: string
 *         descricao:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         # Adicione outros campos da categoria conforme o seu modelo Prisma
 */

export default router;
