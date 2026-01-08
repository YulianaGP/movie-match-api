// Express server for Movie Match API
import express from 'express';
import { movies } from './data/movies.js';

const app = express();
const PORT = 3000;

// HU1: Root route - Welcome message
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

// HU2: List all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// HU4: Random movie (MUST be before :id to avoid confusing "random" with an ID)
app.get('/movies/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * movies.length);
  const randomMovie = movies[randomIndex];
  res.json(randomMovie);
});

// HU3: Movie by ID
app.get('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({
      error: 'Movie not found',
      id: id
    });
  }

  res.json(movie);
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Movie Match API running on http://localhost:${PORT}`);
});
