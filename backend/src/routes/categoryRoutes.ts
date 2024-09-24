import { Router } from 'express';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  upload,
} from '../controllers/categoryController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: O ID gerado automaticamente da categoria.
 *         name:
 *           type: string
 *           description: Nome da categoria.
 *         description:
 *           type: string
 *           description: Descrição da categoria.
 *         image1:
 *           type: string
 *           description: URL da primeira imagem da categoria.
 *         image2:
 *           type: string
 *           description: URL da segunda imagem da categoria.
 *         image3:
 *           type: string
 *           description: URL da terceira imagem da categoria.
 *       example:
 *         id: "e9d8f8b7-d787-45e2-bc2b-8bfdf7b3e6c7"
 *         name: "Eletrônicos"
 *         description: "Categoria para produtos eletrônicos."
 *         image1: "https://example.com/image1.jpg"
 *         image2: "https://example.com/image2.jpg"
 *         image3: "https://example.com/image3.jpg"
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Category]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image1:
 *                 type: string
 *                 format: binary
 *               image2:
 *                 type: string
 *                 format: binary
 *               image3:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso.
 *       500:
 *         description: Erro ao criar a categoria.
 */
router.post('/categories', upload, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     tags: [Category]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da categoria a ser atualizada.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image1:
 *                 type: string
 *                 format: binary
 *               image2:
 *                 type: string
 *                 format: binary
 *               image3:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso.
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro ao atualizar a categoria.
 */
router.put('/categories/:id', upload, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Deleta uma categoria
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da categoria a ser deletada.
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso.
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro ao deletar a categoria.
 */
router.delete('/categories/:id', deleteCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retorna todas as categorias
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Lista de todas as categorias.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erro ao buscar as categorias.
 */
router.get('/categories', getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Retorna uma categoria específica
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da categoria a ser retornada.
 *     responses:
 *       200:
 *         description: Categoria encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro ao buscar a categoria.
 */
router.get('/categories/:id', getCategoryById);

export default router;
