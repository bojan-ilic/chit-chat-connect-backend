// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the Like Model module representing the schema and functionalities for likes
const LikeModel = require('../../models/likeModel');

/**
 * Controller function to add a new like to the database or proceed if the like already exists.
 * Checks if the like exists for the provided post ID and user ID.
 * If the like exists, proceeds to the next middleware. If not, adds the like to the database.
 * @param {Object} req - The request object containing like details
 * @param {Object} res - The response object used to send success message or error message when adding like
 * @param {Function} next - The next middleware function in the route
 * @returns {Object} - Returns a response indicating the success or failure of adding the like
 */
const addLike = async (req, res, next) => {
    try {
        // Extract user ID (_id) and other user details from token present in request locals
        const { _id: loggedInUserId, ...loggedInUser } = req.locals;

        // Extracts the postId from request parameters representing the ID of the post for the like addition
        const { postId } = req.params;

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
            // Constructs a newLike object, aligning its properties with the LikeSchema in the LikeModel,
            // incorporating details from loggedInUser (such as 'firstName', 'lastName') along with specific 'postId' and 'userId' values
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
