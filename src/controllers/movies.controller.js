import { getAllMovies, getMovieById, getRandomMovie, getStats } from '../services/movies.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getAll = (req, res) => {
  const filters = req.query;
  const movies = getAllMovies(filters);
  sendSuccess(res, movies);
};

export const getById = (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return sendError(res, 400, 'Invalid movie ID');
  }

  const movie = getMovieById(id);

  if (!movie) {
    return sendError(res, 404, 'Movie not found');
  }

  sendSuccess(res, movie);
};

export const getRandom = (req, res) => {
  const movie = getRandomMovie();
  sendSuccess(res, movie);
};

export const getMovieStats = (req, res) => {
  const stats = getStats();
  sendSuccess(res, stats);
};
