const { DataTypes } = require('sequelize');

class Shape {
    constructor(data = {}) {
        this.id = data.id || null;
        this.type = data.type || null;
        this.x = data.x || 0;
        this.y = data.y || 0;
        this.timestamp = data.timestamp || new Date().toISOString();
    }

    static fromJSON(json) {
        return new Shape(json);
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
            timestamp: this.timestamp
        };
    }

    isValid() {
        return this.id && this.type &&
            typeof this.x === 'number' &&
            typeof this.y === 'number' &&
            this.timestamp;
    }
}

class Metadata {
    constructor(data = {}) {
        this.totalShapes = data.totalShapes || 0;
        this.shapeTypes = data.shapeTypes || {};
        this.canvasSize = data.canvasSize || { width: 800, height: 400 };
    }

    static fromJSON(json) {
        return new Metadata(json);
    }

    toJSON() {
        return {
            totalShapes: this.totalShapes,
            shapeTypes: this.shapeTypes,
            canvasSize: this.canvasSize
        };
    }

    updateFromShapes(shapes) {
        this.totalShapes = shapes.length;
        this.shapeTypes = {};

        shapes.forEach(shape => {
            if (this.shapeTypes[shape.type]) {
                this.shapeTypes[shape.type]++;
            } else {
                this.shapeTypes[shape.type] = 1;
            }
        });
    }
}

class Painting {
    constructor(data = {}) {
        this.title = data.title || 'Untitled';
        this.timestamp = data.timestamp || new Date().toISOString();
        this.version = data.version || '1.0';
        this.shapes = [];
        this.metadata = new Metadata(data.metadata);

        if (data.shapes && Array.isArray(data.shapes)) {
            this.shapes = data.shapes.map(shapeData => Shape.fromJSON(shapeData));
        }

        this.metadata.updateFromShapes(this.shapes);
    }

    static fromJSON(json) {
        if (!json) return null;

        if (typeof json === 'string') {
            try {
                json = JSON.parse(json);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return null;
            }
        }

        return new Painting(json);
    }

    toJSON() {
        return {
            title: this.title,
            timestamp: this.timestamp,
            version: this.version,
            shapes: this.shapes.map(shape => shape.toJSON()),
            metadata: this.metadata.toJSON()
        };
    }

    toString() {
        return JSON.stringify(this.toJSON());
    }

    addShape(shapeData) {
        const shape = Shape.fromJSON(shapeData);
        if (shape.isValid()) {
            this.shapes.push(shape);
            this.metadata.updateFromShapes(this.shapes);
            return true;
        }
        return false;
    }

    removeShape(shapeId) {
        const index = this.shapes.findIndex(shape => shape.id === shapeId);
        if (index !== -1) {
            this.shapes.splice(index, 1);
            this.metadata.updateFromShapes(this.shapes);
            return true;
        }
        return false;
    }

    updateShape(shapeId, newData) {
        const shape = this.shapes.find(shape => shape.id === shapeId);
        if (shape) {
            Object.assign(shape, newData);
            this.metadata.updateFromShapes(this.shapes);
            return true;
        }
        return false;
    }

    getShape(shapeId) {
        return this.shapes.find(shape => shape.id === shapeId);
    }

    getShapesByType(type) {
        return this.shapes.filter(shape => shape.type === type);
    }

    isValid() {
        return this.title &&
            this.timestamp &&
            this.version &&
            Array.isArray(this.shapes) &&
            this.shapes.every(shape => shape.isValid());
    }

    updateTimestamp() {
        this.timestamp = new Date().toISOString();
    }

    clearShapes() {
        this.shapes = [];
        this.metadata.updateFromShapes(this.shapes);
    }

    getStatistics() {
        return {
            title: this.title,
            totalShapes: this.metadata.totalShapes,
            shapeTypes: this.metadata.shapeTypes,
            lastModified: this.timestamp,
            canvasSize: this.metadata.canvasSize
        };
    }
}

module.exports = {
    Painting,
    Shape,
    Metadata
};
