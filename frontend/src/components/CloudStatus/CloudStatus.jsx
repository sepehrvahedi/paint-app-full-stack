import React from 'react';
import './CloudStatus.css';

const CloudStatus = ({
                         hasUnsavedChanges,
                         isSaving,
                         lastSaved,
                         paintingExists,
                         onSave,
                         onLoad,
                         onDelete
                     }) => {
    const getStatusIcon = () => {
        if (isSaving) return '⏳';
        if (hasUnsavedChanges) return '⚠️';
        if (paintingExists) return '☁️';
        return '📝';
    };

    const getStatusText = () => {
        if (isSaving) return 'Saving...';
        if (hasUnsavedChanges) return 'Unsaved changes';
        if (lastSaved) return `Saved ${formatTime(lastSaved)}`;
        return 'Not saved to cloud';
    };

    const formatTime = (date) => {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'just now';
    };

    return (
        <div className="cloud-status">
            <div className="status-info">
                <span className="status-icon">{getStatusIcon()}</span>
                <span className="status-text">{getStatusText()}</span>
            </div>

            <div className="cloud-actions">
                <button
                    className="cloud-button save-button"
                    onClick={onSave}
                    disabled={isSaving || (!hasUnsavedChanges && paintingExists)}
                    title="Save to cloud"
                >
                    {isSaving ? '⏳' : '💾'}
                </button>

                <button
                    className="cloud-button load-button"
                    onClick={onLoad}
                    disabled={isSaving}
                    title="Load from cloud"
                >
                    📥
                </button>

                {paintingExists && (
                    <button
                        className="cloud-button delete-button"
                        onClick={onDelete}
                        disabled={isSaving}
                        title="Delete from cloud"
                    >
                        🗑️
                    </button>
                )}
            </div>
        </div>
    );
};

export default CloudStatus;
