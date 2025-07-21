export const SHAPE_TYPES = {
    CIRCLE: 'circle',
    SQUARE: 'square',
    TRIANGLE: 'triangle'
};

export const SHAPE_CONFIG = {
    [SHAPE_TYPES.CIRCLE]: {
        name: 'Circle',
        icon: '○',
        color: '#007bff'
    },
    [SHAPE_TYPES.SQUARE]: {
        name: 'Square',
        icon: '□',
        color: '#28a745'
    },
    [SHAPE_TYPES.TRIANGLE]: {
        name: 'Triangle',
        icon: '△',
        color: '#ffc107'
    }
};

export const isValidShapeType = (type) => {
    return Object.values(SHAPE_TYPES).includes(type);
};

export const getAllShapeTypes = () => {
    return Object.values(SHAPE_TYPES);
};

export const getShapeDisplayName = (type) => {
    return SHAPE_CONFIG[type]?.name || 'Unknown';
};

export const getShapeIcon = (type) => {
    return SHAPE_CONFIG[type]?.icon || '?';
};

export const getShapeColor = (type) => {
    return SHAPE_CONFIG[type]?.color || '#000000';
};
