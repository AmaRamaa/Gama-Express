import { VehicleService } from '../../services/vehicleService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const vehicleService = new VehicleService();

/**
 * Vehicle API Controller
 * Handles HTTP requests for vehicle-related operations
 */
export class VehicleController {
  
  /**
   * Search vehicles with advanced filtering
   * @route GET /api/v1/vehicles/search
   */
  static searchVehicles = asyncHandler(async (req, res) => {
    const {
      q,
      manufacturer,
      year_from,
      year_to,
      sort_by,
      sort_order,
      page,
      limit
    } = req.query;

    const searchOptions = {
      query: q,
      manufacturer,
      yearFrom: year_from ? parseInt(year_from) : undefined,
      yearTo: year_to ? parseInt(year_to) : undefined,
      sortBy: sort_by || 'manufacturer',
      sortOrder: sort_order || 'asc',
      page: page ? parseInt(page) : 1,
      limit: limit ? Math.min(parseInt(limit), 100) : 20, // Max 100 per page
    };

    const result = await vehicleService.searchVehicles(searchOptions);

    res.json({
      success: true,
      data: result.data,
      pagination: {
        currentPage: result.pagination.currentPage,
        totalPages: result.pagination.totalPages,
        totalItems: result.pagination.totalItems,
        itemsPerPage: result.pagination.itemsPerPage,
        hasNextPage: result.pagination.hasNextPage,
        hasPrevPage: result.pagination.hasPrevPage,
      },
      filters: {
        query: searchOptions.query,
        manufacturer: searchOptions.manufacturer,
        yearRange: {
          from: searchOptions.yearFrom,
          to: searchOptions.yearTo,
        },
      },
    });
  });

  /**
   * Get all vehicles with pagination
   * @route GET /api/v1/vehicles
   */
  static getAllVehicles = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, sort_by = 'manufacturer', sort_order = 'asc' } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 100),
      sortBy: sort_by,
      sortOrder: sort_order,
    };

    const result = await vehicleService.searchVehicles(options);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Get vehicle by ID
   * @route GET /api/v1/vehicles/:id
   */
  static getVehicleById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Vehicle ID is required',
      });
    }

    const vehicle = await vehicleService.getVehicleById(id);

    if (!vehicle) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Vehicle not found',
      });
    }

    res.json({
      success: true,
      data: vehicle,
    });
  });

  /**
   * Get models by manufacturer
   * @route GET /api/v1/vehicles/manufacturer/:manufacturer/models
   */
  static getModelsByManufacturer = asyncHandler(async (req, res) => {
    const { manufacturer } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!manufacturer) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Manufacturer is required',
      });
    }

    const models = await vehicleService.getModelsByManufacturer(
      manufacturer, 
      parseInt(page), 
      parseInt(limit)
    );

    res.json({
      success: true,
      data: {
        manufacturer,
        models: models.data,
        total: models.total,
      },
      pagination: models.pagination,
    });
  });

  /**
   * Get models by year range
   * @route GET /api/v1/vehicles/years/:fromYear/:toYear
   */
  static getModelsByYearRange = asyncHandler(async (req, res) => {
    const { fromYear, toYear } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const from = parseInt(fromYear);
    const to = parseInt(toYear);

    if (isNaN(from) || isNaN(to) || from > to) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Valid year range is required (fromYear <= toYear)',
      });
    }

    const models = await vehicleService.getModelsByYearRange(
      from, 
      to, 
      parseInt(page), 
      parseInt(limit)
    );

    res.json({
      success: true,
      data: {
        yearRange: { from, to },
        models: models.data,
        total: models.total,
      },
      pagination: models.pagination,
    });
  });

  /**
   * Get database statistics
   * @route GET /api/v1/vehicles/stats
   */
  static getStats = asyncHandler(async (req, res) => {
    const stats = await vehicleService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  });
}
