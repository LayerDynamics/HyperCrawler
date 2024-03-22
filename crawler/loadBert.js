// ./crawler/loadBert.js
const tf = require('@tensorflow/tfjs-node');

/**
 * Asynchronously loads the MobileBert model from a specified path.
 * @returns {Promise<tf.LayersModel>} The loaded TensorFlow.js layers model.
 */
async function loadMobileBertModel() {
    // Specify the path to the MobileBert model.json file
    const modelPath = 'file:../mobilebert/model.json'; // Adjust the path as necessary

    // Load and return the model using TensorFlow.js
    const model = await tf.loadLayersModel(modelPath);
    console.log('MobileBert model loaded successfully.');

    return model;
}

module.exports = { loadMobileBertModel };
