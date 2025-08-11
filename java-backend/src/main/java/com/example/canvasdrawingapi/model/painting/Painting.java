package com.example.canvasdrawingapi.model.painting;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Painting {
    private String title;
    private String timestamp;
    private String version;
    private List<Shape> shapes;
    private Metadata metadata;
    private boolean valid;

    public Painting() {
        this.title = "Untitled";
        this.timestamp = Instant.now().toString();
        this.version = "1.0";
        this.shapes = new ArrayList<>();
        this.metadata = new Metadata();
    }

    public Painting(String title) {
        this();
        this.title = title;
    }

    public static Painting fromJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            Painting painting = mapper.readValue(json, Painting.class);
            if (painting.shapes == null) {
                painting.shapes = new ArrayList<>();
            }
            if (painting.metadata == null) {
                painting.metadata = new Metadata();
            }
            painting.metadata.updateFromShapes(painting.shapes);
            return painting;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String toJson() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean addShape(Shape shape) {
        if (shape != null && shape.isValid()) {
            this.shapes.add(shape);
            this.metadata.updateFromShapes(this.shapes);
            return true;
        }
        return false;
    }

    public boolean removeShape(String shapeId) {
        boolean removed = this.shapes.removeIf(shape -> shape.getId().equals(shapeId));
        if (removed) {
            this.metadata.updateFromShapes(this.shapes);
        }
        return removed;
    }

    public void clearShapes() {
        this.shapes.clear();
        this.metadata.updateFromShapes(this.shapes);
    }

    public void updateTimestamp() {
        this.timestamp = Instant.now().toString();
    }

    public boolean isValid() {
        return title != null && !title.trim().isEmpty() &&
               timestamp != null &&
               version != null &&
               shapes != null &&
               shapes.stream().allMatch(Shape::isValid);
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("title", title);
        stats.put("totalShapes", metadata.getTotalShapes());
        stats.put("shapeTypes", metadata.getShapeTypes());
        stats.put("lastModified", timestamp);
        stats.put("canvasSize", metadata.getCanvasSize());
        return stats;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public List<Shape> getShapes() {
        return shapes;
    }

    public void setShapes(List<Shape> shapes) {
        this.shapes = shapes != null ? shapes : new ArrayList<>();
        this.metadata.updateFromShapes(this.shapes);
    }

    public Metadata getMetadata() {
        return metadata;
    }

    public void setMetadata(Metadata metadata) {
        this.metadata = metadata != null ? metadata : new Metadata();
    }
}
