const mongoose = require('mongoose');

const EmbeddingSchema = new mongoose.Schema({
  url: { type: String, required: true, index: true }, // Added indexing
  contentReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' }, // Reference to original content
  contentType: { type: String, enum: ['article', 'tweet', 'feedback'], required: true }, // Content type
  embedding: [{ type: Number }], // Storing the embedding as an array of numbers
  tags: [{ type: String }], // Optional tags or categories
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

const Embedding = mongoose.model('Embedding', EmbeddingSchema);

module.exports = Embedding;
