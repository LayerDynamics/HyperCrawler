// ./crawler/loadUse
/**
 * @module loadUse
 */

const tf = require('@tensorflow/tfjs-node');

/**
 * Path to the Universal Sentence Encoder (USE) model.
 * @type {string}
 */
const modelPath = 'file://../universal-sentence-encoder/model.json';

/**
 * Loaded Universal Sentence Encoder (USE) model.
 * @type {tf.GraphModel}
 */
let model;

/**
 * Loads the Universal Sentence Encoder (USE) model.
 * @async
 * @function loadUSEModel
 * @returns {Promise<tf.GraphModel>} A promise that resolves with the loaded USE model.
 */
async function loadUSEModel() {
    if (!model) {
        model = await tf.loadGraphModel(modelPath); // Use loadGraphModel for models saved in GraphModel format
        console.log('Universal Sentence Encoder model loaded from local storage.');
    }
    return model;
}

/**
 * Generates embeddings for the given texts using the loaded USE model.
 * @async
 * @function getEmbeddings
 * @param {string|string[]} texts - Texts to generate embeddings for. Can be a single string or an array of strings.
 * @returns {Promise<tf.Tensor>} A promise that resolves with the embeddings tensor.
 */
async function getEmbeddings(texts) {
    // Ensure your text input is properly formatted for USE; typically, it expects a string or an array of strings.
    const input = tf.tensor1d(texts, 'string');
    const embeddings = await model.executeAsync({'Placeholder': input}); // Adjust based on the actual input node name of the USE model
    return embeddings;
}

module.exports = { getEmbeddings };
