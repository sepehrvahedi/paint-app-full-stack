import React from 'react';
import { SHAPE_TYPES } from '../../utils/shapeTypes';
import './Shape.css';

const Shape = ({ shape, onDoubleClick }) => {
    const { type, x, y } = shape;

    const handleDoubleClick = (event) => {
        event.stopPropagation();
        onDoubleClick();
    };

    const getShapeElement = () => {
        const commonProps = {
            className: `shape shape-${type}`,
            onDoubleClick: handleDoubleClick,
            title: `Double-click to delete this ${type}`
        };

        switch (type) {
            case SHAPE_TYPES.CIRCLE:
                return (
                    <div
                        {...commonProps}
                        className={`${commonProps.className} circle`}
                    />
                );

            case SHAPE_TYPES.SQUARE:
                return (
                    <div
                        {...commonProps}
                        className={`${commonProps.className} square`}
                    />
                );

            case SHAPE_TYPES.TRIANGLE:
                return (
                    <div
                        {...commonProps}
                        className={`${commonProps.className} triangle`}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div
            className="shape-container"
            style={{
                position: 'absolute',
                left: x - 15,
                top: y - 15,
                zIndex: 1
            }}
        >
            {getShapeElement()}
        </div>
    );
};

export default Shape;
