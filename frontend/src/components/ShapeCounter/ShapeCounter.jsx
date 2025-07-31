import React from 'react';
import { SHAPE_TYPES } from '../../utils/shapeTypes';
import './ShapeCounter.css';

const ShapeCounter = ({ shapes }) => {
    const getShapeCount = (shapeType) => {
        return shapes.filter(shape => shape.type === shapeType).length;
    };

    const totalShapes = shapes.length;

    const counters = [
        {
            type: SHAPE_TYPES.CIRCLE,
            icon: '●',
            name: 'Circles',
            count: getShapeCount(SHAPE_TYPES.CIRCLE),
            color: '#667eea'
        },
        {
            type: SHAPE_TYPES.SQUARE,
            icon: '■',
            name: 'Squares',
            count: getShapeCount(SHAPE_TYPES.SQUARE),
            color: '#48bb78'
        },
        {
            type: SHAPE_TYPES.TRIANGLE,
            icon: '▲',
            name: 'Triangles',
            count: getShapeCount(SHAPE_TYPES.TRIANGLE),
            color: '#ed8936'
        }
    ];

    return (
        <div className="shape-counter">
            <div className="counter-header">
                <div className="counter-title">
                    <span className="counter-title-icon">📊</span>
                    <span className="counter-title-text">Shape Analytics</span>
                </div>
                <div className="total-count">
                    <span className="total-label">Total:</span>
                    <span className="total-number">{totalShapes}</span>
                </div>
            </div>

            <div className="counter-grid">
                {counters.map((counter) => (
                    <div
                        key={counter.type}
                        className="counter-item"
                        style={{ '--shape-color': counter.color }}
                    >
                        <div className="counter-icon-wrapper">
                            <span
                                className="counter-icon"
                                style={{ color: counter.color }}
                            >
                                {counter.icon}
                            </span>
                        </div>
                        <div className="counter-details">
                            <span className="counter-name">{counter.name}</span>
                            <div className="counter-number-wrapper">
                                <span className="counter-number">{counter.count}</span>
                                {totalShapes > 0 && (
                                    <span className="counter-percentage">
                                        {Math.round((counter.count / totalShapes) * 100)}%
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="counter-progress">
                            <div
                                className="counter-progress-bar"
                                style={{
                                    width: totalShapes > 0 ? `${(counter.count / Math.max(totalShapes, 1)) * 100}%` : '0%',
                                    backgroundColor: counter.color
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {totalShapes === 0 && (
                <div className="counter-empty">
                    <span className="empty-icon">🎨</span>
                    <span className="empty-text">Start creating shapes to see analytics</span>
                </div>
            )}
        </div>
    );
};

export default ShapeCounter;
