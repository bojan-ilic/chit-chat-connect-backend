// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the MessageModel representing the schema and functionalities for messages
const MessageModel = require('../../models/messageModel');

/**
 * Controller function to add a new message to the database.
 * Extracts necessary data from the request and creates a new message using MessageModel.
 * @param {Object} req - The request object containing message details
 * @param {Object} res - The response object used to send success or error messages when adding a message
 * @returns {Object} - Returns a response with the saved message or an error message
 */
const addMessage = async (req, res) => {
    try {
        // Extract sender's ID from the request locals
        const { _id: senderId } = req.locals;

        // Extract receiver's ID from request parameters
        const { userId: receiverId } = req.params;

        // Create a newMessage instance using MessageModel schema, including senderId, receiverId, and other details from the request body
        const newMessage = new MessageModel({
            senderId, // Assign the sender's ID to the 'senderId' field in the message
            receiverId, // Assign the receiver's ID to the 'receiverId' field in the message
            ...req.body, // Include other message details from the request body using the spread operator
        });

        // Save the new message to the database
        const savedMessage = await newMessage.save();

        // Send the saved message or an error message based on the result
        if (savedMessage) {
            res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'Message added successfully.',
                data: savedMessage, // Include the saved message data in the response
            });
        } else {
            res.status(httpStatus.SERVICE_ERROR.code).send({
                status: 'error',
                message: httpStatus.SERVICE_ERROR.message,
                customMessage: 'Failed to add message.',
            });
        }
    } catch (error) {
        // Handling errors and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to save message to database.',
            error: error.message,
        });
    }
};

/**
 * Exports the addMessage controller function to enable its use throughout the application.
 * @module addMessageController
 * @exports {Function} addMessage - Function for adding a new message
 */
module.exports = addMessage;
