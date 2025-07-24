import { VehicleService } from '../../services/vehicleService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const vehicleService = new VehicleService();

/**
 * Manufacturer API Controller
 * Handles HTTP requests for manufacturer-related operations
 */
export class ManufacturerController {
  
  /**
   * Get all manufacturers
   * @route GET /api/v1/manufacturers
   */
  static getAllManufacturers = asyncHandler(async (req, res) => {
    const manufacturers = await vehicleService.getManufacturers();

    res.json({
      success: true,
      data: manufacturers,
      total: manufacturers.length,
    });
  });

  /**
   * Get manufacturer by slug or ID
   * @route GET /api/v1/manufacturers/:identifier
   */
  static getManufacturerById = asyncHandler(async (req, res) => {
    const { identifier } = req.params;
    
    if (!identifier) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Manufacturer identifier is required',
      });
    }

    const manufacturers = await vehicleService.getManufacturers();
    const manufacturer = manufacturers.find(m => 
      m.id === identifier || 
      m.slug === identifier || 
      m.name.toLowerCase() === identifier.toLowerCase()
    );

    if (!manufacturer) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Manufacturer not found',
      });
    }

    // Get models for this manufacturer
    const models = await vehicleService.getModelsByManufacturer(manufacturer.name);

    res.json({
      success: true,
      data: {
        ...manufacturer,
        totalModels: models.total,
        models: models.data.slice(0, 10), // Return first 10 models as preview
      },
    });
  });

  /**
   * Get manufacturer statistics
   * @route GET /api/v1/manufacturers/:identifier/stats
   */
  static getManufacturerStats = asyncHandler(async (req, res) => {
    const { identifier } = req.params;
    
    const manufacturers = await vehicleService.getManufacturers();
    const manufacturer = manufacturers.find(m => 
      m.id === identifier || 
      m.slug === identifier || 
      m.name.toLowerCase() === identifier.toLowerCase()
    );

    if (!manufacturer) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Manufacturer not found',
      });
    }

    // Get all models for statistics
    const allModels = await vehicleService.getModelsByManufacturer(manufacturer.name, 1, 1000);
    
    // Calculate statistics
    const years = allModels.data.map(model => parseInt(model.year)).filter(year => !isNaN(year));
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    // Count models by decade
    const modelsByDecade = {};
    years.forEach(year => {
      const decade = Math.floor(year / 10) * 10;
      modelsByDecade[`${decade}s`] = (modelsByDecade[`${decade}s`] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        manufacturer: manufacturer.name,
        totalModels: allModels.total,
        yearRange: {
          min: minYear,
          max: maxYear,
          span: maxYear - minYear,
        },
        modelsByDecade,
        averageModelsPerYear: allModels.total / (maxYear - minYear + 1),
      },
    });
  });
}
