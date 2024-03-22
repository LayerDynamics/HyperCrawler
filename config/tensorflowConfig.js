// tensorflowConfig.js

let tf;
try {
  // Attempt to use GPU version if available (not applicable for Intel MacBook Pro without CUDA)
  tf = require('@tensorflow/tfjs-node-gpu');
  console.log('Using TensorFlow.js with GPU support.');
} catch (error) {
  // Fallback to CPU version
  tf = require('@tensorflow/tfjs-node');
  console.log('Using TensorFlow.js with CPU support.');
}

module.exports = tf;
