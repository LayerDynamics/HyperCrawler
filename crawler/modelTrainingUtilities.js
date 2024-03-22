// modelTrainingUtilities.js
/**
 * @module modelTrainingUtilities
 */

const tf = require('@tensorflow/tfjs-node'); // Use '@tensorflow/tfjs-node-gpu' if GPU is available
const Feedback = require('../models/feedbackModel'); // Model for feedback data
const DataPreparation = require('./data-prepare'); // Data preparation utilities
const ModelTrainer = require('./modelTrainer'); // Model training utilities
const Webpage = require('../models/Webpage'); // Adjust the path as necessary
const { classifyFeedback } = require('./feedbackClassifier');

/**
 * Parses user feedback into a structured form.
 * @function parseUserFeedback
 * @param {string} feedbackText - The raw user feedback text.
 * @returns {Object} An object containing the parsed feedback information.
 */
function parseUserFeedback(feedbackText) {
    const parts = feedbackText.split(';');
    return {
        correctedLabel: parts[0].trim(),
        additionalNotes: parts.length > 1 ? parts[1].trim() : ''
    };
}

/**
 * Updates the dataset entry for a given URL with corrected data.
 * @async
 * @function updateDatasetEntry
 * @param {string} url - The URL of the webpage to update.
 * @param {Object} correctedData - The corrected data to update the dataset with.
 */
async function updateDatasetEntry(url, correctedData) {
    try {
        await Webpage.findOneAndUpdate({ url }, {
            $set: {
                label: correctedData.correctedLabel,
                content: correctedData.additionalNotes ? correctedData.additionalNotes : undefined
            }
        });
        console.log(`Updated dataset entry for ${url} with corrected data.`);
    } catch (error) {
        console.error(`Error updating dataset entry for ${url}:`, error);
    }
}

/**
 * Flags a webpage for manual review.
 * @async
 * @function flagForReview
 * @param {string} url - The URL of the webpage to flag for review.
 */
async function flagForReview(url) {
    try {
        await Webpage.findOneAndUpdate({ url }, { $set: { needsReview: true } });
        console.log(`Flagged ${url} for manual review.`);
    } catch (error) {
        console.error(`Error flagging ${url} for review:`, error);
    }
}

/**
 * Increases confidence score for a webpage.
 * @async
 * @function increaseConfidence
 * @param {string} url - The URL of the webpage to increase confidence for.
 */
async function increaseConfidence(url) {
    try {
        await Webpage.findOneAndUpdate({ url }, { $inc: { confidenceScore: 1 } });
        console.log(`Increased confidence for ${url}.`);
    } catch (error) {
        console.error(`Error increasing confidence for ${url}:`, error);
    }
}

/**
 * Updates the dataset with feedback items.
 * @async
 * @function updateDatasetWithFeedback
 * @param {Object[]} feedbackItems - An array of feedback items to process.
 */
async function updateDatasetWithFeedback(feedbackItems) {
    for (const feedback of feedbackItems) {
        const initialClassification = await classifyFeedback(feedback.userFeedback);
        // Assume classifyFeedback returns an object with classification and needsReview properties
        if (initialClassification.needsReview) {
            await flagForReview(feedback.url);
        } else {
            const correctedData = parseUserFeedback(feedback.userFeedback);
            if (!feedback.correctPrediction) {
                await updateDatasetEntry(feedback.url, correctedData);
            } else {
                await increaseConfidence(feedback.url);
            }
        }
    }
    console.log(`Processed ${feedbackItems.length} feedback items.`);
}

/**
 * Retrains the model with updated dataset.
 * @async
 * @function retrainModel
 */
async function retrainModel() {
    const { inputData, outputData } = await DataPreparation.loadUpdatedDataset();
    const inputTensor = tf.tensor2d(inputData);
    const outputTensor = tf.tensor2d(outputData);
    const model = ModelTrainer.createModel(inputTensor.shape[1]);
    await ModelTrainer.trainModel(model, inputTensor, outputTensor);
    const savePath = 'file://./model-save';
    await model.save(savePath);
    console.log(`Model retrained and saved at ${savePath}`);
}

module.exports = { updateDatasetWithFeedback, retrainModel };
