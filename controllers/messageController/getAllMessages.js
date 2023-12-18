// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the MessageModel representing the schema and functionalities for messages
const MessageModel = require('../../models/messageModel');

/**
 * Controller function to fetch all messages related to the authenticated user from the database.
 * @param {Object} req - The request object containing user details and used to retrieve user-specific messages.
 * @param {Object} res - The response object used to send the retrieved messages or error messages.
 * @returns {Object} - Returns a response with the list of user-specific messages or an error message.
 */

const getAllMessages = async (req, res) => {
    try {
        // ID of the logged-in user obtained from the authentication token
        const { _id: loggedInUserID } = req.locals;

        // Retrieve messages where the sender or receiver ID matches the logged-in user ID
        const messages = await MessageModel.find({
            $or: [{ senderId: loggedInUserID }, { receiverId: loggedInUserID }],
        });

        // Send the retrieved messages in the response
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'All messages retrieved successfully.',
            data: messages, // Include the retrieved messages in the response
        });
    } catch (error) {
        // Handling errors and sending an appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to retrieve messages.',
            error: error.message,
        });
    }
};

/**
 * Exports the getAllMessages controller function to enable its use throughout the application.
 * @module getAllMessagesController
 * @exports {Function} getAllMessages - Function for fetching all user-specific messages
 */
module.exports = getAllMessages;
