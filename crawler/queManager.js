// ./crawler/queManager
/**
 * @module queManager
 */

const Queue = require('bull');
const { fetchAndProcessURL } = require('./yourScrapingModule'); // Adjust with your actual scraping module
const { getEmbeddings } = require('./loadUSE');
const { adjustScrapingQueue } = require('./adjustScrapingQueue'); // Function we discussed earlier

/**
 * Queue for managing scraping tasks.
 * @type {Queue}
 */
const scrapeQueue = new Queue('scrape tasks', 'redis://127.0.0.1:6379');

/**
 * Processes scraping jobs from the queue.
 * @function
 * @name processScrapeJob
 * @param {Object} job - The job to process.
 * @returns {Promise<Object[]>} A promise that resolves with the scraped data.
 */
scrapeQueue.process(async (job) => {
    // Handle the job: fetch URL, scrape, and process data
    const scrapedData = await fetchAndProcessURL(job.data.url);

    // Assuming scrapedData includes the content or titles to analyze
    const contentToAnalyze = scrapedData.map(data => data.content); // Adjust based on your data structure

    // Generate embeddings for the content
    const embeddings = await getEmbeddings(contentToAnalyze);
    const embeddingsArray = await embeddings.array(); // Assuming we can directly work with the array

    // Simplified: Make decisions based on the first piece of content
    // For more comprehensive analysis, you might aggregate or analyze all embeddings
    const decisionResults = await makeRealTimeDecisions(embeddingsArray[0]);

    // Adjust scraping queue based on decisions
    await adjustScrapingQueue(job.data.url, decisionResults.topicNeedingCoverage);

    return scrapedData; // Return the result for logging or further processing
});

/**
 * Adds a scraping job to the queue.
 * @function
 * @name addScrapingJob
 * @param {string} url - The URL to scrape.
 * @param {string} [priority='normal'] - The priority of the job. Can be 'high', 'normal', or 'low'.
 */
function addScrapingJob(url, priority = 'normal') {
    scrapeQueue.add(
        { url },
        {
            priority: priority === 'high' ? 1 : priority === 'low' ? 3 : 2, // Bull uses 1 for highest priority
            attempts: 3, // Number of attempts to try the job before failing
            backoff: {
                type: 'fixed',
                delay: 1000, // Delay in ms between attempts
            },
        }
    );
}

// Example usage:
// addScrapingJob('http://example.com', 'high');

module.exports = { scrapeQueue };
