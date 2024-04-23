// Import HTTP status codes and messages for response handling
const {httpStatus} = require('../../config/constants');

// Import MessageModel representing Mongoose model for messages based on MessageSchema
const MessageModel = require('../../models/messageModel');

/**
 * Controller function to fetch private messages between two users.
 * Retrieves messages where the logged-in user is either the sender or receiver,
 * and the specified userId matches the other party in the message.
 * @param {Object} req - The request object representing the incoming request and containing parameters for message retrieval.
 * @param {Object} res - The response object representing the server's response, used to send retrieved messages or error messages.
 * @returns {Object} - Returns a response object representing the server's reply containing the list of private messages or an error message.
 */
const getPrivateMessages = async (req, res) => {
	try {
		// Check if authentication details and the required user ID parameter are present to proceed with fetching messages
		if (!req.locals || !req.params.userId) {
			// If either is missing, return an error response immediately
			return res.status(httpStatus.BAD_REQUEST.code).send({
				status: 'error',
				message: 'Missing user information or user ID parameter.',
				customMessage: 'Cannot process request due to missing data.'
			});
		}

		// Extract the logged-in user's ID from request locals for query filtering
		const loggedInUserID = req.locals._id;

		// Extract the user ID from request parameters to identify the other party in the private message exchange
		const {userId: otherUserId} = req.params;

		// Query to retrieve messages where (senderId, receiverId) matches (loggedInUserID, otherUserId) or vice versa
		const messages = await MessageModel.find({
			$or: [
				{$and: [{senderId: loggedInUserID}, {receiverId: otherUserId}, {isPublic: false}]}, // Matches messages where the logged-in user is the sender and the specified user is the receiver, and the message is private
				{$and: [{senderId: otherUserId}, {receiverId: loggedInUserID}, {isPublic: false}]} // Matches messages where the logged-in user is the receiver and the specified user is the sender, and the message is private
			]
		}).sort({createdAt: 1}); // Sorting messages from oldest to newest

		// Send the retrieved messages in the response
		res.status(httpStatus.SUCCESS.code).send({
			status: 'success',
			message: httpStatus.SUCCESS.message,
			customMessage: 'Private messages retrieved successfully.',
			data: messages
		});

		// Handling errors and sending an appropriate error response
	} catch (error) {
		console.error('Error fetching private messages:', error);
		res.status(httpStatus.SERVICE_ERROR.code).send({
			status: 'error',
			message: httpStatus.SERVICE_ERROR.message,
			customMessage: 'Failed to retrieve private messages.',
			error: error.message
		});
	}
};

/**
 * Exports the getPrivateMessages controller function to enable its use throughout the application.
 * @module getPrivateMessagesController
 * @exports {Function} getPrivateMessages - Function for fetching private messages between two specific users
 */
module.exports = getPrivateMessages;
