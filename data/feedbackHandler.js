// feedbackHandler.j

// feedbackHandler.js
const Feedback = require('../models/feedbackModel');

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
