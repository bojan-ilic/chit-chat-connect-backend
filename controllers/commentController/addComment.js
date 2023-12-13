// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the Comment Model module representing the schema and functionalities for comments
const commentModel = require('../../models/commentModel');

/**
 * Controller function to add a new comment to the database.
 * Extracts necessary data from the request and creates a new comment using commentModel.
 * @param {Object} req - The request object containing comment details
 * @param {Object} res - The response object used to send success message or error message when adding comment
 * @returns {Object} - Returns a response with the saved comment or an error message
 */
const addComment = async (req, res) => {
    try {
        // Extract user details from token present in request locals
        const { _id, firstName, lastName } = req.locals;

        // Construct a new comment object merging request body details with user information from the token
        const comment = {
            // Spread the contents of the request body into the comment object
            ...req.body,
            // Create a nested 'user' object within the comment
            user: {
                id: _id, // Assign the '_id' from the token to the 'id' field of the 'user' object
                firstName, // Assign the 'firstName' from the token to the 'firstName' field of the 'user' object
                lastName, // Assign the 'lastName' from the token to the 'lastName' field of the 'user' object
            },
        };

        // Create a new comment instance using commentModel schema
        const newComment = new commentModel(comment);

        // Save the newly created comment to the database
        const savedComment = await newComment.save();

        // Send a success response indicating successful comment addition
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Comment added successfully.',
            data: savedComment, // Include the 'savedComment' object within the 'data' field of the response object
        });
    } catch (error) {
        // Handling errors and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to add comment.',
            error: error.message,
        });
    }
};

/**
 * Exports the addComment controller function to enable its use throughout the application.
 * @module addCommentController
 * @exports {Function} addComment - Function for adding a new comment
 */
module.exports = addComment;
