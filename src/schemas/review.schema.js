import { z } from 'zod';

/**
 * Review validation schemas.
 *
 * NOTE ON RATING RANGE:
 * Movie.rating is 0-10 (float), but Review.rating is 1-5 (integer).
 * This is intentional — movie ratings come from external sources (IMDB-style),
 * while review ratings are user-submitted stars (1 to 5).
 */

// --- Schema for creating a review (POST /movies/:movieId/reviews) ---
export const createReviewSchema = z.object({
  author: z.string().min(1, 'Author name is required').trim(),
  rating: z.coerce
    .number({ invalid_type_error: 'Rating must be a number' })
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z.string().min(1, 'Comment is required').trim(),
});

// --- Schema for updating a review (PUT /movies/:movieId/reviews/:reviewId) ---
export const updateReviewSchema = createReviewSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

// --- Schema for review route params (both movieId and reviewId) ---
export const reviewParamsSchema = z.object({
  movieId: z.coerce.number().int().positive('Movie ID must be a positive integer'),
  reviewId: z.coerce.number().int().positive('Review ID must be a positive integer'),
});
