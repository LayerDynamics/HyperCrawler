// ./crawler/loadModels.js
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

/**
 * Cached instance of the MobileBert model to prevent reloading.
 * @type {?Object}
 */
let mobileBertModel;

/**
 * Cached instance of the Universal Sentence Encoder model to prevent reloading.
 * @type {?Object}
 */
let useModel;

/**
 * Loads the MobileBert model asynchronously from the specified path, if not already loaded.
 * This function caches the model instance globally to reuse for subsequent calls.
 * 
 * @returns {Promise<Object>} The loaded MobileBert model.
 */
async function loadMobileBertModel() {
    if (!mobileBertModel) {
        // Adjust the path to where your TensorFlow.js model is stored.
        const modelPath = 'file:../mobilebert/model.json'; 
        mobileBertModel = await tf.loadLayersModel(modelPath);
        console.log('MobileBert model loaded');
    }
    return mobileBertModel;
}

/**
 * Loads the Universal Sentence Encoder model asynchronously, if not already loaded.
 * This function caches the model instance globally to reuse for subsequent calls.
 * 
 * @returns {Promise<Object>} The loaded Universal Sentence Encoder model.
 */
async function loadUSEModel() {
    if (!useModel) {
        useModel = await use.load();
        console.log('Universal Sentence Encoder model loaded');
    }
    return useModel;
}

/**
 * Generates embeddings for the given texts using the Universal Sentence Encoder model.
 * 
 * @param {string[]|string} texts - A single text string or an array of text strings to generate embeddings for.
 * @returns {Promise<tf.Tensor>} A promise that resolves to the tensor of embeddings.
 */
async function getUSEEmbeddings(texts) {
    const model = await loadUSEModel();
    const embeddings = await model.embed(texts);
    return embeddings;
}

module.exports = { loadMobileBertModel, getUSEEmbeddings };
