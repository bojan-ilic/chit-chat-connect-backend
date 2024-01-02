// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import PostModel representing the Mongoose model for posts based on PostSchema
const PostModel = require('../../models/postModel');

/**
 * Controller function to handle updating a specific post based on user permissions.
 * Extracts necessary data from the request object and updates a post using PostModel.
 * @param {Object} req - The request object representing the incoming request and containing post data for database update.
 * @param {Object} res - The response object representing the server's response, used to send success message or error message when updating the post.
 * @returns {Object} - Returns a response object representing the server's reply containing updated post data in case of a successful update or an error message upon an unsuccessful attempt to update the post in the database.
 */

const updatePost = async (req, res) => {
    try {
        // Extract user data from the token representing the logged-in user
        const loggedInUser = req.locals;

        // Extract the post ID from request parameters with the alias 'postId'
        const { id: postId } = req.params;

        // Fetching the post by ID to get the userId associated with it
        const post = await PostModel.findById(postId);

        // Check if the post doesn't exist in the database
        if (!post) {
            // If the post is not found, send a response indicating the post was not found
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Post not found.',
            });
        }

        // Checking user roles and permissions
        if (
            loggedInUser.role === 'admin' ||
            loggedInUser._id.toString() === post.userId.toString()
        ) {
            // Users can update their own posts or admins can update any post
            const { body, title, image, isPublic, tags } = req.body;
            const updatedData = {
                body,
                title,
                image,
                isPublic,
                tags,
            };

            // Update the post in the database
            const updatedPost = await PostModel.findOneAndUpdate(
                { _id: postId },
                updatedData,
                { new: true },
            );

            // Sending success response with the updated post
            return res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'Post updated successfully.',
                updatedPost,
            });
        } else {
            // If the user does not have the necessary permissions to update the post
            return res.status(httpStatus.NOT_HAVE_PERMISSION.code).send({
                status: 'error',
                message: httpStatus.NOT_HAVE_PERMISSION.message,
                customMessage:
                    "You don't have permission to change other users' posts.",
            });
        }
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
