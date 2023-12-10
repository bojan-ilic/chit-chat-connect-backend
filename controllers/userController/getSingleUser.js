// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Importing the UserModel module representing the schema and functionalities for users
const UserModel = require('../../models/userModel');

/**
 * Retrieves a single user based on the provided ID.
 * @param {Object} req - The request object containing the ID of the user to retrieve.
 * @param {Object} res - The response object used to send the user data or error message.
 * @returns {Object} - Returns a response with the user data or error message.
 */
const getSingleUser = async (req, res) => {
    try {
        // Extracting the ID parameter from the request object
        const { id: userId } = req.params;

        // Retrieving a single user based on the provided ID
        const user = await UserModel.findById(userId);

        // Handling the response based on whether the user was found or not
        if (user) {
            // Sending success response if the user is found
            res.status(httpStatus.SUCCESS.code).send({
                status: 'success',
                message: httpStatus.SUCCESS.message,
                customMessage: 'User retrieved successfully',
                // Sending the retrieved user data
                data: user,
            });
        } else {
            // Sending error response if the user is not found
            res.status(httpStatus.NOT_FOUND.code).send({
                status: 'error',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'User not found',
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
 * Exports the getSingleUser controller function to enable its use throughout the application.
 * @module getSingleUser
 * @exports {Function} getSingleUser - Function for fetching a single user
 */
module.exports = getSingleUser;
