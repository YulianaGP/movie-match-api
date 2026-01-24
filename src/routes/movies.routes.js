import { Router } from 'express';
import { getAll, getById, getRandom, getMovieStats } from '../controllers/movies.controller.js';

const router = Router();

// GET  /movies
router.get('/', getAll);

// GET  /movies/stats
router.get('/stats', getMovieStats);

// GET  /movies/random
router.get('/random', getRandom);

// GET  /movies/:id
router.get('/:id', getById);

export default router;
