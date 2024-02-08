// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import PostModel representing the Mongoose model for posts based on PostSchema
const PostModel = require('../../models/postModel');

// Import pre-defined pipeline stages for joining likes data with posts to enrich post information
const {
    joinLikesPost, // Joins likes data with posts
} = require('../../stages/joins');
const http = require('http');

/**
 * Controller function to fetch posts by a specific user ID.
 * Extracts user ID from the request object and retrieves posts matching the provided user ID.
 * Enriches retrieved posts with additional data and sends a response containing the posts data or error messages.
 * @param {Object} req - The request object representing the incoming request containing the user ID.
 * @param {Object} res - The response object representing the server's response used to send the posts data or error messages.
 * @returns {Object} - Returns a response object representing the server's reply with the posts data or error message.
 */
const userPosts = async (req, res) => {
    try {
        // Destructure the user ID from the request parameters
        const { userId } = req.params;

        // Matching stage to filter posts by the provided user ID
        const matchStage = {
            $match: {
                $expr: {
                    // Checking equality between the 'userId' field in the document and the converted 'userId' parameter
                    $eq: ['$userId', { $toObjectId: userId }],
                },
            },
        };

        // Retrieve posts based on matchStage criteria and enrich them with likes data
        const posts = await PostModel.aggregate([matchStage, ...joinLikesPost]);

        // Send success response with the retrieved posts data
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: `User posts fetched successfully for user with ID ${userId}`,
            data: posts,
        });
    } catch (error) {
        // Error handling and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to fetch user posts due to a server error.',
            error: error.message,
        });
    }
};

/**
 * Exports the userPosts controller function to fetch posts by a specific user ID.
 * @module userPosts
 * @exports {Function} userPosts - Function for fetching posts by user ID
 *
 */
module.exports = userPosts;
