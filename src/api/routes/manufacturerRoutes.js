import express from 'express';
import { ManufacturerController } from '../controllers/manufacturerController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Manufacturer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique manufacturer identifier
 *         name:
 *           type: string
 *           description: Manufacturer name
 *         slug:
 *           type: string
 *           description: URL-friendly manufacturer name
 */

/**
 * @swagger
 * /api/v1/manufacturers:
 *   get:
 *     summary: Get all manufacturers
 *     tags: [Manufacturers]
 *     responses:
 *       200:
 *         description: List of all manufacturers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Manufacturer'
 *                 total:
 *                   type: integer
 */
router.get('/', ManufacturerController.getAllManufacturers);

/**
 * @swagger
 * /api/v1/manufacturers/{identifier}/stats:
 *   get:
 *     summary: Get manufacturer statistics
 *     tags: [Manufacturers]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Manufacturer ID, slug, or name
 *     responses:
 *       200:
 *         description: Manufacturer statistics
 *       404:
 *         description: Manufacturer not found
 */
router.get('/:identifier/stats', ManufacturerController.getManufacturerStats);

/**
 * @swagger
 * /api/v1/manufacturers/{identifier}:
 *   get:
 *     summary: Get manufacturer by ID, slug, or name
 *     tags: [Manufacturers]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Manufacturer ID, slug, or name
 *     responses:
 *       200:
 *         description: Manufacturer details with sample models
 *       404:
 *         description: Manufacturer not found
 */
router.get('/:identifier', ManufacturerController.getManufacturerById);

export default router;
