import { useState, useCallback } from 'react';
import { SHAPE_TYPES } from '../utils/shapeTypes';
import { exportPaintingData, downloadJsonFile, generateFilename } from '../utils/exportUtils';
import { importPaintingData } from '../utils/importUtils';

const usePaintingState = () => {
    const [paintingTitle, setPaintingTitle] = useState('My Painting');
    const [selectedTool, setSelectedTool] = useState(SHAPE_TYPES.CIRCLE);
    const [shapes, setShapes] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const generateShapeId = useCallback(() => {
        return `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    const addShape = useCallback((x, y, type = selectedTool) => {
        const newShape = {
            id: generateShapeId(),
            type,
            x,
            y,
            timestamp: new Date().toISOString()
        };

        setShapes(prevShapes => [...prevShapes, newShape]);
        return newShape;
    }, [selectedTool, generateShapeId]);

    const removeShape = useCallback((shapeId) => {
        setShapes(prevShapes => prevShapes.filter(shape => shape.id !== shapeId));
    }, []);


    const clearAllShapes = useCallback(() => {
        setShapes([]);
    }, []);

    const updateTitle = useCallback((title) => {
        setPaintingTitle(title);
    }, []);

    const changeTool = useCallback((tool) => {
        if (Object.values(SHAPE_TYPES).includes(tool)) {
            setSelectedTool(tool);
        }
    }, []);

    const exportPainting = useCallback(async () => {
        if (isExporting) return { success: false, error: 'Export already in progress' };

        setIsExporting(true);

        try {
            const paintingData = exportPaintingData(paintingTitle, shapes);
            const filename = generateFilename(paintingTitle);
            const success = downloadJsonFile(paintingData, filename);

            setIsExporting(false);

            if (success) {
                return { success: true, message: 'Painting exported successfully!' };
            } else {
                return { success: false, error: 'Failed to download file' };
            }
        } catch (error) {
            setIsExporting(false);
            return { success: false, error: `Export failed: ${error.message}` };
        }
    }, [paintingTitle, shapes, isExporting]);

    const importPainting = useCallback(async (file) => {
        if (isImporting) return { success: false, error: 'Import already in progress' };

        if (!file) {
            return { success: false, error: 'No file selected' };
        }

        setIsImporting(true);

        try {
            const result = await importPaintingData(file);

            if (result.success) {
                const { data } = result;
                setPaintingTitle(data.title);
                setShapes(data.shapes);

                setIsImporting(false);
                return {
                    success: true,
                    message: `Imported "${data.title}" with ${data.shapes.length} shapes`
                };
            } else {
                setIsImporting(false);
                return { success: false, error: result.error };
            }
        } catch (error) {
            setIsImporting(false);
            return { success: false, error: `Import failed: ${error.message}` };
        }
    }, [isImporting]);

    const getShapeCount = useCallback((shapeType) => {
        return shapes.filter(shape => shape.type === shapeType).length;
    }, [shapes]);

    const getTotalShapeCount = useCallback(() => {
        return shapes.length;
    }, [shapes]);

    const hasUnsavedChanges = useCallback(() => {
        return shapes.length > 0;
    }, [shapes]);

    return {
        paintingTitle,
        selectedTool,
        shapes,
        isExporting,
        isImporting,

        addShape,
        removeShape,
        clearAllShapes,
        updateTitle,
        setPaintingTitle,
        changeTool,
        exportPainting,
        importPainting,

        getShapeCount,
        getTotalShapeCount,
        hasUnsavedChanges
    };
};

export default usePaintingState;
