const mongoose = require('mongoose');
const loki = require('lokijs');

// MongoDB Connection
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

// LokiJS Database Initialization
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

// function databaseInitialize() {
//     // Check if the queues collection exists, if not, create it
//     let queues = db.getCollection('queues');
//     if (queues === null) {
//         queues = db.addCollection('queues', {
//             indices: ['url'],
//             unique: ['url'], // Assuming each URL should be unique within the queue
//             autoupdate: true // Enable autoupdate to automatically apply changes
//         });
//     }

//     // Initialize other collections as needed
//     console.log('LokiJS initialization completed');
// }

// Export both the MongoDB connection function and the LokiJS database instance
module.exports = { connectDB, initializeLoki };

