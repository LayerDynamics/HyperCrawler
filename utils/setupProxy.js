// ./utils/setupProxy.js
/**
 * @module setupProxy
 */

const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Function to set up proxy middleware for your application.
 * @param {Object} app - The express app instance.
 */
function setupProxies(app) {
    // Proxying API scrape requests
    app.use('/api/scrape', (req, res, next) => {
        // Extracting the target URL from request parameters or body
        const targetUrl = req.query.url || req.body.url;

        // Creating a dynamic proxy middleware instance targeted at the extracted URL
        const proxyOptions = {
            target: targetUrl,
            changeOrigin: true, // for virtual hosted sites
            logLevel: 'debug', // to log proxy activity for debugging
            onProxyReq: (proxyReq, req) => {
                // Optional: Manipulate the proxy request before it's sent
                console.log(`Proxying request to: ${targetUrl}`);
            },
            onError: (err, req, res) => {
                // Optional: Custom error handling
                console.error(`Proxy error: ${err.message}`);
                res.status(500).json({ error: 'Proxy error', details: err.message });
            }
        };

        // Apply the proxy middleware to the current path
        createProxyMiddleware(proxyOptions)(req, res, next);
    });
}

module.exports = { setupProxies };
