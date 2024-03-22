// ./index.js
/**
 * Entry point for the application.
 * @module index
 */

// Importing required modules
const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');
const morgan = require('morgan');
const mongoose = require('mongoose');
const logger = require('./logger');
const { processFeedback, processAndRetrain } = require('./data/feedbackHandler');
const { fetchFreshProxies, validateProxies } = require('./utils/fetchFreshProxies');
const { updateProxyList } = require('./utils/rotatingProxy');
const { setupProxies } = require('./utils/setupProxy');
const { connectDB, initializeLoki } = require('./data/db');

// Initialize Express application
const app = express();
const port = process.env.PORT || 3000;

// Setup logging middleware
morgan.token('proxy', function (req) {
  return req.proxyUsed || 'No proxy'; // Assuming proxyUsed is a property you set on the request
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :proxy'));

// Enable CORS for specified origins
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}));

// Schedule jobs for proxies and model retraining
schedule.scheduleJob('*/5 * * * *', async () => {
  try {
    const dbHealth = await checkDatabaseHealth();
    logger.info(`Database Health: ${dbHealth}`);
    const freshProxies = await fetchFreshProxies();
    logger.info(`Fetched ${freshProxies.length} fresh proxies.`);
    const validProxies = await validateProxies(freshProxies);
    updateProxyList(validProxies);
    logger.info(`Updated global proxy list with ${validProxies.length} proxies.`);
  } catch (error) {
    logger.error('Health check failed:', error);
  }
});

schedule.scheduleJob('0 0 * * *', async () => {
  logger.info('Starting scheduled feedback processing and model retraining...');
  await processAndRetrain();
});

// Health check endpoint
app.get('/health-check', async (req, res) => {
  const dbStatus = await checkDatabaseHealth();
  res.status(200).json({ status: 'OK', dbStatus });
});

// Submit feedback endpoint
app.post('/submit-feedback', async (req, res) => {
  const { url, correctPrediction, userFeedback } = req.body;
  try {
    await processFeedback(url, correctPrediction, userFeedback);
    res.status(200).send('Feedback submitted successfully');
    setImmediate(async () => {
      await processAndRetrain(); // Ensure this doesn't run too frequently
    });
  } catch (error) {
    logger.error('Failed to submit feedback:', error);
    res.status(500).send('Error submitting feedback');
  }
});

/**
 * Checks the health of the MongoDB connection.
 * @returns {Promise<String>} Database health status.
 */
async function checkDatabaseHealth() {
  try {
    await mongoose.connection.db.admin().ping();
    return 'OK';
  } catch (error) {
    return 'FAIL';
  }
}

/**
 * Initializes the application.
 * @returns {Promise<void>}
 */
async function initialize() {
  try {
    // Initialize MongoDB
    await connectDB();
    logger.info('MongoDB Connected Successfully.');

    // Initialize LokiJS
    await initializeLoki();
    logger.info('LokiJS Initialized Successfully.');

    // Fetch and validate proxies
    const initialProxies = await fetchFreshProxies();
    const validProxies = await validateProxies(initialProxies);
    updateProxyList(validProxies);
    logger.info(`Initialized with ${validProxies.length} valid proxies.`);

    // Set up dynamic proxy routes
    setupProxies(app);

    // Start the Express server
    const expressServer = app.listen(port, () =>
      logger.info(`Server running on port ${port}`)
    );

    // Graceful shutdown logic
    process.on('SIGINT', async () => {
      server.close(() => logger.info('Proxy server closed'));
      mongoose.connection.close(false, () => {
        logger.info('Mongoose connection closed');
        expressServer.close(() => {
          logger.info('Express server closed');
          process.exit(0);
        });
      });
      logger.info('All resources closed. Exiting.');
    });
  } catch (error) {
    logger.error('Initialization failed:', error);
    process.exit(1); // Exit the process with an error code
  }
}

// Initialize the application
initialize().catch(logger.error);

module.exports = app; // Export the Express app for testing purposes
