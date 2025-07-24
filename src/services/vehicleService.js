// Vehicle API Service - Main backend service layer
import { supabase } from '../supaBase/supabaseBackend.js';

/**
 * Vehicle Database API Service
 * Handles all database operations for vehicle models
 */
class VehicleService {
  constructor() {
    this.tableName = 'Models'; // Uppercase table name
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get all manufacturers
   * @returns {Promise<Array>} List of unique manufacturers
   */
  async getManufacturers() {
    const cacheKey = 'manufacturers';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('manufacturer')
        .order('manufacturer');

      if (error) throw error;

      // Get unique manufacturers
      const manufacturers = [...new Set(data.map(item => item.manufacturer))]
        .sort()
        .map(name => ({
          id: this.generateId(name),
          name,
          slug: this.createSlug(name)
        }));

      this.setCache(cacheKey, manufacturers);
      return manufacturers;
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      throw new Error(`Failed to fetch manufacturers: ${error.message}`);
    }
  }

  /**
   * Get models by manufacturer
   * @param {string} manufacturer - Manufacturer name
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of models
   */
  async getModelsByManufacturer(manufacturer, options = {}) {
    const {
      limit = 50,
      offset = 0,
      orderBy = 'model',
      orderDirection = 'asc',
      includeYears = true
    } = options;

    const cacheKey = `models_${manufacturer}_${JSON.stringify(options)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .eq('manufacturer', manufacturer)
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;
      
      if (error) throw error;

      const processedData = data.map(model => this.processModelData(model, includeYears));
      
      const result = {
        models: processedData,
        total: count,
        manufacturer,
        pagination: {
          limit,
          offset,
          hasMore: count > offset + limit
        }
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching models by manufacturer:', error);
      throw new Error(`Failed to fetch models for ${manufacturer}: ${error.message}`);
    }
  }

  /**
   * Search vehicles with advanced filtering
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results
   */
  async searchVehicles(searchParams = {}) {
    const {
      query = '',
      manufacturer = '',
      yearFrom = null,
      yearTo = null,
      variant = '',
      limit = 20,
      offset = 0,
      sortBy = 'manufacturer,model',
      sortOrder = 'asc'
    } = searchParams;

    const cacheKey = `search_${JSON.stringify(searchParams)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      let dbQuery = supabase
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (manufacturer) {
        dbQuery = dbQuery.eq('manufacturer', manufacturer);
      }

      if (query) {
        dbQuery = dbQuery.or(`model.ilike.%${query}%,search_code.ilike.%${query}%,variant.ilike.%${query}%`);
      }

      if (yearFrom) {
        dbQuery = dbQuery.gte('start_year', yearFrom);
      }

      if (yearTo) {
        dbQuery = dbQuery.lte('end_year', yearTo);
      }

      if (variant) {
        dbQuery = dbQuery.ilike('variant', `%${variant}%`);
      }

      // Apply sorting
      const sortFields = sortBy.split(',');
      sortFields.forEach(field => {
        dbQuery = dbQuery.order(field.trim(), { ascending: sortOrder === 'asc' });
      });

      // Apply pagination
      dbQuery = dbQuery.range(offset, offset + limit - 1);

      const { data, error, count } = await dbQuery;
      
      if (error) throw error;

      const result = {
        vehicles: data.map(model => this.processModelData(model, true)),
        total: count,
        searchParams,
        pagination: {
          limit,
          offset,
          totalPages: Math.ceil(count / limit),
          currentPage: Math.floor(offset / limit) + 1,
          hasMore: count > offset + limit
        },
        facets: await this.buildSearchFacets(searchParams)
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error searching vehicles:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Get vehicle by ID
   * @param {number} id - Vehicle ID
   * @returns {Promise<Object>} Vehicle details
   */
  async getVehicleById(id) {
    const cacheKey = `vehicle_${id}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Vehicle not found');

      const processedData = this.processModelData(data, true);
      
      this.setCache(cacheKey, processedData);
      return processedData;
    } catch (error) {
      console.error('Error fetching vehicle by ID:', error);
      throw new Error(`Failed to fetch vehicle: ${error.message}`);
    }
  }

  /**
   * Get models by year range
   * @param {number} startYear - Start year
   * @param {number} endYear - End year
   * @returns {Promise<Array>} Models in year range
   */
  async getModelsByYearRange(startYear, endYear) {
    const cacheKey = `years_${startYear}_${endYear}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .gte('start_year', startYear)
        .lte('end_year', endYear)
        .order('manufacturer')
        .order('model');

      if (error) throw error;

      const result = data.map(model => this.processModelData(model, true));
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching models by year range:', error);
      throw new Error(`Failed to fetch models for years ${startYear}-${endYear}: ${error.message}`);
    }
  }

  /**
   * Get database statistics
   * @returns {Promise<Object>} Database statistics
   */
  async getStatistics() {
    const cacheKey = 'statistics';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Total models count
      const { count: totalModels, error: countError } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Manufacturers count
      const { data: manufacturersData, error: manufacturersError } = await supabase
        .from(this.tableName)
        .select('manufacturer');

      if (manufacturersError) throw manufacturersError;

      const uniqueManufacturers = new Set(manufacturersData.map(m => m.manufacturer));

      // Year range
      const { data: yearData, error: yearError } = await supabase
        .from(this.tableName)
        .select('start_year, end_year')
        .not('start_year', 'is', null)
        .not('end_year', 'is', null);

      if (yearError) throw yearError;

      const years = yearData.flatMap(y => [y.start_year, y.end_year]).filter(Boolean);
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);

      const statistics = {
        totalModels,
        totalManufacturers: uniqueManufacturers.size,
        manufacturersList: Array.from(uniqueManufacturers).sort(),
        yearRange: {
          min: minYear,
          max: maxYear,
          span: maxYear - minYear
        },
        lastUpdated: new Date().toISOString()
      };

      this.setCache(cacheKey, statistics);
      return statistics;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  }

  // Helper Methods

  /**
   * Process raw model data
   * @param {Object} model - Raw model data
   * @param {boolean} includeYears - Include year information
   * @returns {Object} Processed model data
   */
  processModelData(model, includeYears = false) {
    const processed = {
      id: model.id,
      manufacturer: model.manufacturer,
      model: model.model,
      searchCode: model.search_code,
      slug: this.createSlug(`${model.manufacturer}-${model.model}`),
      variant: model.variant || null,
      code: model.code || null,
      imagePath: model.image_path || null,
    };

    if (includeYears) {
      processed.years = {
        start: model.start_year || null,
        end: model.end_year || null,
        display: this.formatYearRange(model.start_year, model.end_year)
      };
    }

    return processed;
  }

  /**
   * Format year range for display
   * @param {number} startYear - Start year
   * @param {number} endYear - End year
   * @returns {string} Formatted year range
   */
  formatYearRange(startYear, endYear) {
    if (!startYear && !endYear) return 'Unknown';
    if (!endYear) return `${startYear}+`;
    if (startYear === endYear) return `${startYear}`;
    return `${startYear}-${endYear}`;
  }

  /**
   * Create URL-friendly slug
   * @param {string} text - Text to slugify
   * @returns {string} URL slug
   */
  createSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Generate consistent ID from text
   * @param {string} text - Text to generate ID from
   * @returns {string} Generated ID
   */
  generateId(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  /**
   * Build search facets for filtering
   * @param {Object} currentParams - Current search parameters
   * @returns {Promise<Object>} Search facets
   */
  async buildSearchFacets(currentParams = {}) {
    try {
      // This is a simplified version - you could expand this
      const manufacturers = await this.getManufacturers();
      
      return {
        manufacturers: manufacturers.slice(0, 20), // Limit for performance
        yearRanges: [
          { label: '2020+', value: { from: 2020 } },
          { label: '2010-2019', value: { from: 2010, to: 2019 } },
          { label: '2000-2009', value: { from: 2000, to: 2009 } },
          { label: '1990-1999', value: { from: 1990, to: 1999 } },
          { label: 'Before 1990', value: { to: 1989 } }
        ]
      };
    } catch (error) {
      console.error('Error building facets:', error);
      return { manufacturers: [], yearRanges: [] };
    }
  }

  // Cache Management

  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @returns {*} Cached data or null
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.cacheExpiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  /**
   * Set data in cache
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache
   * @param {string} pattern - Optional pattern to match keys
   */
  clearCache(pattern = null) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// Export both class and singleton instance
export { VehicleService };
export const vehicleService = new VehicleService();
export default vehicleService;
