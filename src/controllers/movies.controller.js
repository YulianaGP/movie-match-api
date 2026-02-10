import {
  getAllMovies,
  getMovieById,
  getRandomMovie,
  getRandomMovies,
  getStats,
  getGenres,
  isValidGenre,
  createMovie,
  updateMovie,
  deleteMovie
} from '../services/movies.service.js';
import { enrichMoviesWithAI } from '../services/ai.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

// GET /movies - Get all movies
export const getAll = async (req, res) => {
  try {
    const filters = req.query;
    const { movies, total } = await getAllMovies(filters);
    res.json({
      success: true,
      count: movies.length,
      total,
      data: movies,
    });
  } catch (error) {
    sendError(res, 500, 'Error fetching movies');
  }
};

// GET /movies/:id - Get movie by ID
export const getById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendError(res, 400, 'Invalid movie ID');
    }

    const movie = await getMovieById(id);

    if (!movie) {
      return sendError(res, 404, 'Movie not found');
    }

    sendSuccess(res, movie);
  } catch (error) {
    sendError(res, 500, 'Error fetching movie');
  }
};

// GET /movies/random - Get random movie
export const getRandom = async (req, res) => {
  try {
    const movie = await getRandomMovie();

    if (!movie) {
      return sendError(res, 404, 'No movies available');
    }

    sendSuccess(res, movie);
  } catch (error) {
    sendError(res, 500, 'Error fetching random movie');
  }
};

// GET /movies/stats - Get movie statistics
export const getMovieStats = async (req, res) => {
  try {
    const stats = await getStats();
    sendSuccess(res, stats);
  } catch (error) {
    sendError(res, 500, 'Error fetching stats');
  }
};

// GET /movies/genres - Get valid genres
export const getMovieGenres = (req, res) => {
  sendSuccess(res, getGenres());
};

// GET /movies/discover - Discover movies with AI
export const discoverMovies = async (req, res) => {
  try {
    const count = Number(req.query.count) || 3;

    const movies = await getRandomMovies(count);
    const enrichedMovies = await enrichMoviesWithAI(movies);

    sendSuccess(res, enrichedMovies);
  } catch (error) {
    sendError(res, 500, 'Error discovering movies');
  }
};

// POST /movies - Create new movie
export const create = async (req, res) => {
  try {
    const { title, year, genre, rating, director, description } = req.body;

    // Basic validation
    if (!title || !year || !genre || !rating || !director || !description) {
      return sendError(res, 400, 'All fields are required: title, year, genre, rating, director, description');
    }

    // Validate genres against enum
    const genreArray = Array.isArray(genre) ? genre : [genre];
    const invalidGenres = genreArray.filter((g) => !isValidGenre(g));
    if (invalidGenres.length > 0) {
      return sendError(res, 400, `Invalid genre(s): ${invalidGenres.join(', ')}. Valid genres: ${getGenres().map((g) => g.value).join(', ')}`);
    }

    const movieData = {
      title,
      year: Number(year),
      genre: genreArray,
      rating: Number(rating),
      director,
      description
    };

    const movie = await createMovie(movieData);
    sendSuccess(res, movie, 201);
  } catch (error) {
    sendError(res, 500, 'Error creating movie');
  }
};

// PUT /movies/:id - Update movie
export const update = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendError(res, 400, 'Invalid movie ID');
    }

    // Check if movie exists
    const existingMovie = await getMovieById(id);
    if (!existingMovie) {
      return sendError(res, 404, 'Movie not found');
    }

    const { title, year, genre, rating, director, description } = req.body;

    // Validate genres if provided
    if (genre) {
      const genreArray = Array.isArray(genre) ? genre : [genre];
      const invalidGenres = genreArray.filter((g) => !isValidGenre(g));
      if (invalidGenres.length > 0) {
        return sendError(res, 400, `Invalid genre(s): ${invalidGenres.join(', ')}. Valid genres: ${getGenres().map((g) => g.value).join(', ')}`);
      }
    }

    const movieData = {};
    if (title) movieData.title = title;
    if (year) movieData.year = Number(year);
    if (genre) movieData.genre = Array.isArray(genre) ? genre : [genre];
    if (rating) movieData.rating = Number(rating);
    if (director) movieData.director = director;
    if (description) movieData.description = description;

    const movie = await updateMovie(id, movieData);
    sendSuccess(res, movie);
  } catch (error) {
    sendError(res, 500, 'Error updating movie');
  }
};

// DELETE /movies/:id - Delete movie
export const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendError(res, 400, 'Invalid movie ID');
    }

    // Check if movie exists
    const existingMovie = await getMovieById(id);
    if (!existingMovie) {
      return sendError(res, 404, 'Movie not found');
    }

    await deleteMovie(id);
    sendSuccess(res, { message: 'Movie deleted successfully' });
  } catch (error) {
    sendError(res, 500, 'Error deleting movie');
  }
};
