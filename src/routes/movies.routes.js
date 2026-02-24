import { Router } from 'express';
import {
  getAll,
  getById,
  getRandom,
  getMovieStats,
  getMovieGenres,
  discoverMovies,
  search,
  create,
  update,
  remove,
} from '../controllers/movies.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createMovieSchema,
  updateMovieSchema,
  searchQuerySchema,
  idParamSchema,
} from '../schemas/movie.schema.js';
import reviewsRouter from './reviews.routes.js';

const router = Router();

/**
 * ROUTE ORDER MATTERS!
 * Static paths (/search, /stats, /random, etc.) MUST come before /:id.
 * Otherwise Express would try to parse "search" as a movie ID.
 */

// GET  /movies — List all (existing query format, no Zod — backward compatible)
router.get('/', getAll);

// GET  /movies/search — Advanced search with Zod-validated query params
router.get('/search', validate(searchQuerySchema, 'query'), search);

// GET  /movies/stats — Movie statistics
router.get('/stats', getMovieStats);

// GET  /movies/random — Random movie
router.get('/random', getRandom);

// GET  /movies/discover — Discover movies with AI
router.get('/discover', discoverMovies);

// GET  /movies/genres — Valid genre list
router.get('/genres', getMovieGenres);

// Reviews nested routes: /movies/:movieId/reviews
router.use('/:movieId/reviews', reviewsRouter);

// GET  /movies/:id — Movie detail (Zod validates :id is positive integer)
router.get('/:id', validate(idParamSchema, 'params'), getById);

// POST /movies — Create movie (Zod validates entire body)
router.post('/', validate(createMovieSchema), create);

// PUT  /movies/:id — Update movie (Zod validates params + body separately)
router.put('/:id', validate(idParamSchema, 'params'), validate(updateMovieSchema), update);

// DELETE /movies/:id — Delete movie (Zod validates :id)
router.delete('/:id', validate(idParamSchema, 'params'), remove);

export default router;
