import React from 'react';
import { SHAPE_TYPES } from '../../utils/shapeTypes';
import './Toolbar.css';

const Toolbar = ({ selectedTool, onToolSelect }) => {
    const tools = [
        {
            type: SHAPE_TYPES.CIRCLE,
            name: 'Circle',
            icon: '●',
            description: 'Draw circles'
        },
        {
            type: SHAPE_TYPES.SQUARE,
            name: 'Square',
            icon: '■',
            description: 'Draw squares'
        },
        {
            type: SHAPE_TYPES.TRIANGLE,
            name: 'Triangle',
            icon: '▲',
            description: 'Draw triangles'
        }
    ];

    const handleDragStart = (event, toolType) => {
        event.dataTransfer.setData('application/json', JSON.stringify({
            type: 'SHAPE_TOOL',
            shapeType: toolType
        }));
        event.dataTransfer.effectAllowed = 'copy';

        event.target.classList.add('dragging');

        const dragImage = event.target.cloneNode(true);
        dragImage.style.transform = 'scale(0.8)';
        dragImage.style.opacity = '0.8';
        document.body.appendChild(dragImage);
        event.dataTransfer.setDragImage(dragImage, 25, 25);

        setTimeout(() => {
            if (document.body.contains(dragImage)) {
                document.body.removeChild(dragImage);
            }
        }, 0);
    };

    const handleDragEnd = (event) => {
        event.target.classList.remove('dragging');
    };

    return (
        <div className="toolbar">
            <div className="toolbar-header">
                <h3 className="toolbar-title">
                    <span className="toolbar-icon">🎨</span>
                    Tools
                </h3>
                <p className="toolbar-subtitle">Click to select or drag to canvas</p>
            </div>

            <div className="toolbar-tools">
                {tools.map((tool) => (
                    <button
                        key={tool.type}
                        className={`tool-button ${selectedTool === tool.type ? 'selected' : ''}`}
                        onClick={() => onToolSelect(tool.type)}
                        onDragStart={(e) => handleDragStart(e, tool.type)}
                        onDragEnd={handleDragEnd}
                        draggable={true}
                        title={`${tool.description} - Click to select or drag to canvas`}
                        data-tool={tool.type}
                        aria-label={`${tool.name} tool`}
                        aria-pressed={selectedTool === tool.type}
                    >
                        <div className="tool-icon-container">
                            <span className="tool-icon">{tool.icon}</span>
                        </div>
                        <div className="tool-info">
                            <span className="tool-name">{tool.name}</span>
                            <span className="tool-hint">Drag me!</span>
                        </div>
                        {selectedTool === tool.type && (
                            <div className="tool-active-indicator">
                                <span className="checkmark">✓</span>
                            </div>
                        )}
                        <div className="tool-drag-indicator">
                            <span className="drag-icon">⋮⋮</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="toolbar-footer">
                <div className="toolbar-status">
                    <span className="status-dot"></span>
                    <span className="status-text">Ready</span>
                </div>
                <div className="toolbar-tip">
                    <span className="tip-icon">💡</span>
                    <span className="tip-text">Tip: Drag tools directly to canvas!</span>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
