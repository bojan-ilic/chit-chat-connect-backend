// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the CommentModel representing the Mongoose model for comments based on CommentSchema
const CommentModel = require('../../models/commentModel');

/**
 * Controller function to update a comment.
 * Updates an existing comment using extracted information, leveraging the CommentModel structure.
 * @param {Object} req - The request object representing the incoming request and containing data for comment update.
 * @param {Object} res - The response object representing the server's response used to send updated comment information or error messages.
 * @returns {Object} - Returns a response object representing the server's reply with updated comment details upon success or error details if the update process fails.
 */
const updateComment = async (req, res) => {
    try {
        // Extracts user details from the token representing the logged-in user
        const loggedInUser = req.locals;

        // Extracts the comment ID from the request parameters with the alias 'commentId'
        const { id: commentId } = req.params;

        // Extracts user details from the request body according to the structure CommentSchema and collecting the remaining data as 'updatedData'
        const { user, ...updatedData } = req.body;

        // Declaration of a variable to hold the query conditions for updating the comment
        let query;

        // Determine the query based on user role and permissions
        if (loggedInUser.role === 'admin') {
            // Define query to target the comment by its unique ID for admin-level update
            query = { _id: commentId };
        } else if (
            // Check if the logged-in user is the owner of the comment and not an admin
            user._id === loggedInUser._id &&
            loggedInUser.role !== 'admin'
        ) {
            // Constructing a query to update the comment specifically owned by the logged-in user
            query = {
                $and: [
                    { _id: commentId }, // Condition: Match by comment ID
                    { 'user.id': loggedInUser._id }, // Condition: Match by user ID of the logged-in user
                ],
            };
        } else {
            // Handling the scenario where the user doesn't have permission to update other users' posts
            return res.status(httpStatus.NOT_HAVE_PERMISSION.code).send({
                status: 'error',
                message: httpStatus.NOT_HAVE_PERMISSION.message,
                customMessage:
                    "You don't have permission to change other users' posts!",
            });
        }

        // Set the updated time for the comment
        updatedData.updatedAt = new Date().getTime();

        // Update the comment based on the defined query with new updated data
        const updatedComment = await CommentModel.findOneAndUpdate(
            query, // Query defining the specific comment to be updated
            updatedData, // New data to update the comment
            { new: true }, // Options: returns the updated comment
        );

        // Check if the comment was not updated (could not be found or update operation failed)
        if (!updatedComment) {
            // Return an error response indicating the failure to update the comment or comment not found
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Failed to update comment or comment not found.',
            });
        }

        // Send a success response indicating the successful update of the comment
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Comment is successfully updated!',
            comment: updatedComment, // Updated comment data included in the response
        });
    } catch (error) {
        // Handling unexpected errors that occurred during the update process
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage:
                'An unexpected error occurred while updating the comment.',
            error: error.message,
        });
    }
};

/**
 * Exports the updateComment controller function to enable its use throughout the application.
 * @module updateComment
 * @exports {Function} updateComment - Function for updating a comment
 */
module.exports = updateComment;
