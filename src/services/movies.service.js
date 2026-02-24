import prisma from '../lib/prisma.js';
import { Genre } from '@prisma/client';
import { NotFoundError } from '../utils/AppError.js';
import { buildSearchFilters, buildPaginationMeta } from '../utils/search.helpers.js';

// Allowed fields for sorting
const ALLOWED_SORT_FIELDS = ['title', 'rating', 'year'];

// Valid genre values from Prisma enum
const VALID_GENRES = Object.values(Genre);

// Display labels for each genre
const GENRE_LABELS = {
  ACTION: 'Action',
  COMEDY: 'Comedy',
  DRAMA: 'Drama',
  HORROR: 'Horror',
  SCIFI: 'Sci-Fi',
  THRILLER: 'Thriller',
};

/**
 * Get all valid genres with display labels
 */
export const getGenres = () => {
  return VALID_GENRES.map((value) => ({
    value,
    label: GENRE_LABELS[value] || value,
  }));
};

/**
 * Check if a genre value is valid
 */
export const isValidGenre = (genre) => VALID_GENRES.includes(genre);

/**
 * Get all movies with filters, sorting and pagination
 */
export const getAllMovies = async (filters = {}) => {
  // Build the "where" object for filters
  const where = {};

  if (filters.genre) {
    where.genre = { has: filters.genre };
  }

  if (filters.minRating) {
    where.rating = { gte: Number(filters.minRating) };
  }

  if (filters.year) {
    where.year = Number(filters.year);
  }

  if (filters.director) {
    where.director = { contains: filters.director, mode: 'insensitive' };
  }

  // Build sorting
  let orderBy = undefined;
  if (filters.sortBy && ALLOWED_SORT_FIELDS.includes(filters.sortBy)) {
    orderBy = { [filters.sortBy]: filters.order === 'desc' ? 'desc' : 'asc' };
  }

  // Build pagination
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || undefined;
  const skip = limit ? (page - 1) * limit : undefined;

  // Execute query and get total count in parallel
  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.movie.count({ where }),
  ]);

  return { movies, total };
};

/**
 * Get a movie by its ID
 */
export const getMovieById = async (id) => {
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: { reviews: { orderBy: { createdAt: 'desc' } } },
  });
  return movie;
};

/**
 * Get a random movie
 */
export const getRandomMovie = async () => {
  const count = await prisma.movie.count();
  if (count === 0) return null;

  const randomIndex = Math.floor(Math.random() * count);
  const movies = await prisma.movie.findMany({
    skip: randomIndex,
    take: 1,
  });

  return movies[0] || null;
};

/**
 * Get multiple random movies
 */
export const getRandomMovies = async (count = 3) => {
  const totalMovies = await prisma.movie.count();
  if (totalMovies === 0) return [];

  const safeCount = Math.min(count, totalMovies);

  // Get all movies and shuffle (for small datasets)
  // For large datasets, a different strategy would be used
  const allMovies = await prisma.movie.findMany();
  const shuffled = allMovies.sort(() => Math.random() - 0.5);

  return shuffled.slice(0, safeCount);
};


/**
 * Create a new movie
 */
export const createMovie = async (movieData) => {
  const movie = await prisma.movie.create({
    data: movieData,
  });
  return movie;
};

/**
 * Update an existing movie
 */
export const updateMovie = async (id, movieData) => {
  const movie = await prisma.movie.update({
    where: { id },
    data: movieData,
  });
  return movie;
};

/**
 * Advanced movie search with combined filters and pagination.
 *
 * WHY A SEPARATE FUNCTION (not reusing getAllMovies)?
 * getAllMovies handles the existing /movies endpoint with its own filter format
 * (genre, minRating, year, director, sortBy, order). Changing it would break
 * the existing frontend that depends on that exact parameter format.
 *
 * searchMovies uses a different parameter set (title, yearMin/yearMax range,
 * ratingMin) and always returns pagination metadata. This keeps both endpoints
 * working independently.
 *
 * @param {Object} params - Already validated by Zod
 */
export const searchMovies = async (params) => {
  const { page, limit, ...filterParams } = params;
  const where = buildSearchFilters(filterParams);
  const skip = (page - 1) * limit;

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      skip,
      take: limit,
      orderBy: { rating: 'desc' },
      include: { _count: { select: { reviews: true } } },
    }),
    prisma.movie.count({ where }),
  ]);

  return {
    movies,
    pagination: buildPaginationMeta(page, limit, total),
  };
};

/**
 * Delete a movie and its reviews using an explicit transaction.
 *
 * WHY $transaction WHEN CASCADE EXISTS?
 * 1. The schema has onDelete: Cascade, so Postgres WOULD delete reviews
 *    automatically. But $transaction gives us explicit control and lets
 *    us return metadata (how many reviews were deleted).
 * 2. Demonstrates atomicity: if the movie delete fails, the review
 *    deletes are rolled back automatically.
 * 3. Real-world pattern: in production, you'd often need to do extra
 *    work during deletion (audit logs, cache invalidation, notifications)
 *    that must happen atomically.
 *
 * WHAT IS ATOMICITY?
 * "All or nothing." Either ALL operations in the transaction succeed,
 * or NONE of them do. If step 2 fails, step 1 is undone. The database
 * never ends up in a "half-deleted" state.
 */
export const deleteMovie = async (id) => {
  // Verify the movie exists before starting the transaction
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: { _count: { select: { reviews: true } } },
  });

  if (!movie) {
    throw new NotFoundError('Movie', id);
  }

  // Execute both deletes atomically
  const [deletedReviews] = await prisma.$transaction([
    prisma.review.deleteMany({ where: { movieId: id } }),
    prisma.movie.delete({ where: { id } }),
  ]);

  return {
    title: movie.title,
    reviewsDeleted: deletedReviews.count,
  };
};
