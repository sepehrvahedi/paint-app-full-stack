const errorHandler = (err, req, res, next) => {
    console.error('Error stack:', err.stack);

    let error = {
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    if (err.name === 'CastError') {
        error.message = 'Resource not found';
        return res.status(404).json(error);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error.message = `${field} already exists`;
        return res.status(409).json(error);
    }

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        error.message = messages.join(', ');
        return res.status(400).json(error);
    }

    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map(e => e.message);
        error.message = messages.join(', ');
        return res.status(400).json(error);
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0].path;
        error.message = `${field} already exists`;
        return res.status(409).json(error);
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        error.message = 'Invalid reference to related resource';
        return res.status(400).json(error);
    }

    if (err.name === 'JsonWebTokenError') {
        error.message = 'Invalid token';
        return res.status(401).json(error);
    }

    if (err.name === 'TokenExpiredError') {
        error.message = 'Token expired';
        return res.status(401).json(error);
    }

    if (err.message === 'Not allowed by CORS') {
        error.message = 'CORS policy violation';
        return res.status(403).json(error);
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        error.message = 'File size too large';
        return res.status(413).json(error);
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        error.message = 'Unexpected file field';
        return res.status(400).json(error);
    }

    if (err.code === 'ETIMEDOUT') {
        error.message = 'Request timeout';
        return res.status(408).json(error);
    }

    if (err.name === 'SequelizeConnectionError') {
        error.message = 'Database connection failed';
        return res.status(503).json(error);
    }

    if (err.status === 429) {
        error.message = 'Too many requests, please try again later';
        return res.status(429).json(error);
    }

    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json(error);
};

module.exports = errorHandler;
