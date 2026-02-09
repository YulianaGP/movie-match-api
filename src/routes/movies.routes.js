import { Router } from 'express';
import {
  getAll,
  getById,
  getRandom,
  getMovieStats,
  discoverMovies,
  create,
  update,
  remove
} from '../controllers/movies.controller.js';

const router = Router();

// GET  /movies - List all movies (with optional filters)
router.get('/', getAll);

// GET  /movies/stats - Movie statistics
router.get('/stats', getMovieStats);

// GET  /movies/random - Random movie
router.get('/random', getRandom);

// GET  /movies/discover - Discover movies with AI
router.get('/discover', discoverMovies);

// GET  /movies/:id - Get movie by ID
router.get('/:id', getById);

// POST /movies - Create new movie
router.post('/', create);

// PUT  /movies/:id - Update movie
router.put('/:id', update);

// DELETE /movies/:id - Delete movie
router.delete('/:id', remove);

export default router;
