// ./tests/crawler.test.js
const { scrapeDynamicContent } = require('../crawler/crawler.js');

describe('Web Scraping Functionality', () => {
	it('should extract titles from the given URL', async () => {
	  const url = 'https://layerdynamics.co'; // Assuming this is a page you have control over or a test page
	  const titles = await scrapeDynamicContent(url);
	  expect(titles).toContain(''); // Adjust this to match an actual title on the page
	}, 10000); // Setting the timeout to 10 seconds for this test
  });
