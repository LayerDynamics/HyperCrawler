// ./data/db.js
/**
 * @module db
 */

const mongoose = require('mongoose');
const loki = require('lokijs');

/**
 * Establishes a connection to the MongoDB database.
 * @async
 * @function connectDB
 */
const connectDB = async () => {
    try {
        const uri = 'mongodb://layerdynamics:wronghanded@localhost:27017/hypercrawler?authSource=admin';
        await mongoose.connect(uri);
        console.log('MongoDB connection established successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

/**
 * Initializes the LokiJS database.
 * @function initializeLoki
 * @returns {Promise<Object>} A promise that resolves with the LokiJS database instance.
 */
const initializeLoki = () => {
    return new Promise((resolve, reject) => {
        lokiDb = new loki('hyperCrawlerLoki.db', {
            autoload: true,
            autoloadCallback : () => resolve(lokiDb),
            autosave: true,
            autosaveInterval: 4000,
            persistenceMethod: 'fs'
        });
    });
};

// Export both the MongoDB connection function and the LokiJS database instance
module.exports = { connectDB, initializeLoki };
