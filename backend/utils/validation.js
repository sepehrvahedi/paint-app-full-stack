const Joi = require('joi');

const validateRegistration = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.alphanum': 'Username must contain only alphanumeric characters',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username must not exceed 30 characters',
                'any.required': 'Username is required'
            }),

        password: Joi.string()
            .min(6)
            .max(128)
            .required()
            .messages({
                'string.min': 'Password must be at least 6 characters long',
                'string.max': 'Password must not exceed 128 characters',
                'any.required': 'Password is required'
            }),
    });

    return schema.validate(data);
};

const validateLogin = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .required()
            .messages({
                'any.required': 'Username is required'
            }),

        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Password is required'
            })
    });

    return schema.validate(data);
};

const validatePainting = (data) => {
    const schema = Joi.object({
        title: Joi.string()
            .min(1)
            .max(100)
            .required()
            .messages({
                'string.min': 'Title must be at least 1 character long',
                'string.max': 'Title must not exceed 100 characters',
                'any.required': 'Title is required'
            }),

        description: Joi.string()
            .max(1000)
            .optional()
            .allow('')
            .messages({
                'string.max': 'Description must not exceed 1000 characters'
            }),

        canvasData: Joi.alternatives()
            .try(
                Joi.string(),
                Joi.object(),
                Joi.array()
            )
            .required()
            .messages({
                'any.required': 'Canvas data is required'
            }),

        thumbnail: Joi.string()
            .optional()
            .allow('')
            .messages({
                'string.base': 'Thumbnail must be a string'
            }),

        canvasWidth: Joi.number()
            .integer()
            .min(100)
            .max(2000)
            .optional()
            .default(800)
            .messages({
                'number.min': 'Canvas width must be at least 100 pixels',
                'number.max': 'Canvas width must not exceed 2000 pixels',
                'number.integer': 'Canvas width must be an integer'
            }),

        canvasHeight: Joi.number()
            .integer()
            .min(100)
            .max(2000)
            .optional()
            .default(600)
            .messages({
                'number.min': 'Canvas height must be at least 100 pixels',
                'number.max': 'Canvas height must not exceed 2000 pixels',
                'number.integer': 'Canvas height must be an integer'
            }),

        backgroundColor: Joi.string()
            .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
            .optional()
            .default('#ffffff')
            .messages({
                'string.pattern.base': 'Background color must be a valid hex color (e.g., #ffffff)'
            }),

        isPublic: Joi.boolean()
            .optional()
            .default(false)
            .messages({
                'boolean.base': 'isPublic must be a boolean value'
            }),

        tags: Joi.array()
            .items(Joi.string().max(50))
            .max(10)
            .optional()
            .messages({
                'array.max': 'Maximum 10 tags allowed',
                'string.max': 'Each tag must not exceed 50 characters'
            })
    });

    return schema.validate(data);
};

const validatePaginationQuery = (data) => {
    const schema = Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .optional()
            .default(1)
            .messages({
                'number.min': 'Page must be at least 1',
                'number.integer': 'Page must be an integer'
            }),

        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .optional()
            .default(10)
            .messages({
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit must not exceed 100',
                'number.integer': 'Limit must be an integer'
            }),

        search: Joi.string()
            .max(100)
            .optional()
            .allow('')
            .messages({
                'string.max': 'Search term must not exceed 100 characters'
            })
    });

    return schema.validate(data);
};

module.exports = {
    validateRegistration,
    validateLogin,
    validatePainting,
    validatePaginationQuery
};
