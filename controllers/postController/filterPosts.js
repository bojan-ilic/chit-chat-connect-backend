// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Importing the PostModel module representing the schema and functionalities for posts
const PostModel = require('../../models/postModel');

// Importing pre-defined pipeline stages for joining related collections (users, likes) to enrich post data
const {
    joinPostUser, // Joins user data with posts
    joinLikesPost, // Joins likes data with posts
} = require('../../stages/joins');

/**
 * Handles filtering posts based on provided tags.
 * @param {Object} req - The request object containing the information about the client request.
 * @param {Object} res - The response object used to send the response back to the client.
 * @return {Object} - Returns a response object with filtered posts or error messages.
 */
const filterPosts = async (req, res) => {
    try {
        const { tags } = req.query;
        let query = [];

        // Constructing the query based on the type of 'tags' parameter received in the request
        if (typeof tags === 'string') {
            query = [{ $match: { 'tags.name': tags } }];
        } else {
            tags.forEach((tag) => {
                query.push({ $match: { 'tags.name': tag } });
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
            data: { posts },
        });
    } catch (error) {
        // Handling errors and sending error response
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
