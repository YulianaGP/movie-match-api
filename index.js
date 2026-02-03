import express from 'express';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import moviesRouter from './src/routes/movies.routes.js';
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
      stats: 'GET /api/movies/stats',
      discover: 'GET /api/movies/discover',
      documentation: 'GET /docs'
    }
  });
});

// Movies routes
app.use('/api/movies', moviesRouter);

// Error handling middlewares (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Movie Match API running on http://localhost:${PORT}`);
});
