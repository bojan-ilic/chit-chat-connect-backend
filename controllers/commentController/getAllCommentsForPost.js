// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the CommentModel representing the schema and functionalities for comments
const CommentModel = require('../../models/commentModel');

/**
 * Controller function to retrieve all comments for a specific post from the database.
 * @param {Object} req - The request object containing the parameters used for comment.http retrieval.
 * @param {Object} res - The response object used to send the retrieved comments or error messages.
 * @returns {Object} Returns a response with the list of comments or an error message.
 */
const getAllCommentsForPost = async (req, res) => {
    try {
        // Destructuring postId from request parameters to retrieve comments related to a specific post
        const { postId } = req.params;

        // Fetch comments only if postId is available
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

        // Sending a successful response with comments for the requested post
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Comments for the post retrieved successfully.',
            data: { count, comments }, // Sending data object containing comments and count
        });
    } catch (error) {
        // Handling errors and sending an appropriate error response
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
