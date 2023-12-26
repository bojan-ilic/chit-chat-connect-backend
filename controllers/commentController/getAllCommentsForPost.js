// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the CommentModel representing the Mongoose model for comments based on CommentSchema
const CommentModel = require('../../models/commentModel');

/**
 * Controller function to retrieve all comments for a specific post from the database.
 * Retrieves comments related to a particular post using the postId from the request object.
 * @param {Object} req - The request object representing the incoming request with post-related parameters for comment retrieval.
 * @param {Object} res - The response object representing the server's response, used to send fetched comments or error messages related to the request.
 * @returns {Object} - Returns a response object representing the server's reply containing a list of comments for the post or an error message in case of failure.
 */
const getAllCommentsForPost = async (req, res) => {
    try {
        // Extract the post ID from the request parameters with the alias 'postId' to retrieve comments related to a specific post
        const { postId } = req.params;

        // Check if postId is missing, send an error response indicating that the requested post was not found
        if (!postId) {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage:
                    'The requested post was not found. Please provide a valid post ID.',
            });
        }

        // Aggregation pipeline to sort comments by createdAt in descending order and filter by postId
        const pipeline = [
            // Sorting comments based on createdAt in descending order
            { $sort: { createdAt: -1 } },
            {
                // Matching comments by postId to retrieve comments for a specific post
                $match: {
                    $expr: { $eq: ['$postId', { $toObjectId: postId }] },
                },
            },
        ];

        // Fetching comments using aggregation pipeline
        const comments = await CommentModel.aggregate(pipeline);

        // Count of comments retrieved for the specific post
        const count = comments.length;

        // Handles the case where no comments are found for the specified post
        if (count === 0) {
            return res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'No comments found for this post.',
            });
        }

        // Send a success response with comments for the requested post
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Comments for the post retrieved successfully.',
            data: { count, comments }, // Send data object containing comments and count
        });
    } catch (error) {
        // Error handling and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to retrieve comments for this post.',
            error: error.message,
        });
    }
};

/**
 * Exports the getAllCommentsForPost controller function to enable its use throughout the application.
 * @module getAllComments
 * @exports {Function} getAllCommentsForPost - Function for fetching all comments for a post
 */
module.exports = getAllCommentsForPost;
