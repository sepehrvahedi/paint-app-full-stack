import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SHAPE_TYPES } from '../utils/shapeTypes';
import { exportPaintingData, downloadJsonFile, generateFilename } from '../utils/exportUtils';
import { importPaintingData } from '../utils/importUtils';
import { paintingApi } from '../services/paintingApi';

const usePaintingState = () => {
    const { token } = useAuth();
    const [paintingTitle, setPaintingTitle] = useState('My Painting');
    const [selectedTool, setSelectedTool] = useState(SHAPE_TYPES.CIRCLE);
    const [shapes, setShapes] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [paintingExists, setPaintingExists] = useState(false);
    const [statistics, setStatistics] = useState(null);

    const generateShapeId = useCallback(() => {
        return `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    useEffect(() => {
        if (token) {
            loadPaintingFromServer();
        }
    }, [token]);

    useEffect(() => {
        if (!hasUnsavedChanges || !paintingExists) return;

        const autoSaveInterval = setInterval(() => {
            if (hasUnsavedChanges) {
                savePaintingToServer(false);
            }
        }, 30000);

        return () => clearInterval(autoSaveInterval);
    }, [hasUnsavedChanges, paintingExists]);

    const addShape = useCallback((x, y, type = selectedTool) => {
        const newShape = {
            id: generateShapeId(),
            type,
            x,
            y,
            timestamp: new Date().toISOString()
        };

        setShapes(prevShapes => [...prevShapes, newShape]);
        setHasUnsavedChanges(true);
        return newShape;
    }, [selectedTool, generateShapeId]);

    const removeShape = useCallback((shapeId) => {
        setShapes(prevShapes => prevShapes.filter(shape => shape.id !== shapeId));
        setHasUnsavedChanges(true);
    }, []);

    const clearAllShapes = useCallback(() => {
        setShapes([]);
        setHasUnsavedChanges(true);
    }, []);

    const updateTitle = useCallback((title) => {
        setPaintingTitle(title);
        setHasUnsavedChanges(true);
    }, []);

    const changeTool = useCallback((tool) => {
        if (Object.values(SHAPE_TYPES).includes(tool)) {
            setSelectedTool(tool);
        }
    }, []);

    const savePaintingToServer = useCallback(async (showNotification = true) => {
        if (isSaving || !token) return { success: false, error: 'Cannot save at this time' };

        setIsSaving(true);

        try {
            const paintingData = {
                title: paintingTitle,
                shapes: shapes
            };

            const result = paintingExists
                ? await paintingApi.update(paintingData, token)
                : await paintingApi.save(paintingData, token);

            if (result.success) {
                setHasUnsavedChanges(false);
                setLastSaved(new Date());
                setPaintingExists(true);

                if (result.data?.statistics) {
                    setStatistics(result.data.statistics);
                }

                setIsSaving(false);
                return {
                    success: true,
                    message: showNotification ? result.message : null
                };
            } else {
                setIsSaving(false);
                return { success: false, error: result.error };
            }
        } catch (error) {
            setIsSaving(false);
            return { success: false, error: `Save failed: ${error.message}` };
        }
    }, [paintingTitle, shapes, isSaving, token, paintingExists]);

    const loadPaintingFromServer = useCallback(async () => {
        if (isLoading || !token) return { success: false, error: 'Cannot load at this time' };

        setIsLoading(true);

        try {
            const result = await paintingApi.load(token);

            if (result.success && result.data?.painting) {
                const { painting, statistics: stats } = result.data;

                setPaintingTitle(painting.title);
                setShapes(painting.shapes || []);
                setHasUnsavedChanges(false);
                setPaintingExists(true);
                setLastSaved(new Date(painting.timestamp));

                if (stats) {
                    setStatistics(stats);
                }

                setIsLoading(false);
                return { success: true, message: result.message, data: painting };
            } else {
                setPaintingExists(false);
                setIsLoading(false);
                return { success: true, message: 'No saved painting found. Starting fresh!' };
            }
        } catch (error) {
            setIsLoading(false);
            return { success: false, error: `Load failed: ${error.message}` };
        }
    }, [isLoading, token]);

    const deletePaintingFromServer = useCallback(async () => {
        if (!token || !paintingExists) return { success: false, error: 'No painting to delete' };

        try {
            const result = await paintingApi.delete(token);

            if (result.success) {
                setPaintingTitle('My Painting');
                setShapes([]);
                setHasUnsavedChanges(false);
                setPaintingExists(false);
                setLastSaved(null);
                setStatistics(null);

                return { success: true, message: result.message };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            return { success: false, error: `Delete failed: ${error.message}` };
        }
    }, [token, paintingExists]);

    const refreshStatistics = useCallback(async () => {
        if (!token) return { success: false, error: 'Not authenticated' };

        try {
            const result = await paintingApi.getStatistics(token);

            if (result.success && result.data?.statistics) {
                setStatistics(result.data.statistics);
                return { success: true, data: result.data.statistics };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            return { success: false, error: `Failed to get statistics: ${error.message}` };
        }
    }, [token]);

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
                setHasUnsavedChanges(true);

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

    return {
        paintingTitle,
        selectedTool,
        shapes,
        isExporting,
        isImporting,
        isSaving,
        isLoading,
        lastSaved,
        hasUnsavedChanges,
        paintingExists,
        statistics,

        addShape,
        removeShape,
        clearAllShapes,
        updateTitle,
        setPaintingTitle,
        changeTool,

        exportPainting,
        importPainting,

        savePaintingToServer,
        loadPaintingFromServer,
        deletePaintingFromServer,
        refreshStatistics,

        getShapeCount,
        getTotalShapeCount
    };
};

export default usePaintingState;
