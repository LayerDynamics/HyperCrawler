// ./schema/webpage.schema.js
const mongoose = require('mongoose');

const webpageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true // Ensures we don't store duplicates
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false // Might not always want to store the full content
    },
    author: {
        type: String,
        required: false
    },
    datePublished: {
        type: Date,
        required: false
    },
    tags: [{
        type: String
    }],
    links: [{
        type: String,
        required: true
    }],
    scrapedAt: {
        type: Date,
        default: Date.now
    },
    isProcessed: {
        type: Boolean,
        default: false // Indicates if the links from this page have been processed for further crawling
    }
});

const Webpage = mongoose.model('Webpage', webpageSchema);

module.exports = Webpage;
