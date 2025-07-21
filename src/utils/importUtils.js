import { isValidShapeType } from './shapeTypes';

export const importPaintingData = async (file) => {
    try {
        const text = await file.text();
        const data = JSON.parse(text);

        const validationResult = validatePaintingData(data);

        if (!validationResult.isValid) {
            throw new Error(`Invalid file format: ${validationResult.errors.join(', ')}`);
        }

        return {
            success: true,
            data: validationResult.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

export const validatePaintingData = (data) => {
    const errors = [];

    if (!data || typeof data !== 'object') {
        errors.push('Data must be a valid JSON object');
        return { isValid: false, errors };
    }

    if (typeof data.title !== 'string') {
        errors.push('Missing or invalid title field');
    }

    if (!Array.isArray(data.shapes)) {
        errors.push('Missing or invalid shapes array');
        return { isValid: false, errors };
    }

    const validShapes = [];
    data.shapes.forEach((shape, index) => {
        const shapeValidation = validateShape(shape, index);
        if (shapeValidation.isValid) {
            validShapes.push(shapeValidation.shape);
        } else {
            errors.push(...shapeValidation.errors);
        }
    });

    const hasValidShapes = validShapes.length > 0;
    const hasInvalidShapes = validShapes.length < data.shapes.length;

    if (hasInvalidShapes && hasValidShapes) {
        console.warn(`Some shapes were invalid and will be skipped: ${errors.join(', ')}`);
    }

    const isValid = errors.length === 0 || hasValidShapes;

    return {
        isValid,
        errors,
        data: {
            title: data.title || 'Imported Painting',
            shapes: validShapes,
            metadata: data.metadata
        }
    };
};

export const validateShape = (shape, index) => {
    const errors = [];

    if (!shape || typeof shape !== 'object') {
        errors.push(`Shape ${index + 1}: Must be a valid object`);
        return { isValid: false, errors };
    }

    if (!isValidShapeType(shape.type)) {
        errors.push(`Shape ${index + 1}: Invalid shape type "${shape.type}"`);
        return { isValid: false, errors };
    }

    if (typeof shape.x !== 'number' || typeof shape.y !== 'number') {
        errors.push(`Shape ${index + 1}: Invalid coordinates`);
        return { isValid: false, errors };
    }

    if (shape.x < 0 || shape.x > 800 || shape.y < 0 || shape.y > 400) {
        // Don't reject, but adjust coordinates
        shape.x = Math.max(30, Math.min(shape.x, 770));
        shape.y = Math.max(30, Math.min(shape.y, 370));
    }

    const validShape = {
        id: shape.id || `imported_${Date.now()}_${index}`,
        type: shape.type,
        x: shape.x,
        y: shape.y,
        timestamp: shape.timestamp || new Date().toISOString()
    };

    return {
        isValid: true,
        shape: validShape,
        errors: []
    };
};

export const importFromJsonString = (jsonString) => {
    try {
        const data = JSON.parse(jsonString);
        return validatePaintingData(data);
    } catch (error) {
        return {
            isValid: false,
            errors: ['Invalid JSON format']
        };
    }
};

export const isValidJsonFile = (file) => {
    return file && file.type === 'application/json' || file.name.endsWith('.json');
};

export const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};
