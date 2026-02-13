import {
  getReviewsByMovie,
  createReview,
  updateReview,
  deleteReview,
} from '../services/reviews.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

// GET /movies/:movieId/reviews
export const getAll = async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);

    if (Number.isNaN(movieId)) {
      return sendError(res, 400, 'Invalid movie ID');
    }

    const reviews = await getReviewsByMovie(movieId);

    if (reviews === null) {
      return sendError(res, 404, 'Movie not found');
    }

    sendSuccess(res, reviews);
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Error fetching reviews');
  }
};

// POST /movies/:movieId/reviews
export const create = async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);

    if (Number.isNaN(movieId)) {
      return sendError(res, 400, 'Invalid movie ID');
    }

    const { author, rating, comment } = req.body;

    if (!author || !author.trim()) {
      return sendError(res, 400, 'Author is required');
    }

    if (!comment || !comment.trim()) {
      return sendError(res, 400, 'Comment is required');
    }

    if (rating === undefined || rating === null) {
      return sendError(res, 400, 'Rating is required');
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return sendError(res, 400, 'Rating must be an integer between 1 and 5');
    }

    const review = await createReview(movieId, {
      author,
      rating: numericRating,
      comment,
    });

    if (!review) {
      return sendError(res, 404, 'Movie not found');
    }

    sendSuccess(res, review, 201);
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Error creating review');
  }
};

// PUT /reviews/:reviewId
export const update = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);

    if (Number.isNaN(reviewId)) {
      return sendError(res, 400, 'Invalid review ID');
    }

    const { author, rating, comment } = req.body;

    if (author !== undefined && !author.trim()) {
      return sendError(res, 400, 'Author cannot be empty');
    }

    if (comment !== undefined && !comment.trim()) {
      return sendError(res, 400, 'Comment cannot be empty');
    }

    if (rating !== undefined) {
      const numericRating = Number(rating);
      if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
        return sendError(res, 400, 'Rating must be an integer between 1 and 5');
      }
    }

    const updateData = {};
    if (author !== undefined) updateData.author = author;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (comment !== undefined) updateData.comment = comment;

    if (Object.keys(updateData).length === 0) {
      return sendError(res, 400, 'At least one field is required: author, rating, comment');
    }

    const review = await updateReview(reviewId, updateData);

    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    sendSuccess(res, review);
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Error updating review');
  }
};

// DELETE /reviews/:reviewId
export const remove = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);

    if (Number.isNaN(reviewId)) {
      return sendError(res, 400, 'Invalid review ID');
    }

    const review = await deleteReview(reviewId);

    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    sendSuccess(res, { message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Error deleting review');
  }
};
