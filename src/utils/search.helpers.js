/**
 * Search filter and pagination helpers.
 *
 * WHY SEPARATE FROM THE SERVICE?
 * These are pure functions (no DB calls, no side effects).
 * They transform input data into Prisma-compatible query objects.
 *
 * Benefits:
 * - Testable in isolation (no DB mock needed)
 * - Reusable if you add more searchable models later
 * - Keeps services focused on orchestrating DB calls
 *
 * NOTE: Since we use Zod validation BEFORE these helpers run,
 * we can trust that the values are already the correct types.
 * No need for defensive Number() conversions here.
 */

/**
 * Build Prisma `where` clause from validated search parameters.
 * Only includes filters for parameters that are actually provided.
 *
 * @param {Object} params - Already validated by Zod (types guaranteed)
 * @returns {Object} Prisma-compatible where clause
 */
export const buildSearchFilters = ({ title, director, genre, yearMin, yearMax, ratingMin, ratingMax }) => {
  const where = {};

  if (title) {
    where.title = { contains: title, mode: 'insensitive' };
  }

  // Director partial match — same pattern as title
  // "nolan" matches "Christopher Nolan", "Jonathan Nolan", etc.
  if (director) {
    where.director = { contains: director, mode: 'insensitive' };
  }

  if (genre) {
    where.genre = { has: genre };
  }

  // Year range — supports min only, max only, or both
  if (yearMin !== undefined || yearMax !== undefined) {
    where.year = {};
    if (yearMin !== undefined) where.year.gte = yearMin;
    if (yearMax !== undefined) where.year.lte = yearMax;
  }

  // Rating range — same pattern as year range
  // Supports: ratingMin only, ratingMax only, or both for a range
  if (ratingMin !== undefined || ratingMax !== undefined) {
    where.rating = {};
    if (ratingMin !== undefined) where.rating.gte = ratingMin;
    if (ratingMax !== undefined) where.rating.lte = ratingMax;
  }

  return where;
};

/**
 * Build pagination metadata for the API response.
 * This gives the frontend everything it needs to render page controls.
 *
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @param {number} total - Total matching records in DB
 * @returns {Object} { page, limit, total, pages }
 */
export const buildPaginationMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit) || 1,
});
