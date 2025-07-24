/**
 * Simple API Service for GamaExpress
 * Handles all API requests with authentication
 * Supports both development and production environments
 */

// Dynamic API configuration based on environment
const getApiConfig = () => {
  // Check if we're in development (works in both Vite and Node.js)
  const isDevelopment = (typeof import.meta !== 'undefined' && import.meta.env?.DEV) || 
                       process.env.NODE_ENV !== 'production';
  
  // Use environment variables with fallbacks
  const baseUrl = (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_API_BASE_URL : null) ||
    process.env.VITE_API_BASE_URL || 
    (isDevelopment ? 'http://localhost:3001/api/v1' : '/api/v1');
  
  const apiKey = (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_API_KEY : null) ||
    process.env.VITE_API_KEY || 
    'gama-frontend-api-key-2024';
  
  return { baseUrl, apiKey, isDevelopment };
};

class ApiService {
  constructor() {
    const config = getApiConfig();
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    
    // Log configuration in development
    if (config.isDevelopment) {
      console.log('🔧 API Service Configuration:', {
        baseUrl: this.baseUrl,
        apiKey: this.apiKey.substring(0, 10) + '...',
        environment: process.env.NODE_ENV || 'development'
      });
    }
  }

  /**
   * Make authenticated API request
   */
  async makeRequest(endpoint, options = {}) {
    try {
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          ...options.headers
        }
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: defaultOptions.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error.message);
      throw error;
    }
  }

  /**
   * Vehicle API methods
   */
  async getAllVehicles() {
    return this.makeRequest('/vehicles');
  }

  async getVehicleById(id) {
    return this.makeRequest(`/vehicles/${id}`);
  }

  async createVehicle(vehicleData) {
    return this.makeRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData)
    });
  }

  async updateVehicle(id, vehicleData) {
    return this.makeRequest(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData)
    });
  }

  async deleteVehicle(id) {
    return this.makeRequest(`/vehicles/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Manufacturer API methods
   */
  async getAllManufacturers() {
    return this.makeRequest('/manufacturers');
  }

  async getManufacturerById(id) {
    return this.makeRequest(`/manufacturers/${id}`);
  }

  async createManufacturer(manufacturerData) {
    return this.makeRequest('/manufacturers', {
      method: 'POST',
      body: JSON.stringify(manufacturerData)
    });
  }

  async updateManufacturer(id, manufacturerData) {
    return this.makeRequest(`/manufacturers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(manufacturerData)
    });
  }

  async deleteManufacturer(id) {
    return this.makeRequest(`/manufacturers/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Utility methods
   */
  async checkConnection() {
    try {
      // Build health check URL dynamically
      const healthUrl = this.baseUrl.includes('/api/v1') 
        ? this.baseUrl.replace('/api/v1', '/health')
        : `${this.baseUrl.replace('/api/v1', '')}/health`;
      
      const response = await fetch(healthUrl);
      return response.ok;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;
