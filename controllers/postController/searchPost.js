// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import PostModel representing the Mongoose model for posts based on PostSchema
const PostModel = require('../../models/postModel');

// Import pre-defined pipeline stages for joining related collections (posts, users, likes) to enrich post data
const {
    joinPostUser, // Joins user data with posts
    joinLikesPost, // Joins likes data with posts
} = require('../../stages/joins');

/**
 * Controller function to handle searching posts based on a provided search query.
 * Extracts the search query from the request object and searches for posts matching the query in titles or bodies.
 * @param {Object} req - The request object representing the incoming request and containing query parameters for post search.
 * @param {Object} res - The response object representing the server's response used to send matched posts or error response.
 * @returns {Object} - Returns a response object representing the server's reply containing posts matching the search query or an error message.
 */

const searchPost = async (req, res) => {
    try {
        // Extract the 'searchQuery' from the query parameters
        const { searchQuery } = req.query;

        // If 'searchQuery' is not provided or empty, return an invalid data error response
        if (!searchQuery) {
            return res.status(httpStatus.INVALID_DATA.code).send({
                status: 'error',
                message: httpStatus.INVALID_DATA.message,
                customMessage: 'Search term is missing or empty',
            });
        }

        // Performing an aggregate query to search for posts matching the 'searchQuery' in 'title' or 'body'
        const posts = await PostModel.aggregate([
            {
                $match: {
                    $or: [
                        { title: { $regex: searchQuery, $options: 'i' } }, // Perform a case-insensitive search in title
                        { body: { $regex: searchQuery, $options: 'i' } }, // Perform a case-insensitive search in body
                    ],
                },
            },
            { $sort: { createdAt: -1 } }, // Sort posts by createdAt in descending order
            ...joinPostUser, // Add stages to join user data with posts
            ...joinLikesPost, // Add stages to join likes data with posts
            { $project: { userId: 0 } }, // Exclude 'userId' from the output
        ]);

        if (posts.length > 0) {
            // Send a success response if posts are found matching the search term
            res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'Posts retrieved successfully',
                data: posts, // Send the retrieved posts
            });
        } else {
            // Send an error response if no posts are found matching the search term
            res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'No posts found',
            });
        }
    } catch (error) {
        // If an error occurs during the process, send a service error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Internal Server Error',
            error: error.message,
        });
    }
};

/**
 * Exports the searchPost controller function to enable its use throughout the application.
 * @module searchPost
 * @exports {Function} searchPost - Function for searching posts based on query
 */
module.exports = searchPost;
