const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

const ERROR_MESSAGES = {
    INTERNAL_ERROR: 'Internal server error',
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCESS_DENIED: 'Access denied',
    UNAUTHORIZED: 'Authorization required',
    NOT_FOUND: 'Resource not found',
    ALREADY_EXISTS: 'Resource already exists',
    VALIDATION_ERROR: 'Validation error',
    PERMISSION_DENIED: 'Permission denied'
};

const SUCCESS_MESSAGES = {
    USER_REGISTERED: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PAINTING_CREATED: 'Painting created successfully',
    PAINTING_UPDATED: 'Painting updated successfully',
    PAINTING_DELETED: 'Painting deleted successfully',
    PROFILE_UPDATED: 'Profile updated successfully'
};

const VALIDATION = {
    USERNAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 30
    },
    PASSWORD: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 128
    },
    PAINTING_TITLE: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 100
    },
    PAINTING_DESCRIPTION: {
        MAX_LENGTH: 1000
    },
    CANVAS: {
        MIN_WIDTH: 100,
        MAX_WIDTH: 2000,
        MIN_HEIGHT: 100,
        MAX_HEIGHT: 2000
    },
    TAG: {
        MAX_LENGTH: 50,
        MAX_COUNT: 10
    },
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100
    }
};

const DATABASE = {
    TABLES: {
        USERS: 'users',
        PAINTINGS: 'paintings'
    },
    DEFAULT_VALUES: {
        CANVAS_WIDTH: 800,
        CANVAS_HEIGHT: 600,
        BACKGROUND_COLOR: '#ffffff',
        IS_PUBLIC: false,
        IS_ACTIVE: true
    }
};

const JWT = {
    DEFAULT_EXPIRES_IN: '7d',
    REFRESH_THRESHOLD: 24 * 60 * 60 * 1000,
    ALGORITHM: 'HS256'
};

const FILE_UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024,
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
    UPLOAD_PATH: 'uploads/'
};

const RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
    MESSAGE: 'Too many requests from this IP, please try again later'
};

const SHAPE_TYPES = {
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
    LINE: 'line',
    FREEHAND: 'freehand',
    TEXT: 'text',
    POLYGON: 'polygon',
    ELLIPSE: 'ellipse'
};

const DRAW_TOOLS = {
    PEN: 'pen',
    BRUSH: 'brush',
    ERASER: 'eraser',
    FILL: 'fill',
    SELECT: 'select',
    MOVE: 'move'
};

const EXPORT_FORMATS = {
    PNG: 'png',
    JPEG: 'jpeg',
    SVG: 'svg',
    JSON: 'json'
};

const CANVAS_DEFAULTS = {
    WIDTH: 800,
    HEIGHT: 600,
    BACKGROUND_COLOR: '#ffffff',
    STROKE_COLOR: '#000000',
    FILL_COLOR: '#ffffff',
    STROKE_WIDTH: 2,
    FONT_SIZE: 16,
    FONT_FAMILY: 'Arial'
};

const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
    },
    PAINTINGS: {
        BASE: '/api/paintings',
        MY: '/api/paintings/my',
        PUBLIC: '/api/paintings/public',
        BY_ID: '/api/paintings/:id'
    },
    USERS: {
        BASE: '/api/users',
        PROFILE: '/api/users/profile',
        STATS: '/api/users/stats',
        BY_ID: '/api/users/:id'
    }
};

module.exports = {
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    VALIDATION,
    DATABASE,
    JWT,
    FILE_UPLOAD,
    RATE_LIMIT,
    SHAPE_TYPES,
    DRAW_TOOLS,
    EXPORT_FORMATS,
    CANVAS_DEFAULTS,
    API_ENDPOINTS
};
