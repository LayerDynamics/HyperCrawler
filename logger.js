// ./logger.js
/**
 * @module Logger
 */

const winston = require('winston');

/**
 * Logger instance configured with Winston.
 * @const {winston.Logger}
 */
const logger = winston.createLogger({
  /**
   * Logging level.
   * @type {String}
   */
  level: 'info',
  /**
   * Logging format.
   * @type {winston.Logform.Format}
   */
  format: winston.format.json(),
  /**
   * Transports to output logs.
   * @type {Array}
   */
  transports: [
    /**
     * File transport for error logs.
     * @type {winston.transports.File}
     */
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    /**
     * File transport for combined logs.
     * @type {winston.transports.File}
     */
    new winston.transports.File({ filename: 'combined.log' })
  ],
});

/**
 * Add console transport for non-production environments.
 */
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
