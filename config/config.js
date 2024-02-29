/**
 * Configuration file for ChitChatConnect, organizing crucial settings such as authentication keys,
 * database connections, server port, and CORS policies.
 * @module config
 */

require('dotenv').config();

/**
 * Whitelist of allowed origins for CORS.
 * @type {string[]}
 */
const whiteList = [
	'https://chit-chat-connect.bojanilic.net', // Production: Frontend URL
	'https://backend.chit-chat-connect.bojanilic.net', // Production: Backend URL
	'http://localhost:3000', // Development: Frontend URL
	`http://localhost:${process.env.PORT}` // Development: Backend URL
];

/**
 * Configuration options
 * @typedef {Object} ConfigOptions
 * @property {string} JWT_KEY - JWT key for authentication.
 * @property {string} DB_URL - Database connection URL.
 * @property {number} PORT - Port for the server to listen on.
 * @property {string} DB_USERNAME - Database username.
 * @property {string} DB_PASSWORD - Database password.
 * @property {string} STRIPE_SK - Stripe secret key for payment processing.
 * @property {Object} CORS_OPTIONS - CORS options for allowing cross-origin requests.
 * @property {Function} CORS_OPTIONS.origin - Function to determine if the request origin is allowed.
 */

/**
 * Configuration settings exported from the configuration module.
 * @type {ConfigOptions}
 */
module.exports = {
	/**
	 * Port for the server to listen on.
	 * @type {number}
	 */
	PORT: process.env.PORT,

	/**
	 * Database username.
	 * @type {string}
	 */
	DB_USERNAME: process.env.DB_USERNAME,

	/**
	 * Database password.
	 * @type {string}
	 */
	DB_PASSWORD: process.env.DB_PASSWORD,

	/**
	 * Database connection URL.
	 * @type {string}
	 */
	DB_URL: process.env.DB_URL,

	/**
	 * Development application name.
	 * @type {string}
	 */
	DEV_APP_NAME: process.env.DEV_APP_NAME,

	/**
	 * Production application name.
	 * @type {string}
	 */
	PROD_APP_NAME: process.env.PROD_APP_NAME,

	/**
	 * JWT key for authentication.
	 * @type {string}
	 */
	JWT_KEY: process.env.JWT_KEY,

	/**
	 * Stripe secret key for payment processing.
	 * @type {string}
	 */
	STRIPE_SK: process.env.STRIPE_SK,

	/**
	 *  CORS options for allowing cross-origin requests.
	 *  @type {Object}
	 *  @property {Function} origin - Function to determine if the request origin is allowed.
	 */
	CORS_OPTIONS: {
		origin: (origin, callback) => {
			if (!origin || whiteList.includes(origin)) {
				// If the request origin is in the whitelist or is absent (local request)
				callback(null, true);
			} else {
				// If the request origin is not allowed
				callback(new Error('Not allowed by CORS'));
			}
		}
	}
};
