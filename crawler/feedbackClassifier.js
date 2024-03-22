// ./crawler/feedbackClassifier.js
const tf = require('@tensorflow/tfjs-node');
const { preprocessText } = require('./data-prepare');
const Feedback = require('./models/feedbackModel'); // Ensure this path is correct
const Webpage = require('./models/Webpage'); // Ensure this path is correct

/**
 * Path to the TensorFlow.js model stored locally.
 * @type {string}
 */
const modelPath = '../mobilebert/model.json';

/**
 * The TensorFlow.js model, globally initialized.
 * @type {null|Object}
 */
let model;

/**
 * Asynchronously loads the TensorFlow.js model from a specified path.
 */
const loadModel = async () => {
    try {
        model = await tf.loadLayersModel(modelPath);
        console.log('Feedback classification model loaded successfully.');
    } catch (error) {
        console.error('Failed to load the model:', error);
    }
};

/**
 * Preprocesses and classifies feedback text using the loaded model.
 * @param {string} feedbackText - The text to classify.
 * @returns {Promise<{category: string, needsReview: boolean}|null>} The classification result or null in case of an error.
 */
async function classifyFeedback(feedbackText) {
    const processedText = preprocessText(feedbackText);
    const inputTensor = tf.tensor2d([processedText.split(' ').map(word => word.length)], [1, processedText.length]);

    try {
        const prediction = await model.predict(inputTensor).data();
        const predictedClassIndex = prediction.indexOf(Math.max(...prediction));
        const category = mapIndexToCategory(predictedClassIndex);
        return {
            category,
            needsReview: category === 'Negative',
        };
    } catch (error) {
        console.error('Error during model prediction:', error);
        return null;
    }
}

/**
 * Maps the index of a prediction to its corresponding category.
 * @param {number} index - The index of the predicted category.
 * @returns {string} The name of the category.
 */
const mapIndexToCategory = (index) => {
    const categories = ['Positive', 'Negative', 'Neutral'];
    return categories[index] || 'Unknown';
};

/**
 * Updates feedback items in the database based on classification results.
 * @param {Array<Object>} feedbackItems - The feedback items to classify and update.
 */
const updateFeedbackClassification = async (feedbackItems) => {
    for (const feedback of feedbackItems) {
        const classificationResult = await classifyFeedback(feedback.userFeedback);

        if (!classificationResult) continue;

        if (classificationResult.needsReview) {
            await flagForReview(feedback.url);
        } else {
            if (!feedback.correctPrediction) {
                const correctedData = parseUserFeedback(feedback.userFeedback);
                await updateDatasetEntry(feedback.url, correctedData);
            } else {
                await increaseConfidence(feedback.url);
            }
        }
    }
    console.log(`Processed ${feedbackItems.length} feedback items.`);
};


// Placeholder function implementations. You need to define these based on your application's requirements
async function flagForReview(url) {
    console.log(`Flagging ${url} for review.`);
    // Implement your flagging logic here, e.g., update a field in your database
}

async function updateDatasetEntry(url, correctedData) {
    console.log(`Updating dataset entry for ${url} with corrected data:`, correctedData);
    // Implement the logic to update the dataset entry in your database
}

async function increaseConfidence(url) {
    console.log(`Increasing confidence for ${url}.`);
    // Implement logic to increase the confidence score in your database
}

const parseUserFeedback = (feedbackText) => {
    // Implement parsing logic based on your application's needs
    return { correctedLabel: 'Corrected Label', additionalNotes: 'Some notes' }; // Example return structure
};

// Load the model on script start
loadModel().catch(console.error);

module.exports = {
    classifyFeedback,
    updateFeedbackClassification, // Expose any functions you intend to use elsewhere
};
