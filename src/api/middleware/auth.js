/**
 * API Key Authentication Middleware
 * Protects API endpoints from unauthorized access
 */

// Store valid API keys (in production, use database)
const validApiKeys = new Set([
  process.env.FRONTEND_API_KEY || 'gama-frontend-key-2024',
  process.env.ADMIN_API_KEY || 'gama-admin-key-2024',
  process.env.MOBILE_API_KEY || 'gama-mobile-key-2024'
]);

/**
 * Require API key for protected routes
 */
export const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || 
                 req.headers['authorization']?.replace('Bearer ', '') ||
                 req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'Authentication Required',
      message: 'API key required. Please provide it in X-API-Key header or as Bearer token.',
      code: 'MISSING_API_KEY'
    });
  }
  
  // Check if the provided key is valid
  if (!validApiKeys.has(apiKey)) {
    return res.status(403).json({ 
      error: 'Authentication Failed',
      message: 'Invalid API key provided.',
      code: 'INVALID_API_KEY'
    });
  }
  
  // Add API key info to request for logging
  req.apiKey = {
    value: apiKey.substring(0, 10) + '...',
    timestamp: new Date().toISOString()
  };
  
  next();
};

/**
 * Rate limiting by API key
 */
const apiKeyUsage = new Map();

export const rateLimitByApiKey = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const apiKey = req.apiKey?.value || 'anonymous';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get or create usage record for this API key
    if (!apiKeyUsage.has(apiKey)) {
      apiKeyUsage.set(apiKey, []);
    }
    
    const requests = apiKeyUsage.get(apiKey);
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        message: `Too many requests. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      });
    }
    
    // Add current request
    recentRequests.push(now);
    apiKeyUsage.set(apiKey, recentRequests);
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': maxRequests - recentRequests.length,
      'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
    });
    
    next();
  };
};
