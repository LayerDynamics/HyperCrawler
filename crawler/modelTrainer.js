// ./crawler/modelTrainer.js
/**
 * @module modelTrainer
 */

const { preprocessUrls, preprocessNewData } = require('./data-prepare');
const Feedback = require('../models/feedbackModel');
const { updateDatasetWithFeedback, retrainModel } = require('./modelTrainingUtilities');

// Default to CPU version
let tf = require('@tensorflow/tfjs-node');

/**
 * Initializes TensorFlow.js, dynamically switching to GPU version if available.
 * @async
 * @function initializeTensorFlow
 * @returns {Promise<import('@tensorflow/tfjs-node-gpu') | typeof import('@tensorflow/tfjs-node')>} A promise that resolves with TensorFlow.js instance.
 */
async function initializeTensorFlow() {
    try {
        const gpuVersion = require('@tensorflow/tfjs-node-gpu');
        if (await gpuVersion.tf.backend().isGPUSupported) {
            console.log('Using TensorFlow.js with GPU support.');
            return gpuVersion;
        } else {
            throw new Error('GPU support not available.');
        }
    } catch (error) {
        console.log('GPU support not available, using CPU version of TensorFlow.js.');
        return tf; // Return the already imported CPU version
    }
}

(async () => {
    tf = await initializeTensorFlow();
})();

/**
 * Creates a neural network model for training.
 * @function createModel
 * @param {number} inputShape - The shape of the input data.
 */
function createModel(inputShape) {
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 128, activation: 'relu', inputShape: [inputShape]}));
    model.add(tf.layers.dropout(0.5)); // Dropout layer
    model.add(tf.layers.dense({units: 64, activation: 'relu'}));
    model.add(tf.layers.dense({units: 2, activation: 'softmax'}));
}

/**
 * Trains the provided model with input and output data.
 * @async
 * @function trainModel
 * @param {tf.Sequential} model - The neural network model to train.
 * @param {tf.Tensor} inputData - The input data tensor.
 * @param {tf.Tensor} outputData - The output data tensor.
 */
async function trainModel(model, inputData, outputData) {
    await model.fit(inputData, outputData, {
        epochs: 20,
        validationSplit: 0.2,
        callbacks: [tf.callbacks.earlyStopping({ monitor: 'val_loss' })],
    });
    console.log('Model training complete.');
}

/**
 * Predicts relevance of URLs using the trained model.
 * @async
 * @function predictRelevance
 * @param {tf.Sequential} model - The trained neural network model.
 * @param {string[]} urls - URLs to predict relevance for.
 * @returns {Promise<string[]>} A promise that resolves with an array of relevant URLs.
 */
async function predictRelevance(model, urls) {
    const processedData = preprocessUrls(urls); // Implement based on your data
    const predictions = await model.predict(processedData);
    const relevantUrls = [];
    predictions.arraySync().forEach((prediction, index) => {
        if (prediction[1] > 0.5) { // Assuming binary classification
            relevantUrls.push(urls[index]);
        }
    });
    return relevantUrls;
}

/**
 * Processes feedback data and retrains the model if necessary.
 * @async
 * @function processAndRetrain
 */
async function processAndRetrain() {
    const feedbackItems = await Feedback.find({ processed: false });

    if (feedbackItems.length > 0) {
        // Update dataset with feedback
        await updateDatasetWithFeedback(feedbackItems);

        // Retrain model with updated dataset
        await retrainModel();

        // Mark feedback as processed
        await Feedback.updateMany({ _id: { $in: feedbackItems.map(item => item._id) } }, { processed: true });
        console.log(`Retrained model with ${feedbackItems.length} feedback items.`);
    } else {
        console.log('No new feedback to process.');
    }
}

/**
 * Updates the existing model with new data.
 * @async
 * @function updateModelWithNewData
 * @param {tf.Sequential} model - The existing neural network model.
 * @param {Object} newData - New data to update the model with.
 */
async function updateModelWithNewData(model, newData) {
    const { inputData, outputData } = preprocessNewData(newData); // Preprocess new data
    await model.fit(inputData, outputData, {
        epochs: 5, // Adjust epochs for update
        validationSplit: 0.2,
    });
    console.log('Model updated with new data.');
}

module.exports = { createModel, trainModel, predictRelevance, updateModelWithNewData };
