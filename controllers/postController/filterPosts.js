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
 * Controller function to filter posts based on provided tags.
 * Constructs an aggregation pipeline using predefined stages to filter posts by tags, join user and likes data,
 * and sends a response containing filtered posts or an error message.
 * @param {Object} req - The request object representing the incoming request and containing tag information for post filtering.
 * @param {Object} res - The response object representing the server's response, used to send filtered posts or error messages.
 * @returns {Object} - Returns a response object representing the server's reply containing filtered posts in case of success or an error message upon unsuccessful filtering.
 */

const filterPosts = async (req, res) => {
    try {
        // Destructure the 'tags' property from the request's query parameters
        const { tags } = req.query;

        // Initialize an empty array to store conditions for filtering posts based on tags
        let query = [];

        // Constructing the query based on the type of 'tags' parameter received in the request
        if (typeof tags === 'string') {
            // If 'tags' is a string, create a single matching condition for the aggregation pipeline
            query = [{ $match: { 'tags.name': tags } }];
        } else {
            // If 'tags' is an array, create multiple matching conditions for each tag in the array
            tags.forEach((tag) => {
                query.push({ $match: { 'tags.name': tag } }); // Filters posts where the 'tags.name' matches the current 'tag' value
            });
        }

        // Constructing the aggregation pipeline by combining query conditions and pre-defined joins
        const aggregationPipeline = [
            ...query, // Adding query conditions for filtering based on tags
            ...joinPostUser, // Joining user data with posts
            ...joinLikesPost, // Joining likes data with posts
        ];

        // Performing aggregation using the constructed pipeline
        const aggregate = PostModel.aggregate(aggregationPipeline); // Creating an aggregation object
        const posts = await aggregate.exec(); // Executing the aggregation and awaiting the result

        // Handling response based on the result of the aggregation query
        if (posts.length === 0) {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'No posts found.',
            });
        }

        // Sending successful response with filtered posts
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Posts filtered successfully.',
            data: { posts }, // Include the filtered posts in the success response
        });
    } catch (error) {
        // Error handling and sending appropriate error response
        console.error('Error in filtering posts:', error);
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Internal server error.',
            error: error.message,
        });
    }
};

/**
 * Exports the filterPosts controller function to enable its use throughout the application.
 * @module filterPosts
 * @exports {Function} filterPosts - Function for filtering posts based on tags
 */
module.exports = filterPosts;
