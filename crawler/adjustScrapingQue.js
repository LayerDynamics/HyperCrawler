// adjustScrapingQueue.js
const { fetchURLsForTopic } = require('./topicURLFetcher');
const { enqueue } = require('./queManager');

async function adjustScrapingQueue(currentURL, topicNeedingCoverage) {
    if (topicNeedingCoverage) {
        console.log(`Adjusting focus towards: ${topicNeedingCoverage}`);

        const additionalURLs = await fetchURLsForTopic(topicNeedingCoverage);

        for (let url of additionalURLs) {
            await enqueue({
                url,
                priority: 'high',
                topic: topicNeedingCoverage
            });
        }
        console.log(`Enqueued URLs for topic: ${topicNeedingCoverage}`);
    } else {
        // Logic for reducing priority or adjusting queue based on other criteria
        console.log(`No specific topic needing coverage identified for ${currentURL}`);
    }
}

module.exports = { adjustScrapingQueue };

