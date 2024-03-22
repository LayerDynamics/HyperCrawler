// ./userAgents.js
/**
 * @module userAgents
 */

/**
 * Array of user agents for simulating different browsers.
 * @type {string[]}
 */
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
    // Add more user agents as needed
];

/**
 * Retrieves a random user agent from the userAgents array.
 * @function
 * @name getRandomUserAgent
 * @returns {string} A random user agent.
 */
function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

module.exports = { getRandomUserAgent };
