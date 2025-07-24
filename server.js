import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

// Import routes
import vehicleRoutes from './src/api/routes/vehicleRoutes.js';
import manufacturerRoutes from './src/api/routes/manufacturerRoutes.js';
import adminRoutes from './src/api/routes/adminRoutes.js';

// Import middleware
import { errorHandler } from './src/api/middleware/errorHandler.js';
import { requestLogger } from './src/api/middleware/requestLogger.js';
import { requireApiKey, rateLimitByApiKey } from './src/api/middleware/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(compression());

// Enhanced CORS configuration for production
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);
app.use(requestLogger);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GamaExpress Vehicle API',
      version: '1.0.0',
      description: 'Secure API for vehicle model data management',
      contact: {
        name: 'GamaExpress Team',
        url: 'https://github.com/AmaRamaa/Gama-Express',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        }
      }
    },
    security: [
      {
        ApiKeyAuth: []
      }
    ]
  },
  apis: ['./src/api/routes/*.js', './src/api/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// API Documentation (public access)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint (public access)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    security: 'enabled'
  });
});

// Security info endpoint
app.get('/security', (req, res) => {
  res.json({
    message: 'GamaExpress API - Security Enabled',
    authentication: 'API Key required',
    rateLimit: 'Active',
    headers: {
      'X-API-Key': 'Required for all /api routes'
    }
  });
});

// Apply API key protection to all API routes
app.use('/api', requireApiKey);
app.use('/api', rateLimitByApiKey(50, 15 * 60 * 1000)); // 50 requests per 15 minutes per API key

// API Routes (protected)
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/manufacturers', manufacturerRoutes);
app.use('/api/v1/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'GamaExpress Vehicle API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      vehicles: '/api/v1/vehicles',
      manufacturers: '/api/v1/manufacturers',
      admin: '/api/v1/admin',
    },
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} was not found.`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚗 GamaExpress API Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

export default app;
