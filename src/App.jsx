import React, { useState } from 'react';
import Header from './components/Header/Header';
import Canvas from './components/Canvas/Canvas';
import Toolbar from './components/Toolbar/Toolbar';
import ShapeCounter from './components/ShapeCounter/ShapeCounter';
import usePaintingState from './hooks/usePaintingState';
import './App.css';

function App() {
    const {
        paintingTitle,
        selectedTool,
        shapes,
        addShape,
        removeShape,
        updateTitle,
        changeTool,
        exportPainting,
        importPainting
    } = usePaintingState();

    const [notification, setNotification] = useState(null);

    const handleCanvasClick = (x, y) => {
        const newShape = addShape(x, y);
        if (newShape) {
            showNotification(`Added ${selectedTool} at (${Math.round(x)}, ${Math.round(y)})`, 'success');
        }
    };

    const handleDragDrop = (shapeType, x, y) => {
        changeTool(shapeType);

        const newShape = addShape(x, y, shapeType);

        if (newShape) {
            showNotification(`Dropped ${shapeType} at (${Math.round(x)}, ${Math.round(y)})`, 'success');
        }

    };

    const handleShapeDelete = (shapeId) => {
        const shapeToDelete = shapes.find(s => s.id === shapeId);
        if (shapeToDelete) {
            removeShape(shapeId);
            showNotification(`Deleted ${shapeToDelete.type}`, 'info');
        }
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleShapeDoubleClick = (shapeId) => {
        removeShape(shapeId);
    };

    const handleToolChange = (tool) => {
        changeTool(tool);
        showNotification(`Selected ${tool} tool`, 'info');
    };

    return (
        <div className="app">
            <div className="app-container">
                <Header
                    paintingTitle={paintingTitle}
                    setPaintingTitle={updateTitle}
                    onExport={exportPainting}
                    onImport={importPainting}
                />

                <main className="app-main">
                    <div className="app-content">
                        <div className="canvas-section">
                            <Canvas
                                shapes={shapes}
                                onCanvasClick={handleCanvasClick}
                                onShapeDelete={handleShapeDelete}
                                onShapeDoubleClick={handleShapeDoubleClick}
                                onDragDrop={handleDragDrop}
                                selectedTool={selectedTool}
                            />

                            <ShapeCounter shapes={shapes} />
                        </div>

                        <div className="sidebar">
                            <Toolbar
                                selectedTool={selectedTool}
                                onToolSelect={handleToolChange}
                            />
                        </div>
                    </div>
                </main>

                {/* Notification */}
                {notification && (
                    <div className={`notification notification-${notification.type}`}>
                        <span className="notification-message">{notification.message}</span>
                        <button
                            className="notification-close"
                            onClick={() => setNotification(null)}
                            aria-label="Close notification"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
