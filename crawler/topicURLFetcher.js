// topicURLFetcher.js
/**
 * @module topicURLFetcher
 */

const Url = require('./models/Url'); // Assuming a Mongoose model for URLs

/**
 * Fetches URLs for a given topic.
 * @async
 * @function fetchURLsForTopic
 * @param {string} topic - The topic for which URLs are fetched.
 * @returns {Promise<string[]>} A promise that resolves with an array of URLs.
 */
async function fetchURLsForTopic(topic) {
    try {
        // Fetch URLs tagged with the specified topic
        // This assumes your URL model has fields for `topic` and `url`
        const urls = await Url.find({ topic }).limit(10); // Example limit to prevent overload
        return urls.map(doc => doc.url);
    } catch (error) {
        console.error(`Error fetching URLs for topic ${topic}:`, error);
        return [];
    }
}

module.exports = { fetchURLsForTopic };
