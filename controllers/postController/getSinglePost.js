// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Importing the PostModel module representing the schema and functionalities for posts
const PostModel = require('../../models/postModel');

// Importing pre-defined pipeline stages for joining related collections (users, comments, likes) to enrich post data
const {
    joinPostUser, // Joins user data with posts
    joinCommentsPost, // Joins comments data with posts
    joinLikesPost, // Joins likes data with posts
} = require('../../stages/joins');

/**
 * Retrieves a single post based on the provided ID.
 * @param {Object} req - The request object containing the ID of the post to retrieve.
 * @param {Object} res - The response object used to send the post data or error message.
 * @returns {Object} - Returns a response with the post data or error message.
 */
const getSinglePost = async (req, res) => {
    try {
        // Extracting the ID parameter from the request object
        const { id } = req.params;

        // Constructing an aggregation pipeline to retrieve a single post and enrich its data
        let pipeline = [
            {
                // Matching the provided ID by converting it to an ObjectId
                $match: { $expr: { $eq: ['$_id', { $toObjectId: id }] } },
            },
            // Enriching the post data by joining associated collections
            ...joinPostUser, // Adding stage to join user data
            ...joinCommentsPost, // Adding stage to join comments data
            ...joinLikesPost, // Adding stage to join likes data
        ];

        // Executing the aggregation pipeline to retrieve a single post and enrich its data by joining related collections (users, comments, likes)
        const posts = await PostModel.aggregate(pipeline);

        // Handling the response based on whether the post was found or not
        if (posts.length > 0) {
            // Sending success response if the post is found
            res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'Post retrieved successfully',
                // Sending the retrieved post data
                data: posts[0], // As 'aggregate' returns an array, 'posts[0]' represents the expected single post retrieved
            });
        } else {
            // Sending error response if the post is not found
            res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Post not found',
            });
        }
    } catch (error) {
        // Handling any internal server errors and sending an error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Internal Server Error',
            error: error.message,
        });
    }
};

/**
 * Exports the getSinglePost controller function to enable its use throughout the application.
 * @module getSinglePost
 * @exports {Function} getSinglePost - Function for fetching a single post
 */
module.exports = getSinglePost;
