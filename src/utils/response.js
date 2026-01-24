export const sendSuccess = (res, data) => {
  const count = Array.isArray(data) ? data.length : 1;

  res.json({
    success: true,
    count,
    data
  });
};

export const sendError = (res, status, message) => {
  res.status(status).json({
    success: false,
    error: message
  });
};
