import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/Auth/AuthPage';
import Header from './components/Header/Header';
import Canvas from './components/Canvas/Canvas';
import Toolbar from './components/Toolbar/Toolbar';
import ShapeCounter from './components/ShapeCounter/ShapeCounter';
import usePaintingState from './hooks/usePaintingState';
import './App.css';

function AppContent() {
    const { isAuthenticated, loading } = useAuth();
    const {
        paintingTitle,
        selectedTool,
        shapes,
        addShape,
        removeShape,
        updateTitle,
        changeTool,
        exportPainting,
        importPainting,
        // Cloud-related state and functions
        isSaving,
        isLoading,
        lastSaved,
        hasUnsavedChanges,
        paintingExists,
        savePaintingToServer,
        loadPaintingFromServer,
        deletePaintingFromServer,
        statistics
    } = usePaintingState();

    const [notification, setNotification] = useState(null);

    // Show loading screen while checking authentication
    if (loading) {
        return (
            <div className="app-loading">
                <div className="loading-spinner-large"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Show auth page if user is not authenticated
    if (!isAuthenticated()) {
        return <AuthPage />;
    }

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

    const handleImport = async (file) => {
        const result = await importPainting(file);
        if (result.success) {
            showNotification(result.message, 'success');
        } else {
            showNotification(result.error, 'error');
        }
    };

    const handleExport = async () => {
        const result = await exportPainting();
        if (result.success) {
            showNotification(result.message, 'success');
        } else {
            showNotification(result.error, 'error');
        }
    };

    // Cloud operations
    const handleSaveToCloud = async () => {
        const result = await savePaintingToServer();
        if (result.success && result.message) {
            showNotification(result.message, 'success');
        } else if (!result.success) {
            showNotification(result.error, 'error');
        }
    };

    const handleLoadFromCloud = async () => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                'You have unsaved changes. Loading from cloud will overwrite them. Continue?'
            );
            if (!confirmed) return;
        }

        const result = await loadPaintingFromServer();
        if (result.success) {
            showNotification(result.message, 'success');
        } else {
            showNotification(result.error, 'error');
        }
    };

    const handleDeleteFromCloud = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your painting from the cloud? This cannot be undone.'
        );
        if (!confirmed) return;

        const result = await deletePaintingFromServer();
        if (result.success) {
            showNotification(result.message, 'success');
        } else {
            showNotification(result.error, 'error');
        }
    };

    return (
        <div className="app">
            <div className="app-container">
                <Header
                    paintingTitle={paintingTitle}
                    setPaintingTitle={updateTitle}
                    onExport={handleExport}
                    onImport={handleImport}
                    // Cloud-related props
                    hasUnsavedChanges={hasUnsavedChanges}
                    isSaving={isSaving}
                    lastSaved={lastSaved}
                    paintingExists={paintingExists}
                    onSaveToCloud={handleSaveToCloud}
                    onLoadFromCloud={handleLoadFromCloud}
                    onDeleteFromCloud={handleDeleteFromCloud}
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

                {/* Loading overlay */}
                {(isLoading || isSaving) && (
                    <div className="app-overlay">
                        <div className="overlay-content">
                            <div className="loading-spinner-large"></div>
                            <p>{isLoading ? 'Loading painting...' : 'Saving painting...'}</p>
                        </div>
                    </div>
                )}

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

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
