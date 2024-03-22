// ./data/feedbackHandler

/**
 * @module feedbackHandler
 */

const Feedback = require('../models/feedbackModel');

/**
 * Processes feedback data and stores it in the database.
 * @async
 * @function processFeedback
 * @param {string} url - The URL associated with the feedback.
 * @param {boolean} correctPrediction - Indicates whether the prediction was correct.
 * @param {string} userFeedback - The feedback provided by the user.
 */
async function processFeedback(url, correctPrediction, userFeedback) {
    try {
        const feedback = new Feedback({ url, correctPrediction, userFeedback });
        await feedback.save();
        console.log(`Feedback stored for URL: ${url}`);
    } catch (error) {
        console.error(`Error storing feedback: ${error.message}`);
        throw error; // Rethrow to handle it in the calling function
    }
}

module.exports = { processFeedback };
