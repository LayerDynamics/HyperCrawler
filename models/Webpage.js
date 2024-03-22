// models/Webpage.js
const mongoose = require('mongoose');

const webpageSchema = new mongoose.Schema({
    url: { type: String, unique: true, required: true },
    content: String,
    label: String, // The label that might be corrected based on feedback
    confidenceScore: { type: Number, default: 0 }, // Example field that could be increased
    needsReview: { type: Boolean, default: false } // Flag for manual review
});

const Webpage = mongoose.model('Webpage', webpageSchema);

module.exports = Webpage;

