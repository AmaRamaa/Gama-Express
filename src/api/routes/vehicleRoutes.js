import express from 'express';
import { VehicleController } from '../controllers/vehicleController.js';
import { body, query, param } from 'express-validator';
import { validateRequest } from '../middleware/requestLogger.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique vehicle identifier
 *         manufacturer:
 *           type: string
 *           description: Vehicle manufacturer name
 *         model:
 *           type: string
 *           description: Vehicle model name
 *         year:
 *           type: string
 *           description: Vehicle year
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Record creation timestamp
 *     
 *     PaginationResponse:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         totalItems:
 *           type: integer
 *         itemsPerPage:
 *           type: integer
 *         hasNextPage:
 *           type: boolean
 *         hasPrevPage:
 *           type: boolean
 */

/**
 * @swagger
 * /api/v1/vehicles/search:
 *   get:
 *     summary: Search vehicles with advanced filtering
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for manufacturer or model
 *       - in: query
 *         name: manufacturer
 *         schema:
 *           type: string
 *         description: Filter by manufacturer
 *       - in: query
 *         name: year_from
 *         schema:
 *           type: integer
 *         description: Minimum year filter
 *       - in: query
 *         name: year_to
 *         schema:
 *           type: integer
 *         description: Maximum year filter
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [manufacturer, model, year]
 *         description: Sort field
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page (max 100)
 *     responses:
 *       200:
 *         description: Successful search results
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
 *                     $ref: '#/components/schemas/Vehicle'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationResponse'
 */
router.get('/search', VehicleController.searchVehicles);

/**
 * @swagger
 * /api/v1/vehicles:
 *   get:
 *     summary: Get all vehicles with pagination
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [manufacturer, model, year]
 *         description: Sort field
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of vehicles
 */
router.get('/', VehicleController.getAllVehicles);

/**
 * @swagger
 * /api/v1/vehicles/stats:
 *   get:
 *     summary: Get database statistics
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: Database statistics
 */
router.get('/stats', VehicleController.getStats);

/**
 * @swagger
 * /api/v1/vehicles/manufacturer/{manufacturer}/models:
 *   get:
 *     summary: Get models by manufacturer
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: manufacturer
 *         required: true
 *         schema:
 *           type: string
 *         description: Manufacturer name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Models for the specified manufacturer
 */
router.get('/manufacturer/:manufacturer/models', VehicleController.getModelsByManufacturer);

/**
 * @swagger
 * /api/v1/vehicles/years/{fromYear}/{toYear}:
 *   get:
 *     summary: Get models by year range
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: fromYear
 *         required: true
 *         schema:
 *           type: integer
 *         description: Start year
 *       - in: path
 *         name: toYear
 *         required: true
 *         schema:
 *           type: integer
 *         description: End year
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Models within the specified year range
 */
router.get('/years/:fromYear/:toYear', VehicleController.getModelsByYearRange);

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle details
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', VehicleController.getVehicleById);

export default router;
