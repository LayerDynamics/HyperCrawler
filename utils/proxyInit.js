// ./utils/proxyInit.js
/**
 * @module proxyInit
 */

const { server, updateProxyList } = require('./rotatingProxy');
const { fetchFreshProxies, validateProxies } = require('./fetchFreshProxies');
const schedule = require('node-schedule');

/**
 * Initializes the proxy server and sets up regular proxy list refreshing.
 * @function initializeProxies
 */
async function initializeProxies() {
  try {
    // Fetch and validate proxies at startup
    const freshProxies = await fetchFreshProxies();
    console.log(`Fetched ${freshProxies.length} fresh proxies.`);
    const validProxies = await validateProxies(freshProxies);
    console.log(`Validated ${validProxies.length} proxies.`);
    updateProxyList(validProxies);

    // Start the proxy server
    server.listen(() => console.log(`Proxy server listening on port ${server.port}`));

    // Schedule regular proxy list refresh every 5 minutes
    schedule.scheduleJob('*/5 * * * *', async () => {
      console.log('Refreshing proxy list...');
      const newFreshProxies = await fetchFreshProxies();
      const newValidProxies = await validateProxies(newFreshProxies);
      updateProxyList(newValidProxies);
      console.log(`Updated proxy list with ${newValidProxies.length} valid proxies.`);
    });

    console.log('Proxy initialization complete.');
  } catch (error) {
    console.error('Failed to initialize proxies:', error);
  }
}

initializeProxies();