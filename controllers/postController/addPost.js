// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Importing the PostModel module representing the schema and functionalities for posts
const PostModel = require('../../models/postModel');

/**
 * Controller function to add a new post.
 * @param {Object} req - The request object containing post data.
 * @param {Object} res - The response object for sending the HTTP response.
 * @returns {void}
 */
const addPost = async (req, res) => {
    try {
        // Retrieve user information from token present in request locals
        const userFromToken = req.locals;

        // Extract userId from userFromToken object
        const { _id: userId } = userFromToken;

        // Create a new post object by combining request body and userId
        const post = {
            ...req.body,
            userId,
        };

        // Create a new instance of PostModel with the post object
        const newPost = new PostModel(post);

        // Save the new post to the database
        const savedPost = await newPost.save();

        // Send a success response if the post is saved successfully
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Post added successfully',
            data: savedPost,
        });
    } catch (error) {
        // Send an error response if there is an issue while saving the post
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to add post',
            error: error.message,
        });
    }
};

/**
 * Exports the addPost controller function to enable its use throughout the application.
 * @module addPost
 * @exports {Function} addPost -  Function for adding a new post
 */
module.exports = addPost;
