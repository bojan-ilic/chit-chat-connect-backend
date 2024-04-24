// Import Socket.IO for real-time communication
const socketIo = require('socket.io');

// Import the 'jsonwebtoken' library for handling JSON Web Tokens (JWT)
const jwt = require('jsonwebtoken');

// Access environment variables from configuration file
const {CORS_OPTIONS, JWT_KEY} = require('../config/config');

// Import 'MessageModel' representing Mongoose model for messages based on MessageSchema
const MessageModel = require('../models/messageModel');

/**
 * Manages Socket.IO configuration for real-time communication and sets up event listeners.
 * @module socket
 * @param {Object} httpServer - The HTTP server object created by Express.
 * @returns {Object} Returns the Socket.IO server instance.
 */
const setupSocket = (httpServer) => {
	// Initialize Socket.IO with the HTTP server and CORS options
	const ioServer = socketIo(httpServer, {
		// Set CORS options for allowing cross-origin request
		cors: {
			origin: CORS_OPTIONS.origin, // Define the allowed origin for requests
			methods: ["GET", "POST"] // Specify the allowed HTTP methods
		}
	});

	// Event listener for new socket connections
	ioServer.on('connection', (socket) => {
		// Extract the JWT token from the socket handshake
		const token = socket.handshake.query.token;

		// Authenticate the user using the JWT token
		if (token) {
			jwt.verify(token, JWT_KEY, (error, decoded) => {
				if (error) {
					// Handle authentication failure
					console.log('Authentication error:', error);
					socket.emit('authentication_failed', 'Failed to authenticate.');
					socket.disconnect();
				} else {
					// Store the user ID in the socket for future reference
					socket.userId = decoded._id;
					// Set up event listeners for the authenticated socket
					setupSocketListeners(socket, ioServer);
				}
			});
		} else {
			// Disconnect socket if no token is provided
			console.log('No token provided, disconnecting socket.');
			socket.disconnect();
		}
	});

	// Return the Socket.IO server instance
	return ioServer;
};

/**
 * Sets up event listeners for the authenticated socket.
 * @param {Object} socket - The Socket.IO socket object.
 * @param {Object} ioServer - The Socket.IO server object.
 */
function setupSocketListeners(socket, ioServer) {
	// Event listener for sending messages
	socket.on('sendMessage', async ({message, isPublic, receiverId}) => {
		// Check if the user is authenticated
		if (!socket.userId) {
			console.log('Unauthenticated message attempt by socket:', socket.id);
			return;
		}
		// Handle sending messages based on message type (public/private)
		try {
			// Create a new message document in the database
			const newMessage = new MessageModel({
				senderId: socket.userId,
				receiverId: isPublic ? null : receiverId,
				message,
				isPublic
			});

			// Save the message to the database
			const savedMessage = await newMessage.save();

			// Format the message data for broadcasting
			const broadcastMessage = {
				_id: savedMessage._id,
				senderId: socket.userId,
				message: savedMessage.message,
				isPublic: savedMessage.isPublic,
				receiverId: savedMessage.receiverId,
				createdAt: savedMessage.createdAt
			};

			// Broadcast the message to appropriate recipients
			if (isPublic) {
				ioServer.emit('publicMessageReceived', broadcastMessage);
			} else {
				ioServer.to(receiverId).emit('privateMessageReceived', broadcastMessage);
			}
		} catch (error) {
			console.error("Error saving message to DB:", error);
		}
	});

	// Event listener for socket disconnection
	socket.on('disconnect', () => {
		console.log(`User disconnected: ${socket.id} at ${new Date().toISOString()}`);
	});

};

/**
 * Exports the setupSocket function to enable its usage throughout the application.
 * @module setupSocket
 */
module.exports = setupSocket;