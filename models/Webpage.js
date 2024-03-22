// models/Webpage.js
/**
 * @module WebpageModel
 */

const mongoose = require('mongoose');

/**
 * Schema representing a webpage.
 * @const {mongoose.Schema}
 */
const webpageSchema = new mongoose.Schema({
    /**
     * URL of the webpage.
     * @type {String}
     * @unique
     * @required
     */
    url: { type: String, unique: true, required: true },
    /**
     * Content of the webpage.
     * @type {String}
     */
    content: String,
    /**
     * Label associated with the webpage.
     * @type {String}
     */
    label: String,
    /**
     * Confidence score of the webpage.
     * @type {Number}
     * @default 0
     */
    confidenceScore: { type: Number, default: 0 },
    /**
     * Flag indicating if the webpage needs review.
     * @type {Boolean}
     * @default false
     */
    needsReview: { type: Boolean, default: false }
});

/**
 * Model representing a webpage.
 * @const {mongoose.Model}
 */
const Webpage = mongoose.model('Webpage', webpageSchema);

module.exports = Webpage;
