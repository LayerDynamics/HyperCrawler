// ./tests/modelTrainer.test.js
const { createModel } = require('../crawler/modelTrainer.js');

describe('Model Training', () => {
  let model;

  beforeAll(() => {
    // Ensuring TensorFlow.js uses the CPU backend to avoid conflicts with GPU resources
    tf.setBackend('cpu');
  });

  afterAll(() => {
    // Cleanup any tensors that might have been created during tests to free memory
    tf.disposeVariables();
  });

  beforeEach(() => {
    // Create a new model for each test to ensure isolation
    model = createModel(10);
  });

  afterEach(() => {
    // Dispose the model after each test
    model.dispose();
  });

  it('should compile a model', () => {
    expect(model).toBeDefined();
    expect(model.layers.length).toBeGreaterThan(0);
  });

  // Further tests can include checking the model structure, output shapes, etc.
});
