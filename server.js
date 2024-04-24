/**
 * The server.js file sets up and runs the main server for ChitChatConnect.
 * It initializes the Express server, sets up middleware for CORS and JSON parsing, connects to MongoDB, and handles API routes.
 * It also configures Socket.IO for real-time communication and handles graceful shutdown on receiving SIGINT.
 * @returns {void} Does not return anything.
 * @type {module} This file acts as the entry point for the server.
 */

// Import the Express framework for building the server
const express = require('express');

// Import cors package to enable Cross-Origin Resource Sharing (CORS)
const cors = require('cors');

// Import Mongoose for MongoDB object modeling
const mongoose = require('mongoose');

// Import HTTP for creating an HTTP server
const http = require('http');

// Import the socket configuration module
const setupSocket = require('./utils/socket');

// Access environment variables from configuration file
const {
	PROD_APP_NAME,
	DEV_APP_NAME,
	CORS_OPTIONS,
	PORT,
	DB_URL
} = require('./config/config');

// Initialize the Express application
const expressApp = express();

// Use CORS middleware with predefined options to allow requests from whitelisted origins
expressApp.use(cors(CORS_OPTIONS));

// Middleware to parse JSON data with a size limit of 10mb
// Crucial for handling POST requests that contain JSON data
expressApp.use(express.json({limit: '10mb'}));

// Connect to MongoDB using the connection string from configuration
mongoose.connect(DB_URL)
	.then(() => console.log('MongoDB connected'))
	.catch((error) => console.error('MongoDB connection error:', error));

/**
 * Handles the root URL of the server.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * Returns a welcoming message with the application name and environment.
 */
expressApp.get('/', (req, res) => {
	// Determine application name based on environment
	const appName = process.env.NODE_ENV === 'production' ? PROD_APP_NAME : DEV_APP_NAME;

	// Determine environment message
	const environmentMessage = process.env.NODE_ENV === 'production' ? 'production' : 'development';

	// Send welcome message based on environment and app name
	res.send(`Welcome to the ${environmentMessage} environment of ${appName}`);
});

// Set up API routes handling for requests starting with '/api'
expressApp.use('/api', require('./routes'));

// Create an HTTP server from the Express app
const httpServer = http.createServer(expressApp);

// Initialize Socket.IO with the HTTP server using the setupSocket function
setupSocket(httpServer);

// Start the server
httpServer.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

/**
 * Listens for a termination signal (SIGINT: Signal Interrupt) to ensure graceful shutdown by closing the MongoDB connection.
 * This helps in proper cleanup and resource release before the server stops.
 */
process.on('SIGINT', () => {
	console.log('MongoDB disconnected through app termination');
	mongoose.disconnect(); // Mongoose disconnects when the application terminates
	process.exit(0); // Exit the process with a status code of 0, indicating a successful shutdown
});