/**
 * Configuration file for ChitChatConnect, organizing crucial settings such as authentication keys,
 * database connections, server port, and CORS policies.
 * @module config
 */

import {CorsOptions} from 'cors';

require('dotenv').config();

/**
 * Whitelist of allowed origins for CORS.
 * @type {string[]}
 */
const whiteList = [
	// 'https://api.production-domain.com', // Production
	'http://localhost:3000', // Development: Frontend URL
	`http://localhost:${process.env.PORT}` // Development: Backend URL
];

/**
 * Configuration options along with specific constants for ChitChatConnect.
 * @type {Object}
 */
export const {
	PORT,
	DB_USERNAME,
	DB_PASSWORD,
	DB_URL,
	DEV_APP_NAME,
	PROD_APP_NAME,
	JWT_KEY,
	STRIPE_SK,
	CORS_OPTIONS
} = {
	/**
	 * Port for the server to listen on.
	 * @type {number}
	 */
	PORT: parseInt(process.env.PORT as string, 10),

	/**
	 * Database username.
	 * @type {string}
	 */
	DB_USERNAME: process.env.DB_USERNAME as string,

	/**
	 * Database password.
	 * @type {string}
	 */
	DB_PASSWORD: process.env.DB_PASSWORD as string,

	/**
	 * Database connection URL.
	 * @type {string}
	 */
	DB_URL: process.env.DB_URL as string,

	/**
	 * Development application name.
	 * @type {string}
	 */
	DEV_APP_NAME: process.env.DEV_APP_NAME as string,

	/**
	 * Production application name.
	 * @type {string}
	 */
	PROD_APP_NAME: process.env.PROD_APP_NAME as string,

	/**
	 * JWT key for authentication.
	 * @type {string}
	 */
	JWT_KEY: process.env.JWT_KEY as string,

	/**
	 * Stripe secret key for payment processing.
	 * @type {string}
	 */
	STRIPE_SK: process.env.STRIPE_SK as string,

	/**
	 *  CORS options for allowing cross-origin requests.
	 *  @type {Object}
	 *  @property {Function} origin - Function to determine if the request origin is allowed.
	 */
	CORS_OPTIONS: {
		origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
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
