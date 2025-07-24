import express from 'express';
import { AdminController } from '../controllers/adminController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative operations (protected endpoints)
 */

/**
 * @swagger
 * /api/v1/admin/import/csv:
 *   post:
 *     summary: Import vehicles from CSV file
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filePath:
 *                 type: string
 *                 description: Path to CSV file
 *               manufacturer:
 *                 type: string
 *                 description: Manufacturer name for the import
 *     responses:
 *       200:
 *         description: Import completed successfully
 *       400:
 *         description: Invalid request parameters
 */
router.post('/import/csv', AdminController.importCSV);

/**
 * @swagger
 * /api/v1/admin/cache/clear:
 *   post:
 *     summary: Clear application cache
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 */
router.post('/cache/clear', AdminController.clearCache);

/**
 * @swagger
 * /api/v1/admin/database/cleanup:
 *   post:
 *     summary: Clean up duplicate records
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Database cleanup completed
 */
router.post('/database/cleanup', AdminController.cleanupDatabase);

/**
 * @swagger
 * /api/v1/admin/system/info:
 *   get:
 *     summary: Get system information
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: System information
 */
router.get('/system/info', AdminController.getSystemInfo);

export default router;
