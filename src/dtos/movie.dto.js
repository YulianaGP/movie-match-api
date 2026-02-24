/**
 * Data Transfer Objects for Movie and Review.
 *
 * WHY DTOs?
 * Prisma returns objects with ALL database fields, internal metadata,
 * and potentially sensitive data. DTOs act as a "filter" — only exposing
 * exactly what the API consumer needs.
 *
 * REAL-WORLD EXAMPLE:
 * If you later add a Movie.internalNotes field for admins only,
 * without a DTO it would leak to every API response. With a DTO,
 * you simply don't include it here, and it's never exposed.
 *
 * RULE: Controllers should ALWAYS pass data through a DTO before sending.
 */

// --- Review DTO ---
export const toReviewResponse = (review) => ({
  id: review.id,
  movieId: review.movieId,
  author: review.author,
  rating: review.rating,
  comment: review.comment,
  createdAt: review.createdAt,
});

// --- Movie DTO (list view — no reviews included) ---
export const toMovieResponse = (movie) => ({
  id: movie.id,
  title: movie.title,
  year: movie.year,
  genre: movie.genre,
  rating: movie.rating,
  director: movie.director,
  description: movie.description,
  reviewCount: movie._count?.reviews ?? movie.reviews?.length ?? 0,
});

// --- Movie DTO (detail view — includes reviews) ---
export const toMovieDetailResponse = (movie) => ({
  ...toMovieResponse(movie),
  reviews: movie.reviews?.map(toReviewResponse) ?? [],
});
