/**
 * Not Found Middleware
 * Catches undefined routes and responds with a standardized 404
 */

export const notFound = (req, res) => {
  const { method, originalUrl } = req;

  res.status(404).json({
    success: false,
    error: `Route ${method} ${originalUrl} not found`
  });
};
