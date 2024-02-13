/**
 * ChitChatConnect Server
 *
 * @description
 * Entry point for the ChitChatConnect web application backend. This server, built on Express.js
 * and MongoDB, manages API routes, establishes a connection to the database, and handles incoming requests.
 *
 * @type {Express.Application}
 * Represents the Express.js application instance.
 *
 * @returns {void}
 * This server initializes and listens for incoming requests while connecting to the MongoDB database.
 */

// Import the Express framework for building the server
const express = require('express');

// Import Request and Response types from Express for improved type annotations
import {Request, Response} from 'express';

// Import Mongoose for MongoDB object modeling
import mongoose from 'mongoose';

// Access the environment variable NODE_ENV to determine the current environment
const environment = process.env.NODE_ENV;

// Import configuration constants from config.ts
import {
	PROD_APP_NAME,
	DEV_APP_NAME,
	PORT,
	DB_URL
} from './config/config';

// Initialize Express server
const server = express();

// Connect to MongoDB
mongoose
	.connect(DB_URL)
	.then(() => console.log('MongoDB connected'))
	.catch((error) => console.error('MongoDB connection error: ', error));

/**
 * Middleware to parse JSON data with a size limit of 10mb.
 * Crucial for handling POST requests that contain JSON data.
 */
server.use(express.json({limit: '10mb'}));

/**
 * Route for the root URL
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void}
 * Sends a welcome message based on the current environment and application name.
 */
server.get('/', (req: Request, res: Response) => {
	// Determine application name based on environment
	const appName = environment === 'production' ? PROD_APP_NAME : DEV_APP_NAME;

	// Determine environment message
	const environmentMessage =
		environment === 'production' ? 'production' : 'development';

	// Send welcome message based on environment and app name
	res.send(`Welcome to the ${environmentMessage} environment of ${appName}`);
});

// Set up API routes handling for requests starting with '/api'
server.use('/api', require('./routes'));

/**
 * Listens for a termination signal (SIGINT: Signal Interrupt) to ensure graceful shutdown by closing the MongoDB connection.
 * This helps in proper cleanup and resource release before the server stops.
 */
process.on('SIGINT', () => {
	console.log('MongoDB disconnected through app termination');
	process.exit(0);
});

/**
 * Start the server
 * @returns {void}
 * Logs the server start message to the console.
 */
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
