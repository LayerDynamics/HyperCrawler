// ./utils/rotatingProxy.js
const ProxyChain = require('proxy-chain');

let globalProxyList = [];
let globalProxyStats = {}; // Proxy stats
let blacklist = new Set(); // Add problematic proxies here
// Update proxyStats after each request in rotatingProxy.js
const updateProxyStats = (proxyUrl, success, responseTime) => {
    const stats = globalProxyStats[proxyUrl] || { successCount: 0, failureCount: 0, totalResponseTime: 0, averageResponseTime: 0 };
    if (success) {
        stats.successCount += 1;
    } else {
        stats.failureCount += 1;
    }
    stats.totalResponseTime += responseTime;
    stats.averageResponseTime = stats.totalResponseTime / (stats.successCount + stats.failureCount);
    globalProxyStats[proxyUrl] = stats;
};

// Use this function to select a proxy based on performance
const selectBestProxy = () => {
    // Logic to select proxy with the best success rate and response time
};


const updateProxyList = (newList) => {
    globalProxyList = newList.filter((url) => url.startsWith('http')); // Ensuring only valid HTTP(S) proxies are kept
    console.log(`Proxy list updated with ${globalProxyList.length} entries.`);
};

const getRandomProxyUrl = () => {
    // Filter out blacklisted proxies
    const availableProxies = globalProxyList.filter(proxy => !blacklist.has(proxy));

    if (availableProxies.length === 0) {
        console.warn("Available proxy list is empty. No proxy will be used for this request.");
        return null;
    }

    const randomIndex = Math.floor(Math.random() * availableProxies.length);
    return availableProxies[randomIndex];
};

const server = new ProxyChain.Server({
    port: 8000,
    prepareRequestFunction: async ({ request }) => {
        const proxyUrl = getRandomProxyUrl();
        console.log(`Routing request for ${request.url} through proxy: ${proxyUrl || 'direct connection'}`);
        return {
            upstreamProxyUrl: proxyUrl,
            requestAuthentication: false,
            failMsg: 'Failed to connect through proxy',
        };
    },
    verbose: true, // Enable verbose logging for debugging purposes
});

server.listen(() => console.log(`Proxy server listening on port ${server.port}.`));

process.on('SIGINT', async () => {
    console.log('Shutting down proxy server...');
    await server.close();
    console.log('Proxy server successfully shut down.');
});

module.exports = { server, updateProxyList, getRandomProxyUrl };
