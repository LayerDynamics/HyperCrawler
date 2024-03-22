// ./schema/webpage.schema.js
/**
 * @module webpageSchema
 */

const mongoose = require('mongoose');

/**
 * Represents the schema for a webpage in the database.
 */
const webpageSchema = new mongoose.Schema({
    /**
     * The URL of the webpage.
     * @type {string}
     * @required
     * @unique
     */
    url: {
        type: String,
        required: true,
        unique: true // Ensures we don't store duplicates
    },
    /**
     * The title of the webpage.
     * @type {string}
     * @required
     */
    title: {
        type: String,
        required: true
    },
    /**
     * The content of the webpage.
     * @type {string}
     */
    content: {
        type: String,
        required: false // Might not always want to store the full content
    },
    /**
     * The author of the webpage.
     * @type {string}
     */
    author: {
        type: String,
        required: false
    },
    /**
     * The date when the webpage was published.
     * @type {Date}
     */
    datePublished: {
        type: Date,
        required: false
    },
    /**
     * The tags associated with the webpage.
     * @type {Array.<string>}
     */
    tags: [{
        type: String
    }],
    /**
     * The links present in the webpage.
     * @type {Array.<string>}
     * @required
     */
    links: [{
        type: String,
        required: true
    }],
    /**
     * The timestamp when the webpage was last scraped.
     * @type {Date}
     * @default Date.now
     */
    scrapedAt: {
        type: Date,
        default: Date.now
    },
    /**
     * Indicates if the links from this page have been processed for further crawling.
     * @type {boolean}
     * @default false
     */
    isProcessed: {
        type: Boolean,
        default: false // Indicates if the links from this page have been processed for further crawling
    }
});

/**
 * The Mongoose model representing a webpage.
 * @type {mongoose.Model}
 */
const Webpage = mongoose.model('Webpage', webpageSchema);

module.exports = Webpage;
