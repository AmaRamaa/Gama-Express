import { validationResult } from 'express-validator';

/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`📥 ${req.method} ${req.url} - ${req.ip} - ${new Date().toISOString()}`);
  
  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';
    console.log(`📤 ${statusColor} ${res.statusCode} ${req.method} ${req.url} - ${duration}ms`);
  });
  
  next();
};

/**
 * Request validation middleware
 */
export const validateRequest = (validations) => {
  return async (req, res, next) => {
    try {
      for (const validation of validations) {
        await validation.run(req);
      }
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid request parameters',
          details: errors.array(),
        });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
