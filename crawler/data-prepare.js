// ./crawler/data-prepare.js
const axios = require('axios');
const cheerio = require('cheerio');
//const logger = require('../../logger'); // Assume you've set up a logger
const stopwords = require('stopwords').english;
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

/**
 * Processes the text by tokenizing, removing stopwords, and optionally stemming.
 * @param {string} text The text to preprocess.
 * @returns {string} The preprocessed text.
 */
function preprocessText(text) {
    let tokens = tokenizer.tokenize(text.toLowerCase()); // Tokenization and lowercasing
    tokens = tokens.filter(token => !stopwords.includes(token)); // Stopwords removal

    // Stemming (optional, can comment out if not needed)
    const stemmer = natural.PorterStemmer;
    tokens = tokens.map(token => stemmer.stem(token));

    return tokens.join(' '); // Rejoin tokens into a string
}

/**
 * Fetches the content from a URL and processes it to extract text.
 * @param {string} url The URL to fetch and process.
 * @returns {Promise<{features: string, label: string} | null>} An object containing the processed text and a placeholder label, or null in case of an error.
 */
async function fetchAndProcessURL(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const textContent = $('body').text();

        // Initial processing: removing HTML, extracting text, etc.
        const processedText = preprocessText(textContent);
        return { features: processedText, label: 'YourLabelHere' }; // Placeholder label
    } catch (error) {
        logger.error(`Error fetching URL ${url}: ${error.message}`);
        return null;
    }
}

/**
 * Preprocesses text by converting it to lowercase and removing punctuation.
 * @param {string} text The text to preprocess.
 * @returns {string} The processed text.
 */
function preprocessText(text) {
    // Convert text to lowercase, remove punctuation, etc.
    return text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
}

/**
 * Processes scraped data to prepare it for model training.
 * @param {Array<{features: string, label: string}>} scrapedData An array of objects containing the features and labels of the scraped data.
 * @returns {Promise<{inputData: Array<string>, outputData: Array<string>}>} An object containing arrays of input data and output data.
 */
async function processScrapedData(scrapedData) {
    // Transform scrapedData into a format suitable for the model
    const processedData = scrapedData.map(data => {
        const processedFeatures = preprocessText(data.features);
        const label = data.label; // Define labels based on your project needs

        return { features: processedFeatures, label };
    });

    // Split the processed data into inputs and outputs
    const inputs = processedData.map(data => data.features);
    const outputs = processedData.map(data => data.label);

    return { inputData: inputs, outputData: outputs };
}

module.exports = { fetchAndProcessURL, processScrapedData, preprocessText };
