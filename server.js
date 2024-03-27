// Import the Express framework for building the server
const express = require('express');

// Import cors package to enable Cross-Origin Resource Sharing (CORS) for this Express application
const cors = require('cors');

// Import Mongoose for MongoDB object modeling
const mongoose = require('mongoose');

// Import HTTP for creating an HTTP server
const http = require('http');

// Import Socket.IO for real-time communication
const socketIo = require('socket.io');

// Access environment variables
const environment = process.env.NODE_ENV;
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

// Connect to MongoDB
mongoose
	.connect(DB_URL)
	.then(() => console.log('MongoDB connected'))
	.catch((error) => console.error('MongoDB connection error: ', error));

/**
 * Route for the root URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
expressApp.get('/', (req, res) => {
	// Determine application name based on environment
	const appName = environment === 'production' ? PROD_APP_NAME : DEV_APP_NAME;

	// Determine environment message
	const environmentMessage =
		environment === 'production' ? 'production' : 'development';

	// Send welcome message based on environment and app name
	res.send(`Welcome to the ${environmentMessage} environment of ${appName}`);
});

// Set up API routes handling for requests starting with '/api'
expressApp.use('/api', require('./routes'));

// Create an HTTP server from the Express app
const httpServer = http.createServer(expressApp);

// Initialize Socket.IO with the HTTP server
const ioServer = socketIo(httpServer, {
	cors: {
		origin: CORS_OPTIONS.origin, // Use the CORS options from your config
		methods: ["GET", "POST"]
	}
});

// Socket.IO setup for handling real-time chat functionality
ioServer.on('connection', (socket) => {
	console.log('A user connected', socket.id);

	// Emit a test event to the connected client
	socket.emit('customEvent', 'Hello from server!');

	// Handle chat events, disconnections, etc.
	socket.on('disconnect', () => {
		console.log('User disconnected', socket.id);
	});
});

/**
 Start the server
 */
httpServer.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

/**
 * Listens for a termination signal (SIGINT: Signal Interrupt) to ensure graceful shutdown by closing the MongoDB connection.
 * This helps in proper cleanup and resource release before the server stops.
 */
process.on('SIGINT', () => {
	console.log('MongoDB disconnected through app termination');
	process.exit(0);
});