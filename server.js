// Importing the Express framework for building the server
const express = require('express');

// Importing Mongoose for MongoDB object modeling
const mongoose = require('mongoose');

// Access environment variables
const environment = process.env.NODE_ENV;
const {
    PROD_APP_NAME,
    DEV_APP_NAME,
    PORT,
    DB_URL,
} = require('./config/config');

// Initialize Express server
const server = express();

// Connect to MongoDB
mongoose
    .connect(DB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error: ', error));

/**
 * Route for the root URL
 * @param {Object} req - Express request object
 * @param {Object} res = Express response object
 */
server.get('/', (req, res) => {
    // Determine application name based on environment
    const appName = environment === 'production' ? PROD_APP_NAME : DEV_APP_NAME;

    // Determine environment message
    const environmentMessage =
        environment === 'production' ? 'production' : 'development';

    // Send welcome message based on environment and app name
    res.send(`Welcome to the ${environmentMessage} environment of ${appName}`);
});

/**
 * Listens for a termination signal (SIGINT: Signal Interrupt) to ensure graceful shutdown by closing the MongoDB connection.
 * This helps in proper cleanup and resource release before the server stops.
 */
process.on('SIGINT', () => {
    console.log('MongoDB disconnected through app termination');
    process.exit(0);
});

/**
 Start the server
 */
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
