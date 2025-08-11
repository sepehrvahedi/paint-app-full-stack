const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: false,
        freezeTableName: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection has been established successfully.');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        return false;
    }
};

const initializeDatabase = async () => {
    try {
        const User = require('../models/User');

        await testConnection();

        await sequelize.sync({
            force: false,
            alter: process.env.NODE_ENV === 'development'
        });

        console.log('📊 Database synchronized successfully');

        if (process.env.NODE_ENV === 'development') {
            const seedData = require('../data/seedData');
            await seedData();
        }

        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};

const closeConnection = async () => {
    try {
        await sequelize.close();
        console.log('🔒 Database connection closed successfully');
    } catch (error) {
        console.error('❌ Error closing database connection:', error);
    }
};

module.exports = {
    sequelize,
    testConnection,
    initializeDatabase,
    closeConnection
};
