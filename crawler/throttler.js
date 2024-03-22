 //./crawler/throttler.js
/**
 * @module throttler
 */

const crawler = require('./crawler');
const Bottleneck = require("bottleneck");

/**
 * Delays execution for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to delay execution.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * The limiter instance for throttling requests.
 * @type {Bottleneck}
 */
const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1000 // At least 1000ms between each task
});

/**
 * Wraps a function with the limiter to throttle execution.
 * @function
 * @name limitedScrape
 * @param {Function} scrapeWithDelay - The function to wrap with the limiter.
 */
const limitedScrape = limiter.wrap(scrapeWithDelay);

/**
 * Scrapes with delay to throttle execution.
 * @async
 * @function
 * @name scrapeWithDelay
 * @param {string} url - The URL to scrape.
 */
async function scrapeWithDelay(url) {
    // Your scraping logic here
    await delay(1000); // Delay for 1 second
}

/**
 * Throttles the execution of a function.
 * @async
 * @function
 * @name throttler
 * @param {Object} options - The options for throttling.
 * @param {Function} options.scrapeWithDelay - The function to throttle.
 * @param {Bottleneck} options.bottleneck - The Bottleneck instance for throttling.
 * @param {Function} options.delay - The function for delaying execution.
 */
const throttler = async function ({ scrapeWithDelay, bottleneck, delay }) {
    // Implementation for throttling
}

module.exports = { limitedScrape, scrapeWithDelay, throttler };
