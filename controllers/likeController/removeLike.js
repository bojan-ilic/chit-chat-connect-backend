// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the Post Model module representing the schema and functionalities for posts
const PostModel = require('../../models/postModel');

// Import the Like Model module representing the schema and functionalities for likes
const LikeModel = require('../../models/likeModel');

/**
 * Controller function to remove an existing like from the database.
 * Checks if the like exists for the provided post ID and user ID.
 * If the like exists, removes it from the database.
 * @param {Object} req - The request object containing like details
 * @param {Object} res - The response object used to send success message or error message when removing like
 */
const removeLike = async (req, res) => {
    try {
        // Extracts the postId from the request parameters, representing the ID of the post for the like removal
        const { postId } = req.params;

        // Extracts the user ID (_id) from the token present in request locals and assigns it to 'userId'
        const { _id: userId } = req.locals;

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
