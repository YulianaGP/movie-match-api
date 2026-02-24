import {
  getAllMovies,
  getMovieById,
  getRandomMovie,
  getRandomMovies,
  getStats,
  getGenres,
  searchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../services/movies.service.js';
import { enrichMoviesWithAI } from '../services/ai.service.js';
import { sendSuccess } from '../utils/response.js';
import { NotFoundError } from '../utils/AppError.js';
import { toMovieResponse, toMovieDetailResponse } from '../dtos/movie.dto.js';

/**
 * Movies Controller — HTTP layer only.
 *
 * WHAT CHANGED:
 * 1. NO try/catch — Express 5 auto-catches async errors → errorHandler
 * 2. NO manual validation — Zod middleware validates before we run
 * 3. DTOs on responses — toMovieResponse() controls exposed fields
 * 4. Services throw errors — no more null-checking in controller
 *
 * WHAT'S PRESERVED:
 * - getAll still passes req.query directly (backward compatible with frontend)
 * - Response format { success, count, data } is unchanged
 * - All endpoint paths remain the same
 */

// GET /movies — List all movies (existing filter format preserved)
export const getAll = async (req, res) => {
  const filters = req.query;
  const { movies, total } = await getAllMovies(filters);

  res.json({
    success: true,
    count: movies.length,
    total,
    data: movies.map(toMovieResponse),
  });
};

// GET /movies/search — Advanced search with pagination metadata
export const search = async (req, res) => {
  const { movies, pagination } = await searchMovies(req.validated);

  res.json({
    success: true,
    count: movies.length,
    data: movies.map(toMovieResponse),
    pagination,
  });
};

// GET /movies/:id — Get movie detail with reviews
export const getById = async (req, res) => {
  const { id } = req.validated;
  const movie = await getMovieById(id);

  if (!movie) {
    throw new NotFoundError('Movie', id);
  }

  sendSuccess(res, toMovieDetailResponse(movie));
};

// GET /movies/random — Get a random movie
export const getRandom = async (req, res) => {
  const movie = await getRandomMovie();

  if (!movie) {
    throw new NotFoundError('Movie', 'random');
  }

  sendSuccess(res, toMovieResponse(movie));
};

// GET /movies/stats — Basic statistics (kept for backward compatibility)
export const getMovieStats = async (req, res) => {
  const stats = await getStats();
  sendSuccess(res, stats);
};

// GET /movies/genres — Valid genre list (synchronous, no DB call)
export const getMovieGenres = (req, res) => {
  sendSuccess(res, getGenres());
};

// GET /movies/discover — Discover movies with AI enrichment
export const discoverMovies = async (req, res) => {
  const count = Number(req.query.count) || 3;
  const movies = await getRandomMovies(count);
  const enrichedMovies = await enrichMoviesWithAI(movies);

  sendSuccess(res, enrichedMovies);
};

// POST /movies — Create new movie
export const create = async (req, res) => {
  const movie = await createMovie(req.validated);
  sendSuccess(res, toMovieResponse(movie), 201);
};

// PUT /movies/:id — Update movie
export const update = async (req, res) => {
  const { id, ...updateData } = req.validated;

  const existing = await getMovieById(id);
  if (!existing) {
    throw new NotFoundError('Movie', id);
  }

  const movie = await updateMovie(id, updateData);
  sendSuccess(res, toMovieResponse(movie));
};

// DELETE /movies/:id — Delete movie with transaction
export const remove = async (req, res) => {
  const { id } = req.validated;

  // deleteMovie uses $transaction internally and throws NotFoundError
  const result = await deleteMovie(id);

  res.json({
    success: true,
    data: {
      message: `Movie "${result.title}" deleted successfully`,
      reviewsDeleted: result.reviewsDeleted,
    },
  });
};
