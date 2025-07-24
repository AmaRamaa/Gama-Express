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

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GamaExpress Vehicle API',
      version: '1.0.0',
      description: 'API for vehicle model data management',
      contact: {
        name: 'GamaExpress Team',
        url: 'https://github.com/your-repo/gamaexpress',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/api/routes/*.js', './src/api/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);
app.use(requestLogger);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
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
