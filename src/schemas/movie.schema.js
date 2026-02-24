import { z } from 'zod';
import { Genre } from '@prisma/client';

/**
 * Movie validation schemas using Zod.
 *
 * WHY ZOD INSTEAD OF MANUAL IF/ELSE?
 * 1. Declarative: you describe WHAT valid data looks like, not HOW to check it
 * 2. Type-safe: Zod infers TypeScript types automatically (useful if you migrate later)
 * 3. Composable: schemas can extend/merge/pick from each other
 * 4. Detailed errors: automatically tells the user which field failed and why
 *
 * z.coerce.number() is key for query params — Express gives us strings
 * like "2024", and coerce converts them to actual numbers before validating.
 */

// Reuse Prisma's Genre enum as the source of truth
const genreEnum = z.nativeEnum(Genre);

// --- Schema for creating a movie (POST /movies) ---
export const createMovieSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  year: z.coerce
    .number({ invalid_type_error: 'Year must be a number' })
    .int('Year must be a whole number')
    .min(1888, 'Year must be 1888 or later') // First film ever made
    .max(new Date().getFullYear() + 5, 'Year is too far in the future'),
  genre: z
    .array(genreEnum, { invalid_type_error: 'Genre must be an array' })
    .min(1, 'At least one genre is required'),
  rating: z.coerce
    .number({ invalid_type_error: 'Rating must be a number' })
    .min(0, 'Rating must be at least 0')
    .max(10, 'Rating must be at most 10'),
  director: z.string().min(1, 'Director is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
});

// --- Schema for updating a movie (PUT /movies/:id) ---
// .partial() makes ALL fields optional (any subset can be sent)
export const updateMovieSchema = createMovieSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

// --- Schema for searching movies (GET /movies/search) ---
//
// WHY director AND ratingMax HERE BUT NOT IN createMovieSchema?
// Create/Update schemas validate data you're WRITING to the database.
// Search schemas validate QUERY PARAMETERS — looser rules because
// the user is filtering, not creating. For example, director here is
// optional and used for partial matching (LIKE '%value%'), while in
// createMovieSchema it's required and stored as-is.
export const searchQuerySchema = z.object({
  title: z.string().optional(),
  director: z.string().optional(),
  genre: genreEnum.optional(),
  yearMin: z.coerce.number().int().min(1888).optional(),
  yearMax: z.coerce.number().int().optional(),
  ratingMin: z.coerce.number().min(0).max(10).optional(),
  ratingMax: z.coerce.number().min(0).max(10).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// --- Schema for URL params with numeric ID ---
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

// --- Schema for movie ID in nested routes (reviews) ---
export const movieIdParamSchema = z.object({
  movieId: z.coerce.number().int().positive('Movie ID must be a positive integer'),
});
