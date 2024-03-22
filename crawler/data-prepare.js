// ./crawler/data-prepare.js
const axios = require('axios');
const cheerio = require('cheerio');
//const logger = require('../../logger'); // Assume you've set up a logger
const stopwords = require('stopwords').english;
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// function preprocessText(text) {
//     let tokens = tokenizer.tokenize(text.toLowerCase()); // Tokenization and lowercasing
//     tokens = tokens.filter(token => !stopwords.includes(token)); // Stopwords removal

//     // Stemming (optional, can comment out if not needed)
//     const stemmer = natural.PorterStemmer;
//     tokens = tokens.map(token => stemmer.stem(token));

//     return tokens.join(' '); // Rejoin tokens into a string
// }



// Function to fetch and initially process the URL content
async function fetchAndProcessURL(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const textContent = $('body').text();

        // Initial processing: removing HTML, extracting text, etc.
        // Assuming you might need further processing like text cleanup
        const processedText = preprocessText(textContent);
        return { features: processedText, label: 'YourLabelHere' }; // Placeholder label
    } catch (error) {
        logger.error(`Error fetching URL ${url}: ${error.message}`);
        return null;
    }
}

// Utility function for text preprocessing
function preprocessText(text) {
    // Example implementation: convert text to lowercase, remove punctuation, etc.
    return text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
}

// Function to further process the scraped data for model training
async function processScrapedData(scrapedData) {
    // Transform scrapedData into a format your model can use
    // Placeholder implementation: assuming scrapedData is an array of text contents
    const processedData = scrapedData.map(data => {
        const processedFeatures = preprocessText(data.features);
        const label = data.label; // You'll define how to set labels based on your project needs

        return { features: processedFeatures, label };
    });

    // Placeholder for splitting the processed data into inputs and outputs
    const inputs = processedData.map(data => data.features);
    const outputs = processedData.map(data => data.label);

    return { inputData: inputs, outputData: outputs };
}

module.exports = { fetchAndProcessURL, processScrapedData, preprocessText };
