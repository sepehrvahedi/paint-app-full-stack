import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserProfile from '../UserProfile/UserProfile';
import CloudStatus from '../CloudStatus/CloudStatus';
import './Header.css';

function Header({
                    paintingTitle,
                    setPaintingTitle,
                    onExport,
                    onImport,
                    // Cloud-related props
                    hasUnsavedChanges,
                    isSaving,
                    lastSaved,
                    paintingExists,
                    onSaveToCloud,
                    onLoadFromCloud,
                    onDeleteFromCloud
                }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(paintingTitle);
    const { isAuthenticated } = useAuth();

    const handleTitleClick = () => {
        setIsEditing(true);
        setTempTitle(paintingTitle);
    };

    const handleTitleSubmit = (e) => {
        e.preventDefault();
        if (tempTitle.trim()) {
            setPaintingTitle(tempTitle.trim());
        }
        setIsEditing(false);
    };

    const handleTitleCancel = () => {
        setTempTitle(paintingTitle);
        setIsEditing(false);
    };

    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            onImport(file);
            event.target.value = '';
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <div className="app-branding">
                        <div className="app-icon">🎨</div>
                        <div className="app-info">
                            <h1 className="app-title">Painting Studio</h1>
                            <span className="app-subtitle">Create & Share</span>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="painting-title-section">
                        {isEditing ? (
                            <form onSubmit={handleTitleSubmit} className="title-edit-form">
                                <input
                                    type="text"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    className="title-input"
                                    autoFocus
                                    onBlur={handleTitleCancel}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            handleTitleCancel();
                                        }
                                    }}
                                />
                            </form>
                        ) : (
                            <div className="title-display">
                                <h2
                                    className="painting-title"
                                    onClick={handleTitleClick}
                                    title="Click to edit title"
                                >
                                    {paintingTitle}
                                </h2>
                                <span className="edit-hint">✏️</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="header-center">
                    {isAuthenticated() && (
                        <CloudStatus
                            hasUnsavedChanges={hasUnsavedChanges}
                            isSaving={isSaving}
                            lastSaved={lastSaved}
                            paintingExists={paintingExists}
                            onSave={onSaveToCloud}
                            onLoad={onLoadFromCloud}
                            onDelete={onDeleteFromCloud}
                        />
                    )}
                </div>

                <div className="header-right">
                    <div className="header-actions">
                        <button
                            className="header-button export-button"
                            onClick={onExport}
                            title="Export painting to file"
                        >
                            <span className="button-icon">💾</span>
                            <span className="button-text">Export</span>
                        </button>

                        <label className="header-button import-button" title="Import painting from file">
                            <span className="button-icon">📁</span>
                            <span className="button-text">Import</span>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileImport}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    {isAuthenticated() && (
                        <>
                            <div className="divider"></div>
                            <UserProfile />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
