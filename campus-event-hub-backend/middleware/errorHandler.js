export const errorHandler = (err, req, res, next) => {

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: ' Validation Error',
      errors: messages,
    });
  }

  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: ' Invalid ID format',
    });
  }

  
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: ` ${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

 
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: ' Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: ' Token expired',
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || ' Server Error',
  });
};


export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};