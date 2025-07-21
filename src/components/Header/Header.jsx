import React, { useRef } from 'react';
import './Header.css';

const Header = ({
                    paintingTitle,
                    setPaintingTitle,
                    onExport,
                    onImport
                }) => {
    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onImport(file);
        }
        event.target.value = '';
    };

    const handleTitleChange = (event) => {
        setPaintingTitle(event.target.value);
    };

    return (
        <header className="header">
            <div className="header-brand">
                <div className="brand-icon">
                    <span className="brand-symbol">🎨</span>
                </div>
                <div className="brand-info">
                    <h1 className="brand-title">Canvas Studio</h1>
                    <span className="brand-subtitle">Professional Drawing Tool</span>
                </div>
            </div>

            <div className="header-center">
                <div className="title-input-container">
                    <label htmlFor="painting-title" className="title-label">
                        <span className="title-icon">📝</span>
                        Project Name
                    </label>
                    <input
                        id="painting-title"
                        type="text"
                        value={paintingTitle}
                        onChange={handleTitleChange}
                        className="painting-title-input"
                        placeholder="Untitled Masterpiece"
                        maxLength={50}
                    />
                </div>
            </div>

            <div className="header-actions">
                <button
                    onClick={handleImportClick}
                    className="action-button import-button"
                    title="Import project from file"
                >
                    <span className="button-icon">📂</span>
                    <span className="button-text">Import</span>
                </button>
                <button
                    onClick={onExport}
                    className="action-button export-button"
                    title="Export project to file"
                >
                    <span className="button-icon">💾</span>
                    <span className="button-text">Export</span>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="file-input-hidden"
                    aria-label="Import file"
                />
            </div>
        </header>
    );
};

export default Header;
