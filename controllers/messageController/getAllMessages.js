// Import HTTP status codes and messages for response handling
const {httpStatus} = require('../../config/constants');

// Import MessageModel representing Mongoose model for messages based on MessageSchema
const MessageModel = require('../../models/messageModel');

/**
 * Controller function to fetch all messages related to the authenticated user from the database.
 * Private messages are those where either the sender or receiver matches the logged-in user's ID.
 * Public messages are those marked with 'isPublic: true'.
 * Extracts necessary data from the request and creates a new message using MessageModel.
 * @param {Object} req - The request object representing the incoming request and containing user details for message retrieval.
 * @param {Object} res - The response object representing the server's response, used to send retrieved messages or error messages.
 * @returns {Object} - Returns a response object representing the server's reply containing the list of user-specific messages or an error message.
 */

const getAllMessages = async (req, res) => {
	try {
		// Extract user ID from the token representing the logged-in user with the alias 'loggedInUserID'
		const {_id: loggedInUserID} = req.locals;

		// Query to retrieve private messages where the sender or receiver ID matches the logged-in user ID, and all public messages, sorted by creation date
		const messages = await MessageModel.find({
			$or: [
				{$and: [{senderId: loggedInUserID}, {isPublic: false}]}, // Match private messages sent by the logged-in user
				{$and: [{receiverId: loggedInUserID}, {isPublic: false}]}, // Match private messages received by the logged-in user
				{isPublic: true} // Match messages marked as public
			]
		}).sort({createdAt: -1}); // Sort messages by creation date

		// Send the retrieved messages in the response
		res.status(httpStatus.SUCCESS.code).send({
			status: 'success',
			message: httpStatus.SUCCESS.message,
			customMessage: 'All messages retrieved successfully.',
			data: messages // Include the retrieved messages in the response
		});
	} catch (error) {
		// Handling errors and sending an appropriate error response
		res.status(httpStatus.SERVICE_ERROR.code).send({
			status: 'error',
			message: httpStatus.SERVICE_ERROR.message,
			customMessage: 'Failed to retrieve messages.',
			error: error.message
		});
	}
};

/**
 * Exports the getAllMessages controller function to enable its use throughout the application.
 * @module getAllMessagesController
 * @exports {Function} getAllMessages - Function for fetching all user-specific messages
 */
module.exports = getAllMessages;
