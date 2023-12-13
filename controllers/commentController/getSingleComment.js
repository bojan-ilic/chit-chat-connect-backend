// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import CommentModel module representing the schema and functionalities for comments
const CommentModel = require('../../models/commentModel');

/**
 * Retrieves a single comment based on the provided ID.
 * @param {Object} req - The request object containing the ID of the comment to retrieve.
 * @param {Object} res - The response object used to send the comment data or error message.
 * @returns {Object} - Returns a response with the comment data or error message.
 */
const getSingleComment = async (req, res) => {
    try {
        // Extracting the ID parameter from the request object
        const { id } = req.params;

        // Finding a comment in the database with the given ID
        const comment = await CommentModel.findOne({ _id: id });

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
