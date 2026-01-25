import express from 'express';
import moviesRouter from './src/routes/movies.routes.js';
import 'dotenv/config';

const app = express();
const PORT = 3000;

// HU1: Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Movie Match API 🎬',
    endpoints: {
      allMovies: 'GET /movies',
      movieById: 'GET /movies/:id',
      randomMovie: 'GET /movies/random'
    }
  });
});

// Movies routes
app.use('/api/movies', moviesRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Movie Match API running on http://localhost:${PORT}`);
});
