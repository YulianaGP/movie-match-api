import prisma from '../lib/prisma.js';

/**
 * Get all reviews for a specific movie (single query optimization)
 * Returns null if movie doesn't exist, reviews array otherwise
 */
export const getReviewsByMovie = async (movieId) => {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: { reviews: { orderBy: { createdAt: 'desc' } } },
  });

  if (!movie) return null;

  return movie.reviews;
};

/**
 * Find a review by ID
 */
export const getReviewById = async (id) => {
  return prisma.review.findUnique({ where: { id } });
};

/**
 * Create a new review for a movie
 * Returns null if movie doesn't exist
 */
export const createReview = async (movieId, data) => {
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!movie) return null;

  const review = await prisma.review.create({
    data: {
      movieId,
      author: data.author.trim(),
      rating: data.rating,
      comment: data.comment.trim(),
    },
  });

  return review;
};

/**
 * Update an existing review
 * Returns null if review doesn't exist
 */
export const updateReview = async (reviewId, data) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return null;

  const updateData = {};
  if (data.author) updateData.author = data.author.trim();
  if (data.rating !== undefined) updateData.rating = data.rating;
  if (data.comment) updateData.comment = data.comment.trim();

  return prisma.review.update({
    where: { id: reviewId },
    data: updateData,
  });
};

/**
 * Delete a review by ID
 * Returns null if review doesn't exist
 */
export const deleteReview = async (reviewId) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return null;

  return prisma.review.delete({ where: { id: reviewId } });
};
