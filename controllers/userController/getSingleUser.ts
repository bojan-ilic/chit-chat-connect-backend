// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the UserModel representing the Mongoose model for users based on UserSchema
const UserModel = require('../../models/userModel');

/**
 * Controller function to fetch a single user.
 * Handles the retrieval of a user profile based on user ID.
 * @param {Object} req - The request object representing the incoming request containing the user ID for retrieval.
 * @param {Object} res - The response object representing the server's response used to send the user data or error message.
 * @returns {Object} - Returns a response object representing the server's reply with the user data or error message.
 */
const getSingleUser = async (req, res) => {
    try {
        // Extract the ID parameter from the request object
        const { id: userId } = req.params;

        // Retrieve a single user based on the provided ID
        const user = await UserModel.findById(userId);

        // Handling the response based on whether the user was found or not
        if (user) {
            // Sending success response if the user is found
            res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'User retrieved successfully',
                data: user, // Sending the retrieved user data
            });
        } else {
            // Sending error response if the user is not found
            res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'User not found.',
            });
        }
    } catch (error) {
        // Handling any internal server errors and sending an error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage:
                'An unexpected error occurred while fetching the user.',
            error: error.message,
        });
    }
};

/**
 * Exports the getSingleUser controller function to enable its use throughout the application.
 * @module getSingleUser
 * @exports {Function} getSingleUser - Function for fetching a single user
 */
module.exports = getSingleUser;
