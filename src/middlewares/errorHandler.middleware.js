/**
 * Error Handler Middleware
 * Catches unhandled errors and responds with a standardized format
 * Includes stack trace in development, omits it in production
 */

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error(`[ERROR] ${err.message}`);
  if (!isProduction) {
    console.error(err.stack);
  }

  const response = {
    success: false,
    error: err.message || 'Internal server error'
  };

  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
