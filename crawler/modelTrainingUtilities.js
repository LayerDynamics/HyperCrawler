// modelTrainingUtilities.js
const tf = require('@tensorflow/tfjs-node'); // Use '@tensorflow/tfjs-node-gpu' if GPU is available
const Feedback = require('../models/feedbackModel'); // Model for feedback data
const DataPreparation = require('./data-prepare'); // Data preparation utilities
const ModelTrainer = require('./modelTrainer'); // Model training utilities
const Webpage = require('../models/Webpage'); // Adjust the path as necessary
const { classifyFeedback } = require('./feedbackClassifier');

// Function to parse user feedback into a structured form
function parseUserFeedback(feedbackText) {
    const parts = feedbackText.split(';');
    return {
        correctedLabel: parts[0].trim(),
        additionalNotes: parts.length > 1 ? parts[1].trim() : ''
    };
}

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

async function flagForReview(url) {
    try {
        await Webpage.findOneAndUpdate({ url }, { $set: { needsReview: true } });
        console.log(`Flagged ${url} for manual review.`);
    } catch (error) {
        console.error(`Error flagging ${url} for review:`, error);
    }
}

async function increaseConfidence(url) {
    try {
        await Webpage.findOneAndUpdate({ url }, { $inc: { confidenceScore: 1 } });
        console.log(`Increased confidence for ${url}.`);
    } catch (error) {
        console.error(`Error increasing confidence for ${url}:`, error);
    }
}

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
