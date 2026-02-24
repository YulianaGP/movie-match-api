import express from 'express';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import moviesRouter from './src/routes/movies.routes.js';
import dashboardRouter from './src/routes/dashboard.routes.js';
import { logger, notFound, errorHandler, corsMiddleware } from './src/middlewares/index.js';

// Load Swagger documentation
const swaggerDoc = YAML.load('./docs/swagger.yaml');

const app = express();
const PORT = process.env.PORT || 3000;

// Global middlewares
app.use(corsMiddleware);
app.use(logger);
app.use(express.json());

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// HU1: Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Movie Match API',
    endpoints: {
      allMovies: 'GET /api/movies',
      movieById: 'GET /api/movies/:id',
      randomMovie: 'GET /api/movies/random',
      search: 'GET /api/movies/search',
      discover: 'GET /api/movies/discover',
      dashboard: 'GET /api/dashboard',
      documentation: 'GET /docs'
    }
  });
});

// API routes
app.use('/api/movies', moviesRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handling middlewares (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Movie Match API running on http://localhost:${PORT}`);
});
