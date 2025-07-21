export const exportPaintingData = (paintingTitle, shapes) => {
    return {
        title: paintingTitle || 'Untitled Painting',
        timestamp: new Date().toISOString(),
        version: '1.0',
        shapes: shapes.map(shape => ({
            id: shape.id,
            type: shape.type,
            x: shape.x,
            y: shape.y,
            timestamp: shape.timestamp || new Date().toISOString()
        })),
        metadata: {
            totalShapes: shapes.length,
            shapeTypes: getShapeTypeCounts(shapes),
            canvasSize: {
                width: 800,
                height: 400
            }
        }
    };
};

const getShapeTypeCounts = (shapes) => {
    const counts = {};
    shapes.forEach(shape => {
        counts[shape.type] = (counts[shape.type] || 0) + 1;
    });
    return counts;
};
export const downloadJsonFile = (data, filename) => {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename || 'painting'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Error downloading file:', error);
        return false;
    }
};
export const generateFilename = (title) => {
    const cleanTitle = title
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    return `${cleanTitle || 'painting'}_${timestamp}`;
};
