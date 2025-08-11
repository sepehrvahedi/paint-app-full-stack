package com.example.canvasdrawingapi.model.painting;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Metadata {
    private int totalShapes;
    private Map<String, Integer> shapeTypes;
    private CanvasSize canvasSize;

    public Metadata() {
        this.totalShapes = 0;
        this.shapeTypes = new HashMap<>();
        this.canvasSize = new CanvasSize();
    }

    public void updateFromShapes(List<Shape> shapes) {
        this.totalShapes = shapes.size();
        this.shapeTypes = new HashMap<>();

        for (Shape shape : shapes) {
            String type = shape.getType();
            shapeTypes.put(type, shapeTypes.getOrDefault(type, 0) + 1);
        }
    }

    // Getters and Setters
    public int getTotalShapes() {
        return totalShapes;
    }

    public Map<String, Integer> getShapeTypes() {
        return shapeTypes;
    }

    public CanvasSize getCanvasSize() {
        return canvasSize;
    }
}
