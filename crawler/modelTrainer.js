// ./crawler/modelTrainer.js
const { preprocessUrls, preprocessNewData } = require('./data-prepare');
const Feedback = require('../models/feedbackModel');
const { updateDatasetWithFeedback, retrainModel } = require('./modelTrainingUtilities');
// Default to CPU version


// Dynamically switch to GPU version if CUDA-supported GPU is available
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

// function createModel(inputShape) {
//     const model = tf.sequential();
//     model.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [inputShape] }));
//     model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
//     model.add(tf.layers.dense({ units: 2, activation: 'softmax' }));
//     model.compile({ loss: 'binaryCrossentropy', optimizer: 'adam', metrics: ['accuracy'] });
//     return model;}
//
function createModel(inputShape) {
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 128, activation: 'relu', inputShape: [inputShape]}));
    model.add(tf.layers.dropout(0.5)); // Dropout layer
    model.add(tf.layers.dense({units: 64, activation: 'relu'}));
    model.add(tf.layers.dense({units: 2, activation: 'softmax'}));
}

async function trainModel(model, inputData, outputData) {
    await model.fit(inputData, outputData, {
        epochs: 20,
        validationSplit: 0.2,
        callbacks: [tf.callbacks.earlyStopping({ monitor: 'val_loss' })],
    });
    console.log('Model training complete.');
}



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

async function updateModelWithNewData(model, newData) {
    const { inputData, outputData } = preprocessNewData(newData); // Preprocess new data
    await model.fit(inputData, outputData, {
        epochs: 5, // Adjust epochs for update
        validationSplit: 0.2,
    });
    console.log('Model updated with new data.');
}

module.exports = { createModel, trainModel, predictRelevance, updateModelWithNewData };
