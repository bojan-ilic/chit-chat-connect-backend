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
 * Controller function to handle the retrieval of all posts based on specified criteria.
 * Retrieves posts from the database according to query parameters like 'limit', 'page', and 'isPublic'.
 * @param {Object} req - The request object representing the incoming request and containing query parameters for post retrieval.
 * @param {Object} res - The response object representing the server's response, used to send retrieved posts or error messages when fetching posts.
 * @returns {Object} - Returns a response object representing the server's reply containing retrieved posts and related count in case of successful retrieval or an error message upon an unsuccessful attempt to retrieve posts.
 */

const getAllPosts = async (req, res) => {
    // Extracting the 'limit' query parameter from the request object, parsing it to an integer, or assigning 'null' if undefined
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    // Extracting the 'page' query parameter from the request object, parsing it to an integer, calculating the pagination offset, or assigning 'null' if undefined
    const page = req.query.page ? (parseInt(req.query.page) - 1) * limit : null;

    // Extracting the 'isPublic' query parameter from the request object, parsing it to an integer, or assigning 'null' if undefined
    const isPublic = req.query.public ? parseInt(req.query.public) : null;

    // Initializing the variable 'count' to keep track of the total number of posts (default value set to 0)
    let count = 0;

    // Initializing the 'pipeline' array with an initial stage to sort posts by creation date in descending order
    let pipeline = [{ $sort: { createdAt: -1 } }];

    // Building pipeline stages based on query parameters
    // Checking if the 'isPublic' query parameter is not null (i.e., it has been provided in the request)
    if (isPublic !== null) {
        // Adding a new stage to the 'pipeline' array to match posts based on the 'isPublic' value
        pipeline = [...pipeline, { $match: { isPublic: !!isPublic } }];
        // Counting the number of documents in the PostModel collection that match the 'isPublic' condition and updating the 'count' variable
        count = await PostModel.countDocuments({ isPublic: !!isPublic });
    } else {
        // Counting the total number of documents in the PostModel collection when 'isPublic' parameter is not provided in the query
        count = await PostModel.countDocuments({});
    }

    // Adding pagination stages to the pipeline
    if (limit !== null && page !== null) {
        pipeline = [...pipeline, { $skip: page }, { $limit: limit }];
    }

    try {
        // Fetching posts based on constructed pipeline
        const posts = await PostModel.aggregate([
            ...pipeline,
            ...joinLikesPost,
            ...joinPostUser,
        ]);

        if (posts.length === 0) {
            // Send a specific response when no posts are found
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'success',
                message: 'No posts match the specified criteria',
                data: { posts: [], count: 0 },
            });
        }

        // Sending response with retrieved posts and count
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            data: { posts, count }, // Sending data object containing posts and count
        });
    } catch (error) {
        // Error handling and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage:
                'Server encountered an issue while retrieving posts.',
            error: error.message,
        });
    }
};

/**
 * Exports the getAllPosts controller function to enable its use throughout the application.
 * @module allPosts
 * @exports {Function} getAllPosts - Function for fetching all posts
 */
module.exports = getAllPosts;
