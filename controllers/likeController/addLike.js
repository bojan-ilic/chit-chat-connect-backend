// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import LikeModel representing the Mongoose model for likes based on LikeSchema
const LikeModel = require('../../models/likeModel');

// Import PostModel representing the Mongoose model for posts based on PostSchema
const PostModel = require('../../models/postModel');

/**
 * Controller function to add a new like to the database or proceed if the like already exists.
 * Checks if the provided post ID exists in the database. If the post exists,
 * it proceeds to check if the like already exists for the user and post.
 * If the like exists, proceeds to the next middleware. If not, adds the like to the database.
 *
 * @param {Object} req - The request object representing the incoming request and containing like details.
 * @param {Object} res - The response object representing the server's response used to send success message or error message when adding like.
 * @param {Function} next - The callback function used to pass control to the next middleware in the route.
 * @returns {Object} - Returns a response object representing the server's reply indicating the success or failure of adding the like.
 */
const addLike = async (req, res, next) => {
    try {
        // Extract user details (_id as loggedInUserId and other properties) from the token representing the logged-in user
        const { _id: loggedInUserId, ...loggedInUser } = req.locals;

        // Extracts the postId from request parameters representing the ID of the post for the like addition
        const { postId } = req.params;

        // Check if the post exists in the database based on the postId
        const existingPost = await PostModel.findById(postId);

        // If the post doesn't exist, return an error response and prevent adding a like for a non-existent post
        if (!existingPost) {
            return res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'Post not found. Cannot add like.',
            });
        }

        // Finds an existing like in the 'likes' collection using LikeModel and matching the provided postId and userId criteria
        const existingLike = await LikeModel.findOne({
            postId, // Matches the postId in the 'likes' collection
            userId: loggedInUserId, // Matches the userId in the 'likes' collection
        });

        if (existingLike) {
            // If the like exists, proceed to the next middleware for removing the like
            return next();
        }

        // If the like doesn't exist, create a newLike object
        const newLike = {
            ...loggedInUser, // Copies details of the loggedInUser object into the newLike object
            userId: loggedInUserId, // Assigns the logged-in user's ID from the token to the userId field in newLike object
            postId, // Assigns the postId from the controller parameter to the newLike object
        };

        // Create a new instance of the LikeModel with the new like object
        const like = new LikeModel(newLike);

        // Save the newly created like to the database
        const savedLike = await like.save();

        // Send a success response indicating successful like addition
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'Like added successfully.',
            data: { like: savedLike }, // Include the 'savedLike' object within the 'data' property of the response object
        });
    } catch (error) {
        // Handling errors and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to add like.',
            error: error.message,
        });
    }
};

/**
 * Exports the addLike controller function to enable its use throughout the application.
 * @module addLikeController
 * @exports {Function} addLike - Function for adding a new like or proceeding if the like exists
 */
module.exports = addLike;
