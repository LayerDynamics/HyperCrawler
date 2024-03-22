// ./index.js
require('wtfnode').init() // Debugging Node.js processes
const express = require('express')
const cors = require('cors')
const { connectDB, initializeLoki } = require('./data/db');
const { setupProxies } = require('./utils/setupProxy')
const { server, updateProxyList } = require('./utils/rotatingProxy')
const {
	fetchFreshProxies,
	validateProxies
} = require('./utils/fetchFreshProxies')
const schedule = require('node-schedule')
const morgan = require('morgan')
const mongoose = require('mongoose')
const logger = require('./logger')
const {
	processFeedback,
	processAndRetrain
} = require('./data/feedbackHandler')

const app = express()
const port = process.env.PORT || 3000

morgan.token('proxy', function (req) {
  return req.proxyUsed || 'No proxy' // Assuming proxyUsed is a property you set on the request
})
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :proxy'
	)
)

app.use(
	cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
})
)

// Schedule jobs for proxies and model retraining
schedule.scheduleJob('*/5 * * * *', async () => {
  try {
    const dbHealth = await checkDatabaseHealth()
    console.log(`Database Health: ${dbHealth}`)

    const freshProxies = await fetchFreshProxies()
    console.log(`Fetched ${freshProxies.length} fresh proxies.`)

    const validProxies = await validateProxies(freshProxies)
    console.log(`Validated ${validProxies.length} proxies.`)

    globalProxyList = validProxies
    console.log(
			`Updated global proxy list with ${globalProxyList.length} proxies.`
		)
  } catch (error) {
    console.error('Health check failed:', error)
  }
})

schedule.scheduleJob('0 0 * * *', async () => {
  console.log('Starting scheduled feedback processing and model retraining...')
  await processAndRetrain()
})

app.get('/health-check', async (req, res) => {
  const dbStatus = await checkDatabaseHealth()
  res.status(200).json({ status: 'OK', dbStatus })
})

app.post('/submit-feedback', async (req, res) => {
  const { url, correctPrediction, userFeedback } = req.body
  try {
    await processFeedback(url, correctPrediction, userFeedback)
    res.status(200).send('Feedback submitted successfully')
    setImmediate(async () => {
      await processAndRetrain() // Ensure this doesn't run too frequently
    })
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    res.status(500).send('Error submitting feedback')
  }
})

async function checkDatabaseHealth () {
  try {
    await mongoose.connection.db.admin().ping()
    return 'OK'
  } catch (error) {
    return 'FAIL'
  }
}

async function initialize() {
	try {
			// Initialize MongoDB
			await connectDB();
			console.log('MongoDB Connected Successfully.');

			// Initialize LokiJS
			await initializeLoki();
			console.log('LokiJS Initialized Successfully.');

			// Proceed with the rest of the application initialization

			// Existing logic to fetch and validate proxies
			const initialProxies = await fetchFreshProxies();
			const validProxies = await validateProxies(initialProxies);
			updateProxyList(validProxies);
			console.log(`Initialized with ${validProxies.length} valid proxies.`);

			setupProxies(app); // Set up dynamic proxy routes here

			// Start the Express server
			const expressServer = app.listen(port, () =>
					console.log(`Server running on port ${port}`)
			);

			// Graceful shutdown logic
			process.on('SIGINT', async () => {
					server.close(() => console.log('Proxy server closed'));
					mongoose.connection.close(false, () => {
							console.log('Mongoose connection closed');
							expressServer.close(() => {
									console.log('Express server closed');
									process.exit(0);
							});
					});
					console.log('All resources closed. Exiting.');
			});
	} catch (error) {
			console.error('Initialization failed:', error);
			process.exit(1); // Exit the process with an error code
	}
}

initialize().catch(console.error);
