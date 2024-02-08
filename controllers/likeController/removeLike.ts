// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import LikeModel representing the Mongoose model for likes based on LikeSchema
const LikeModel = require('../../models/likeModel');

// Import PostModel representing the Mongoose model for posts based on PostSchema
const PostModel = require('../../models/postModel');

/**
 * Controller function to remove an existing like from the database.
 * Checks if the provided post ID exists in the database and then checks if the like exists for the given post ID and user ID.
 * If the post and like exist, it removes the like from the database.
 *
 * @param {Object} req - The request object representing the incoming request and containing like details for removal.
 * @param {Object} res - The response object representing the server's response containing success or error messages upon removing the like.
 * @returns {Object} - Returns a response object representing the server's reply indicating the success or failure of removing the like.
 */
const removeLike = async (req, res) => {
    try {
        // Extracts the postId from the request parameters, representing the ID of the post for the like removal
        const { postId } = req.params;

        // Extracts the user ID (_id) from the token present in request locals and assigns it to 'userId'
        const { _id: userId } = req.locals;

        // Check if the post exists in the database based on the postId
        const existingPost = await PostModel.findById(postId);

        // If the post doesn't exist, return an error response and prevent adding a like for a non-existent post
        if (!existingPost) {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Post not found. Cannot remove like.',
            });
        }

        // Deletes a like from the 'likes' collection based on the provided postId and userId criteria
        const result = await LikeModel.deleteOne({ postId, userId });

        // Checks the result of the delete operation and sends an appropriate response based on the deleted count
        if (result.deletedCount === 1) {
            res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'Like removed successfully.',
                data: { removedBy: req.locals }, // Includes the user details from req.locals who initiated the removal of the like
            });
        } else {
            // Sends an error response when the like is not found in the database
            res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Like not found.',
            });
        }
    } catch (error) {
        // Handles errors and sends an appropriate error response when removing a like fails
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to remove like.',
            error: error.message,
        });
    }
};

/**
 * Exports the removeLike controller function to enable its use throughout the application.
 * Handles the removal of a like from the database.
 * @module removeLikeController
 * @exports {Function} removeLike - Function for removing an existing like
 */
module.exports = removeLike;
