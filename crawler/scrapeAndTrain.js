// scrapeAndTrain.js
const { scrapeDynamicContent } = require('./crawler.js'); // Adjust the path if necessary
const { processScrapedData } = require('./data-prepare.js'); // Processes scraped data for model training
const tf = require('@tensorflow/tfjs-node'); // or '@tensorflow/tfjs-node-gpu' for GPU support
const { createModel, trainModel } = require('./modelTrainer.js'); // Make sure these functions are appropriately defined and exported
const { getEmbeddings } = require('./loadUSE'); // Ensure this module is set up to load USE and provide embeddings

async function scrapeAndTrain(url) {
    try {
        // Step 1: Scrape content from the web
        const scrapedData = await scrapeDynamicContent(url);

        // Optional: Process the scraped data to format it for training
        const processedData = await processScrapedData(scrapedData);

        // Step 2: Analyze the titles (or any relevant text) extracted from the scraped content using USE
        const textsToAnalyze = processedData.map(data => data.title); // Adjust this to target the specific text you're interested in
        const embeddings = await getEmbeddings(textsToAnalyze); // This will return a tensor

        // Step 3: Prepare data for training
        // If you're using embeddings directly, ensure your processScrapedData prepares labels accordingly
        const inputTensor = embeddings; // Using embeddings directly as input to the model
        const outputTensor = tf.tensor2d(processedData.map(data => data.label)); // Adjust this based on how your labels are structured

        // Step 4: Create and train the model
        // Ensure the model's input layer is compatible with the shape of USE embeddings
        const model = createModel(inputTensor.shape[1]); // inputTensor.shape[1] gives the size of the embedding vectors
        await trainModel(model, inputTensor, outputTensor);

        console.log('Model trained successfully with scraped data.');
    } catch (error) {
        console.error('Failed to scrape and train:', error);
    }
}

module.exports = { scrapeAndTrain };

