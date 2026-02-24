/**
 * Base application error class.
 *
 * WHY THIS EXISTS:
 * JavaScript's built-in Error class doesn't carry HTTP status codes.
 * By extending it, we create errors that "know" their own status,
 * so the errorHandler middleware can translate them to proper HTTP responses
 * WITHOUT the services or controllers having to care about HTTP.
 *
 * PATTERN: Throw in service → catch in middleware → respond to client.
 * This is called "error bubbling" and it's how professional APIs work.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes expected errors from bugs
  }
}

/**
 * 404 — Resource not found.
 * Used when a DB query returns null for a specific ID.
 *
 * Example: throw new NotFoundError('Movie', 42)
 * Result:  { success: false, error: "Movie with id 42 not found" }
 */
export class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`, 404);
  }
}

/**
 * 400 — Validation error.
 * Used when user input doesn't meet requirements.
 * Can carry structured details (e.g., Zod error issues array).
 *
 * Example: throw new ValidationError('Rating must be between 1 and 5')
 * Example: throw new ValidationError('Validation failed', zodIssuesArray)
 */
export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400);
    this.details = details; // Optional: array of field-level errors from Zod
  }
}
