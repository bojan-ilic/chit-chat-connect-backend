// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the CommentModel module representing the schema and functionalities for comments
const CommentModel = require('../../models/commentModel');

/**
 * Controller function to delete a comment.
 * @param {Object} req - The request object containing the comment information to be deleted.
 * @param {Object} res - The response object used to send the deletion status or error message.
 * @returns {Object} - Returns an object response containing deletion status or error details.
 */
const deleteComment = async (req, res) => {
    try {
        // User data from the token representing the logged-in user
        const loggedInUser = req.locals;

        // Extract 'id' from request parameters to get 'commentId'
        const { id: commentId } = req.params;

        // Retrieve the comment to get the user ID of the comment owner
        const comment = await CommentModel.findById(commentId);

        // Check if the comment does not exist in the database
        if (!comment) {
            // Return a 'Not Found' error response if the comment is not found
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Comment not found.',
            });
        }

        // Retrieve the ID of the user who created the comment based on the schema structure in commentModel.js
        const commentOwnerId = comment.user.id;

        // Declaration of a variable to hold the query conditions for deleting the comment
        let query;

        // Determine the query based on user role and permissions
        if (loggedInUser.role === 'admin') {
            // Define query to target the comment by its unique ID for admin-level deletion
            query = { _id: commentId };
        } else if (
            // Check if the logged-in user is the owner of the comment and not an admin
            loggedInUser.role !== 'admin' &&
            loggedInUser._id !== commentOwnerId
        ) {
            // Return an error response indicating the lack of permission to delete other users' posts
            return res.status(httpStatus.NOT_HAVE_PERMISSION.code).send({
                status: 'error',
                message: httpStatus.NOT_HAVE_PERMISSION.message,
                customMessage:
                    "You don't have permission to delete other users' posts!",
            });
        } else {
            // Construct a query to delete the comment owned by the logged-in user
            query = {
                $and: [
                    { _id: commentId }, // Condition: Matches a comment using its ID from the database (_id) and the commentId from request parameters
                    { 'user.id': loggedInUser._id }, // Condition: Finds a comment where the user ID matches that of the logged-in user's ID for deletion
                ],
            };
        }

        // Delete the comment based on the defined query
        const deletedResult = await CommentModel.deleteOne(query);

        // Check if the comment was deleted successfully
        if (deletedResult.deletedCount > 0) {
            return res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'Comment deleted successfully!',
            });
        } else {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'success',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Comment is already deleted or not found.',
            });
        }
    } catch (error) {
        // Handling unexpected errors that occurred during the deletion process
        return res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage:
                'An unexpected error occurred while deleting the comment.',
            error: error.message,
        });
    }
};

/**
 * Exports the deleteComment controller function to enable its use throughout the application.
 * @module deleteComment
 * @exports {Function} deleteComment - Function for deleting a comment
 */
module.exports = deleteComment;
