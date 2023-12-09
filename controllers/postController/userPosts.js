// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Importing the PostModel module representing the schema and functionalities for posts
const PostModel = require('../../models/postModel');

// Importing pre-defined pipeline stages for joining likes data with posts to enrich post information
const {
    joinLikesPost, // Joins likes data with posts
} = require('../../stages/joins');
const http = require('http');

/**
 * Controller function to fetch posts by a specific user ID.
 * @param {Object} req - The request object containing the user ID
 * @param {Object} res - The response object used to send the posts data or error messages
 * @returns {Object} - Returns a response with the posts data or error message
 */
const userPosts = async (req, res) => {
    try {
        // Destructuring the user ID from the parameters in the request object
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
            customMessage: httpStatus.SUCCESS.message,
            data: posts,
        });
    } catch (error) {
        console.error(error);
        // Handle internal server errors and send an error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Internal Server Error',
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
