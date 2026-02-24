import {
  getReviewsByMovie,
  createReview,
  updateReview,
  deleteReview,
} from '../services/reviews.service.js';
import { sendSuccess } from '../utils/response.js';
import { NotFoundError } from '../utils/AppError.js';
import { toReviewResponse } from '../dtos/movie.dto.js';

/**
 * Reviews Controller — same refactor pattern as movies.controller.
 *
 * Validation is handled by Zod middleware in routes.
 * req.validated contains clean, typed data for params and body.
 */

// GET /movies/:movieId/reviews
export const getAll = async (req, res) => {
  const { movieId } = req.validated;
  const reviews = await getReviewsByMovie(movieId);

  if (reviews === null) {
    throw new NotFoundError('Movie', movieId);
  }

  sendSuccess(res, reviews.map(toReviewResponse));
};

// POST /movies/:movieId/reviews
export const create = async (req, res) => {
  const { movieId, ...reviewData } = req.validated;
  const review = await createReview(movieId, reviewData);

  if (!review) {
    throw new NotFoundError('Movie', movieId);
  }

  sendSuccess(res, toReviewResponse(review), 201);
};

// PUT /movies/:movieId/reviews/:reviewId
export const update = async (req, res) => {
  const { reviewId, ...updateData } = req.validated;

  // Remove movieId from updateData (it comes from params but isn't updatable)
  delete updateData.movieId;

  const review = await updateReview(reviewId, updateData);

  if (!review) {
    throw new NotFoundError('Review', reviewId);
  }

  sendSuccess(res, toReviewResponse(review));
};

// DELETE /movies/:movieId/reviews/:reviewId
export const remove = async (req, res) => {
  const { reviewId } = req.validated;
  const review = await deleteReview(reviewId);

  if (!review) {
    throw new NotFoundError('Review', reviewId);
  }

  sendSuccess(res, { message: 'Review deleted successfully' });
};
