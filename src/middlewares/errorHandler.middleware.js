import { AppError } from '../utils/AppError.js';

/**
 * Global error handler middleware.
 *
 * HOW IT WORKS:
 * Express 5 automatically catches errors thrown in async handlers
 * and forwards them here (the 4-parameter middleware signature tells
 * Express this is an error handler, not a regular middleware).
 *
 * This middleware is the SINGLE PLACE where errors become HTTP responses.
 * No controller or service should ever call res.status() for errors.
 *
 * WHAT IT HANDLES:
 * 1. AppError (our custom errors) → uses their statusCode and message
 * 2. Zod validation errors → formats field-level details into 400
 * 3. Prisma known errors → translates DB codes to HTTP codes
 * 4. Everything else → generic 500 (never exposes internals in production)
 */
export const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // --- 1. Our custom AppError (NotFoundError, ValidationError, etc.) ---
  if (err instanceof AppError) {
    console.error(`[APP_ERROR] ${err.statusCode} - ${err.message}`);

    const response = { success: false, error: err.message };

    // If it's a ValidationError with field details, include them
    if (err.details) {
      response.details = err.details;
    }

    return res.status(err.statusCode).json(response);
  }

  // --- 2. Zod validation errors (thrown by validate middleware) ---
  if (err.name === 'ZodError') {
    console.error(`[VALIDATION_ERROR] ${err.issues.length} issue(s)`);

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // --- 3. Prisma known errors ---
  // P2025: Record not found (e.g., update/delete a non-existent row)
  if (err.code === 'P2025') {
    console.error(`[PRISMA_ERROR] Record not found`);

    return res.status(404).json({
      success: false,
      error: 'Resource not found',
    });
  }

  // P2002: Unique constraint violation
  if (err.code === 'P2002') {
    const fields = err.meta?.target?.join(', ') || 'unknown';
    console.error(`[PRISMA_ERROR] Unique constraint on: ${fields}`);

    return res.status(409).json({
      success: false,
      error: `A record with that ${fields} already exists`,
    });
  }

  // --- 4. Unexpected errors (bugs, infrastructure failures) ---
  console.error(`[UNEXPECTED_ERROR] ${err.message}`);
  if (!isProduction) {
    console.error(err.stack);
  }

  res.status(500).json({
    success: false,
    error: isProduction ? 'Internal server error' : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};
