// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Importing the PostModel module representing the schema and functionalities for posts
const PostModel = require('../../models/postModel');

/**
 * Handles updating a specific post based on user permissions.
 * @param {Object} req - The request object containing information about the client request.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void}
 */
const updatePost = async (req, res) => {
    try {
        // Extracting user information from request locals
        const user = req.locals;

        // Extracting post ID from request parameters
        const { _id: postId } = req.params;

        // Extracting userId and remaining updated data from request body
        const { userId, ...updatedData } = req.body;

        // Variable to store the query to find the post
        let query;

        // Checking user roles and constructing the query accordingly
        if (user.role === 'admin') {
            // Admins can update any post
            query = { _id: postId };
        } else if (user._id === userId && user.role !== 'admin') {
            // Users can update their own posts
            query = { $and: [{ _id: postId }, { userId: user._id }] };
        } else {
            // Handling cases where the user doesn't have permission to update the post
            return res.status(httpStatus.NOT_HAVE_PERMISSION.code).send({
                status: 'error',
                message: httpStatus.NOT_HAVE_PERMISSION.message,
                customMessage:
                    "You don't have permission to change other users' posts.",
            });
        }

        // Finding and updating the post in the database
        const updatedPost = await PostModel.findOneAndUpdate(
            query,
            updatedData,
            { new: true },
        );

        // Checking if the post was not found or the user lacks permission to update
        if (!updatedPost) {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage:
                    'Post not found or you do not have permission to update.',
            });
        }

        // Sending success response with the updated post
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Post updated successfully.',
            updatedPost,
        });
    } catch (error) {
        // Handling any unexpected errors and sending a service error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Error updating post',
            error: error.message,
        });
    }
};

/**
 * Exports the updatePost controller function to enable its use throughout the application.
 * @module updatePost
 * @exports {Function} updatePost - Function for updating a post
 */
module.exports = updatePost;
