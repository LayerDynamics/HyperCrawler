// ./utils/proxySchedule.js
/**
 * @module proxySchedule
 */

const schedule = require('node-schedule');
const { fetchFreshProxies, validateProxies } = require('./fetchFreshProxies');
const { updateProxyList } = require('./rotatingProxy');

/**
 * Scheduled task to refresh and validate proxies.
 */
schedule.scheduleJob('*/5 * * * *', async () => {
  console.log('Scheduled job to refresh and validate proxies started');
  try {
    const freshProxies = await fetchFreshProxies();
    console.log(`Fetched ${freshProxies.length} fresh proxies`);

    // Validate the fetched proxies before using them
    const validatedProxies = await validateProxies(freshProxies);
    console.log(`Validated and kept ${validatedProxies.length} proxies`);

    // Update the proxy list with the validated proxies
    updateProxyList(validatedProxies);
    console.log('Proxy list updated with validated proxies');
  } catch (error) {
    console.error('Scheduled job to refresh and validate proxies failed:', error);
  }
});
