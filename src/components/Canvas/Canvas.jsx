import React, { useState } from 'react';
import Shape from '../Shape/Shape';
import './Canvas.css';

const Canvas = ({
                    shapes,
                    selectedTool,
                    onCanvasClick,
                    onShapeDoubleClick,
                    onDragDrop
                }) => {
    const [dragOver, setDragOver] = useState(false);
    const [draggedShapeType, setDraggedShapeType] = useState(null);

    const handleCanvasClick = (event) => {
        if (!selectedTool) return;

        const clickedElement = event.target;

        if (
            clickedElement.closest('.shape') ||
            clickedElement.classList.contains('shape') ||
            clickedElement.closest('[data-shape-id]')
        ) {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const margin = 30;
        const adjustedX = Math.max(margin, Math.min(x, rect.width - margin));
        const adjustedY = Math.max(margin, Math.min(y, rect.height - margin));

        onCanvasClick(adjustedX, adjustedY);
    };

    const handleShapeDoubleClick = (shapeId) => {
        if (onShapeDoubleClick) {
            onShapeDoubleClick(shapeId);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';

        if (!dragOver) {
            setDragOver(true);
        }

        try {
            const data = JSON.parse(event.dataTransfer.getData('application/json') || '{}');
            if (data.type === 'SHAPE_TOOL' && data.shapeType !== draggedShapeType) {
                setDraggedShapeType(data.shapeType);
            }
        } catch (e) {}
    };

    const handleDragLeave = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDragOver(false);
            setDraggedShapeType(null);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragOver(false);
        setDraggedShapeType(null);

        try {
            const data = JSON.parse(event.dataTransfer.getData('application/json'));

            if (data.type === 'SHAPE_TOOL') {
                const rect = event.currentTarget.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const margin = 30;
                const adjustedX = Math.max(margin, Math.min(x, rect.width - margin));
                const adjustedY = Math.max(margin, Math.min(y, rect.height - margin));

                if (onDragDrop) {
                    onDragDrop(data.shapeType, adjustedX, adjustedY);
                }
            }
        } catch (e) {
            console.error('Error parsing drop data:', e);
        }
    };

    const hasShapes = shapes.length > 0;

    return (
        <div className="canvas-container">
            <div className="canvas-header">
                <div className="canvas-info">
                    <span className="canvas-icon">🎯</span>
                    <div className="canvas-details">
                        <span className="canvas-title">Drawing Canvas</span>
                        <span className="canvas-meta">
                            {hasShapes ? `${shapes.length} shape${shapes.length !== 1 ? 's' : ''}` : 'Ready to create'}
                        </span>
                    </div>
                </div>
                <div className="canvas-status">
                    <div className={`status-indicator ${selectedTool ? 'active' : 'idle'}`}>
                        <span className="status-dot"></span>
                        <span className="status-text">
                            {dragOver && draggedShapeType
                                ? `Drop to add ${draggedShapeType}`
                                : selectedTool
                                    ? `${selectedTool} tool`
                                    : 'No tool selected'
                            }
                        </span>
                    </div>
                </div>
            </div>

            <div
                className={`canvas ${selectedTool ? 'has-tool' : 'no-tool'} ${hasShapes ? 'has-shapes' : ''} ${dragOver ? 'drag-over' : ''}`}
                onClick={handleCanvasClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                data-has-shapes={hasShapes}
                role="application"
                aria-label="Drawing canvas"
                tabIndex={0}
            >
                <div className="canvas-grid"></div>
                <div className="canvas-content">
                    {!hasShapes && !dragOver && (
                        <div className="canvas-placeholder">
                            <div className="placeholder-icon">✨</div>
                            <div className="placeholder-text">
                                <h3>Start Creating</h3>
                                <p>
                                    {selectedTool
                                        ? `Click anywhere to place a ${selectedTool}`
                                        : 'Select a tool from the toolbar or drag one here'
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {}
                    {dragOver && (
                        <div className="canvas-drop-indicator">
                            <div className="drop-indicator-content">
                                <div className="drop-icon">
                                    {draggedShapeType === 'circle' && '●'}
                                    {draggedShapeType === 'square' && '■'}
                                    {draggedShapeType === 'triangle' && '▲'}
                                </div>
                                <div className="drop-text">
                                    <h3>Drop to create {draggedShapeType}</h3>
                                    <p>Release to place the shape here</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {shapes.map((shape) => (
                        <Shape
                            key={shape.id}
                            shape={shape}
                            onDoubleClick={() => handleShapeDoubleClick(shape.id)}
                        />
                    ))}
                </div>

                <div className="canvas-overlay">
                    <div className="canvas-corners">
                        <div className="corner top-left"></div>
                        <div className="corner top-right"></div>
                        <div className="corner bottom-left"></div>
                        <div className="corner bottom-right"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Canvas;
