// ./models/Article.js
const Article = require('./Article'); // Import the Article model

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
