// loadUSE.js
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

let model;

async function loadUSEModel() {
    if (!model) {
        model = await use.load();
        console.log('Universal Sentence Encoder model loaded');
    }
    return model;
}

async function getEmbeddings(texts) {
    const model = await loadUSEModel();
    const embeddings = await model.embed(texts);
    return embeddings;
}

module.exports = { getEmbeddings };
