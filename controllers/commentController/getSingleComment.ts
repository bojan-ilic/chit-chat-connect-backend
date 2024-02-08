// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the CommentModel representing the Mongoose model for comments based on CommentSchema
const CommentModel = require('../../models/commentModel');

/**
 * Controller function to retrieve a single comment from the database based on the provided ID.
 * Retrieves a comment associated with the specific ID from the comment collection.
 * @param {Object} req - The request object representing the incoming request with the comment ID to be fetched.
 * @param {Object} res - The response object representing the server's response used to send the retrieved comment data or error messages.
 * @returns {Object} - Returns a response object representing the server's reply containing the fetched comment data or an error message.
 */
const getSingleComment = async (req, res) => {
    try {
        // Extract the comment ID from the request parameters with the alias 'commentId' to retrieve a specific comment
        const { id: commentId } = req.params;

        // Finding a comment in the database with the given ID
        const comment = await CommentModel.findOne({ _id: commentId });

        if (comment) {
            // If a comment was found, send a success response with the comment data
            res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'Comment retrieved successfully',
                data: comment, // Sending the retrieved comment object within the 'data' field in the response
            });
        } else {
            // If no comment was found, send an error response indicating comment not found
            res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Comment not found',
            });
        }
    } catch (error) {
        // Handling any internal server errors and sending an error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to fetch the comment',
            error: error.message,
        });
    }
};

/**
 * Exports the getSingleComment controller function to enable its use throughout the application.
 * @module getSingleComment
 * @exports {Function} getSingleComment - Function for fetching a single comment
 */
module.exports = getSingleComment;
