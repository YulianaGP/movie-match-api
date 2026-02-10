import prisma from '../lib/prisma.js';
import { Genre } from '@prisma/client';

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
 * Get movie statistics
 */
export const getStats = async () => {
  const movies = await prisma.movie.findMany({
    select: { genre: true },
  });

  const stats = movies.reduce(
    (acc, movie) => {
      acc.totalMovies += 1;

      movie.genre.forEach((g) => {
        acc.byGenre[g] = (acc.byGenre[g] || 0) + 1;
      });

      return acc;
    },
    { totalMovies: 0, byGenre: {} }
  );

  return stats;
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
 * Delete a movie
 */
export const deleteMovie = async (id) => {
  const movie = await prisma.movie.delete({
    where: { id },
  });
  return movie;
};
