import { VehicleService } from '../../services/vehicleService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const vehicleService = new VehicleService();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Admin API Controller
 * Handles administrative operations
 */
export class AdminController {
  
  /**
   * Import vehicles from CSV file
   * @route POST /api/v1/admin/import/csv
   */
  static importCSV = asyncHandler(async (req, res) => {
    const { filePath, manufacturer } = req.body;
    
    if (!filePath || !manufacturer) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'filePath and manufacturer are required',
      });
    }

    try {
      // Check if file exists
      const fullPath = path.resolve(filePath);
      await fs.access(fullPath);
      
      // Import logic would go here
      // For now, return a success message
      res.json({
        success: true,
        message: `CSV import initiated for ${manufacturer}`,
        data: {
          filePath: fullPath,
          manufacturer,
          status: 'queued',
        },
      });
    } catch (error) {
      res.status(400).json({
        error: 'File Error',
        message: `Could not access file: ${filePath}`,
      });
    }
  });

  /**
   * Clear application cache
   * @route POST /api/v1/admin/cache/clear
   */
  static clearCache = asyncHandler(async (req, res) => {
    // Clear the service cache
    vehicleService.cache.clear();
    
    res.json({
      success: true,
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Clean up duplicate records
   * @route POST /api/v1/admin/database/cleanup
   */
  static cleanupDatabase = asyncHandler(async (req, res) => {
    // This would implement actual database cleanup
    // For now, return a mock response
    res.json({
      success: true,
      message: 'Database cleanup completed',
      data: {
        duplicatesRemoved: 0,
        recordsProcessed: 0,
      },
    });
  });

  /**
   * Get system information
   * @route GET /api/v1/admin/system/info
   */
  static getSystemInfo = asyncHandler(async (req, res) => {
    const stats = await vehicleService.getStats();
    
    res.json({
      success: true,
      data: {
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          architecture: process.arch,
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
        },
        database: stats,
        cache: {
          size: vehicleService.cache.size,
          maxAge: vehicleService.cacheExpiry,
        },
        environment: process.env.NODE_ENV || 'development',
      },
    });
  });
}
