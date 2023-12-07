// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Importing the PostModel module representing the schema and functionalities for posts
const PostModel = require('../../models/postModel');

/**
 * Handles updating a specific post based on user permissions.
 * @param {Object} req - The request object containing information about the client request.
 * @param {Object} res - The response object used to send the response back to the client.
 */
const updatePost = async (req, res) => {
    try {
        // Extracting user information from request locals
        const user = req.locals;

        // Extracting post ID from request parameters
        const postId = req.params.id;

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
            user.role === 'admin' ||
            user._id.toString() === post.userId.toString()
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
