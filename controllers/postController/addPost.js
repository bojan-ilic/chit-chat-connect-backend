// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import PostModel representing the Mongoose model for posts based on PostSchema
const PostModel = require('../../models/postModel');

/**
 * Controller function to add a new post.
 * Extracts required data from the request object and creates a new post using PostModel.
 * @param {Object} req - The request object representing the incoming request and containing post data for database addition.
 * @param {Object} res - The response object representing the server's response, used to send success message or error message when adding post.
 * @returns {Object} - Returns a response object representing the server's reply containing saved post data in case of a successful addition or an error message upon an unsuccessful attempt to add the post to the database.
 */
const addPost = async (req, res) => {
    try {
        // Extract user ID from the token representing the logged-in user
        const { _id: userId } = req.locals;

        // Create a new post object by combining request body and userId
        const post = {
            ...req.body, // Retrieve data from the request body
            userId, // Add the user ID to the post data
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
            data: savedPost, // Include the post data in the success response
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
