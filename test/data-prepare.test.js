// ./tests/data-prepare.test.js
const { preprocessText } = require('../crawler/data-prepare');

describe('Data Preparation', () => {
  it('should correctly preprocess text', () => {
    const rawText = "Example Text, with punctuation!";
    const processed = preprocessText(rawText);
    expect(processed).toBe("example text with punctuation");
  });
});
