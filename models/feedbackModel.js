// models/feedbackModel.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    url: String,
    correctPrediction: Boolean,
    userFeedback: String,
    processed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
