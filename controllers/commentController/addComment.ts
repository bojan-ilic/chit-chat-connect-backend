// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the CommentModel representing the Mongoose model for comments based on CommentSchema
const CommentModel = require('../../models/commentModel');

// Import the PostModel representing the Mongoose model for posts based on PostSchema
const PostModel = require('../../models/postModel');

/**
 * Controller function to add a new comment to the database.
 * Extracts necessary data from the request and creates a new comment using CommentModel.
 * @param {Object} req - The request object representing the incoming request and containing comment data for database addition.
 * @param {Object} res - The response object representing the server's response, used to send success message or error message when adding comment.
 * @returns {Object} - Returns a response object representing the server's reply containing saved comment data in case of a successful addition or an error message upon an unsuccessful attempt to add the comment to the database.
 */
const addComment = async (req, res) => {
    try {
        // Extract user details (_id, firstName, lastName) from the token present in request locals
        const { _id, firstName, lastName } = req.locals;

        // Extracts the 'postId' from the incoming request body according to the CommentSchema, linking the comment to a particular post
        const { postId } = req.body;

        // Check if the post with the provided ID exists
        const postExists = await PostModel.exists({ _id: postId });

        if (!postExists) {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'The referenced post does not exist.',
            });
        }

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

        // Create a new comment instance using CommentModel schema
        const newComment = new CommentModel(comment);

        // Save the newly created comment to the database
        const savedComment = await newComment.save();

        // Send a success response indicating successful comment addition to the database
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Comment added successfully.',
            data: savedComment, // Include the 'savedComment' object within the 'data' field of the response object
        });
    } catch (error) {
        // Error handling and sending appropriate error response
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
