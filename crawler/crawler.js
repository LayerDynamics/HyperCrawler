const puppeteer = require('puppeteer');
const Bottleneck = require('bottleneck');
const { getRandomUserAgent } = require('./userAgents');
const { getEmbeddings } = require('./loadUSE'); // Ensure this is pointing to your loadUSE module
const { analyzeContent, storeEmbeddings, makeRealTimeDecisions } = require('./embeddingUtilities'); // Placeholder for your utilities

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1000, // One request per second
});

async function scrapeDynamicContent(url) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent(getRandomUserAgent());
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Scrape titles or any textual content you're interested in
    const titles = await page.evaluate(() => Array.from(document.querySelectorAll('h1'), element => element.textContent));

    // Use USE to get embeddings for the scraped titles/text
    const embeddings = await getEmbeddings(titles);

    await browser.close();

    // Analysis: Leverage embeddings for further content analysis or categorization
    const analysisResults = await analyzeContent(embeddings);

    // Storage: Store embeddings for future use, analysis, or tracking content changes
    await storeEmbeddings(url, embeddings);

    // Real-time Decision-making: Use embeddings to make decisions on what to scrape next or how to prioritize content
    await makeRealTimeDecisions(embeddings);

    // Consider adjusting what you return based on your application's needs
    return { titles, embeddings, analysisResults };
}

// Wrap your scrape function with the limiter
const limitedScrapeDynamicContent = limiter.wrap(scrapeDynamicContent);

module.exports = { limitedScrapeDynamicContent, scrapeDynamicContent };
