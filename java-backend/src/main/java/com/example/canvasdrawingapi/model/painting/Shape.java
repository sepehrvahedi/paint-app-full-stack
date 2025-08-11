package com.example.canvasdrawingapi.model.painting;

import java.time.Instant;

public class Shape {
    private String id;
    private String type;
    private double x;
    private double y;
    private String timestamp;
    private boolean valid;

    public Shape() {
        this.timestamp = Instant.now().toString();
    }

    public Shape(String id, String type, double x, double y) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.timestamp = Instant.now().toString();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isValid() {
        return id != null && !id.trim().isEmpty() &&
               type != null && !type.trim().isEmpty() &&
               timestamp != null && !timestamp.trim().isEmpty();
    }
}
