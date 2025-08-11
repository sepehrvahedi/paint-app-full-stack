package com.example.canvasdrawingapi.model.painting;

public class CanvasSize {
    private int width;
    private int height;

    public CanvasSize() {
        this.width = 800;
        this.height = 400;
    }

    public CanvasSize(int width, int height) {
        this.width = width;
        this.height = height;
    }

    // Getters and Setters
    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }
}
