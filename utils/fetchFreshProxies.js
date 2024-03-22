// ./utils/fetchFreshProxies.js
const axios = require('axios');

// Dynamically import node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fetchFreshProxies() {
    console.log('Fetching fresh proxies...');
    const proxySources = [
        'https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies',
        'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/all/data.json',
    ];

    const proxyList = [];

    try {
        // Fetching from ProxyScrape API
        const response1 = await (await fetch(proxySources[0])).text();
        proxyList.push(...response1.split('\n').filter(proxy => proxy.trim()));

        // Fetching from GitHub
        const response2 = await (await fetch(proxySources[1])).json();
        proxyList.push(...response2.map(proxy => `${proxy.ip}:${proxy.port}`));

        console.log(`Fetched ${proxyList.length} proxies`);
        return proxyList;
    } catch (error) {
        console.error('Failed to fetch proxies:', error);
        return [];
    }
}

async function testProxy(proxy, testUrls = ['https://httpbin.org/ip']) {
    for (let url of testUrls) {
        try {
            await axios.get(url, {
                proxy: {
                    host: proxy.ip,
                    port: parseInt(proxy.port),
                },
                timeout: 5000,
            });
            // Proxy works for this URL, continue checking if necessary
        } catch (error) {
            // Proxy failed for this URL, it's either down or banned
            return false;
        }
    }
    // Passed all checks
    return true;
}

async function validateProxies(proxies) {
    // Consider including URLs you'll be scraping in testUrls for a thorough check
    const testUrls = ['https://httpbin.org/ip', 'https://example.com'];
    const validationPromises = proxies.map(proxyString => {
        const [ip, port] = proxyString.split(':');
        return testProxy({ ip, port }, testUrls);
    });

    const validationResults = await Promise.all(validationPromises);
    return proxies.filter((_, index) => validationResults[index]);
}

module.exports = { fetchFreshProxies, validateProxies };
