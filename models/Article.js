// ./models/Article.js
/**
 * @module Article
 */

const Article = require('./Article'); // Import the Article model

/**
 * Scrapes dynamic content from a webpage using Puppeteer and saves titles to the Article model.
 * @param {string} url - The URL of the webpage to scrape.
 * @returns {Promise<Array<string>>} The titles scraped from the webpage.
 */
async function scrapeDynamicContent(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const titles = await page.evaluate(() => {
        // Example scraping logic here
    });

    await browser.close();

    // Example of saving each title to MongoDB
    titles.forEach(async (title) => {
        const article = new Article({ title, url: 'example.com' }); // Replace 'example.com' with actual URL
        await article.save();
    });

    return titles;
}

module.exports = scrapeDynamicContent;
