// models/feedbackModel.js
/**
 * @module FeedbackModel
 */

const mongoose = require('mongoose');

/**
 * Schema for storing feedback data.
 */
const feedbackSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    correctPrediction: {
        type: Boolean,
        required: true
    },
    userFeedback: {
        type: String,
        required: true
    },
    processed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Model for storing feedback data.
 */
module.exports = mongoose.model('Feedback', feedbackSchema);
