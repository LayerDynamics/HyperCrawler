 //./crawler/throttler.js
const crawler = require('./crawler');
const Bottleneck = require("bottleneck");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));



const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1000 // At least 1000ms between each task
});

// Wrap your request or scraping function
const limitedScrape = limiter.wrap(scrapeWithDelay);

// Use limitedScrape instead of direct function call


async function scrapeWithDelay(url) {
    // Your scraping logic here

    await delay(1000); // Delay for 1 second
}


const  async function throttler({ scrapeWithDelay, bottleneck, delay }) {


}



