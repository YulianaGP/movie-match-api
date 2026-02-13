export const sendSuccess = (res, data, status = 200) => {
  const count = Array.isArray(data) ? data.length : 1;

  res.status(status).json({
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
