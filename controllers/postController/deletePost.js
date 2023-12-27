// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import PostModel representing the Mongoose model for posts based on PostSchema
const PostModel = require('../../models/postModel');

/**
 * Controller function for deleting a post from the database.
 * Extracts post ID from the request parameters and user info from request locals.
 * @param {Object} req - The request object representing the incoming request and containing post ID in params and user info in locals.
 * @param {Object} res - The response object representing the server's response, used to send success message or error message when deleting the post.
 * @returns {Object} - Returns a response object representing the server's reply confirming the successful deletion of the post.
 */

const deletePost = (req, res) => {
    // Extract post ID from request parameters with the alias 'post_id'
    const { id: post_id } = req.params;

    // User data from the token representing the logged-in user
    const loggedInUser = req.locals;

    // Creating a query object to target a post by its ID
    let query = { _id: post_id };

    // Checking if the user has admin privileges
    let isAdmin = loggedInUser.role === 'admin';

    // If the user is not an admin, modify the query to delete only if the user is the owner of the post
    if (!isAdmin) {
        query = { $and: [{ _id: post_id }, { userId: loggedInUser._id }] };
    }

    // Initiating to delete the post from the database
    PostModel.deleteOne(query)
        .then((result) => {
            // Check the deletion result and send appropriate response
            if (result.deletedCount === 1) {
                // Send success response if the post was deleted
                res.status(httpStatus.SUCCESS.code).send({
                    status: 'success',
                    message: httpStatus.SUCCESS.message,
                    customMessage: 'Post deleted successfully',
                });
            } else {
                // Send error response if the post was not deleted (permission issue or post not found)
                res.status(httpStatus.NOT_HAVE_PERMISSION.code).send({
                    status: 'error',
                    message: httpStatus.NOT_HAVE_PERMISSION.message,
                    customMessage:
                        "Post does not exist or you don't have permission to delete it.",
                });
            }
        })
        .catch((error) => {
            // Send error response if there was an issue with the deletion process
            res.status(httpStatus.SERVICE_ERROR.code).send({
                status: 'error',
                message: httpStatus.SERVICE_ERROR.message,
                customMessage: 'Failed to delete post',
                error: error.message,
            });
        });
};

/**
 * Exports the deletePost controller function to enable its use throughout the application.
 * @module deletePost
 * @exports {Function} deletePost - Function for deleting a post
 */
module.exports = deletePost;
