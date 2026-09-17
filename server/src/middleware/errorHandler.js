function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === 'production';

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({ message });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `That ${field} is already in use` });
  }

  const status = err.status || 500;
  console.error('[error]', err.message);
  res.status(status).json({
    message: status === 500 && isProd ? 'Something went wrong on our end' : err.message,
  });
}

module.exports = { notFound, errorHandler };
