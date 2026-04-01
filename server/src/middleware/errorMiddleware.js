export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const isDuplicateKey = err?.code === 11000;
  const duplicateField = isDuplicateKey ? Object.keys(err.keyPattern || {})[0] : null;
  const message = isDuplicateKey
    ? `${duplicateField || "Record"} already exists`
    : err.message || "Server error";

  console.error("API Error:", {
    path: req.originalUrl,
    method: req.method,
    statusCode,
    message: err.message,
    code: err.code,
    stack: err.stack,
  });

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
