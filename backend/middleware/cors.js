const cors = require('cors');

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            process.env.CORS_ORIGIN
        ].filter(Boolean);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'Pragma'
    ],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400
};

if (process.env.NODE_ENV === 'development') {
    corsOptions.origin = true;
}

module.exports = cors(corsOptions);
