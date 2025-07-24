/**
 * Secure API Service for Frontend
 * Handles authentication and encryption for API calls
 */

class SecureApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
    this.apiKey = import.meta.env.VITE_API_KEY || 'gama-frontend-secure-api-key-2024';
    this.timeout = 10000; // 10 seconds
  }

  /**
   * Make authenticated API request
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        ...options.headers
      },
      ...options
    };

    // Add request body if provided
    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: 'Unknown Error',
          message: `HTTP ${response.status}` 
        }));
        
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Vehicle API methods
  async searchVehicles(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/vehicles/search?${queryString}`);
  }

  async getAllVehicles(page = 1, limit = 20) {
    return this.makeRequest(`/vehicles?page=${page}&limit=${limit}`);
  }

  async getVehicleById(id) {
    return this.makeRequest(`/vehicles/${id}`);
  }

  async getModelsByManufacturer(manufacturer, page = 1, limit = 50) {
    return this.makeRequest(`/vehicles/manufacturer/${manufacturer}/models?page=${page}&limit=${limit}`);
  }

  async getVehicleStats() {
    return this.makeRequest('/vehicles/stats');
  }

  // Manufacturer API methods
  async getAllManufacturers() {
    return this.makeRequest('/manufacturers');
  }

  async getManufacturerById(id) {
    return this.makeRequest(`/manufacturers/${id}`);
  }

  async getManufacturerStats(id) {
    return this.makeRequest(`/manufacturers/${id}/stats`);
  }

  // Health check
  async healthCheck() {
    return fetch(`${this.baseURL.replace('/api/v1', '')}/health`).then(r => r.json());
  }

  // Check if API is authenticated
  async checkAuth() {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const apiService = new SecureApiService();
export default apiService;
