const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const paintingRoutes = require('./routes/paintings');

const { sequelize, initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Canvas Drawing API is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/paintings', paintingRoutes);

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

app.use(errorHandler);

const startServer = async () => {
    try {
        await initializeDatabase();
        console.log('Database connected and synchronized successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT. Graceful shutdown...');
    try {
        await sequelize.close();
        console.log('Database connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Graceful shutdown...');
    try {
        await sequelize.close();
        console.log('Database connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

startServer();

module.exports = app;
