// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the UserModel representing the Mongoose model for users based on UserSchema
const UserModel = require('../../models/userModel');

/**
 * Controller function to retrieve all users from the database.
 * Handles the retrieval of all user profiles stored in the database.
 * @param {Object} req - The request object representing the incoming request containing details of the GET all users request.
 * @param {Object} res - The response object representing the server's response used to send the retrieved users or error messages.
 * @returns {Object} Returns a response object representing the server's reply with the list of users or an error message.
 */

const getAllUsers = async (req, res) => {
    try {
        // Fetching all users from the UserModel
        const users = await UserModel.find({});

        // Check if there are no users found in the database
        if (users.length === 0) {
            res.status(httpStatus.NOT_FOUND.code).send({
                status: 'success',
                message: httpStatus.NOT_FOUND.message,
                customMessage: 'No users were found.',
                data: [], // Sending an empty array when there are no users
            });
        }

        // Sending response with retrieved users
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            data: { users }, // Sending data object containing users
        });
    } catch (error) {
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage:
                'Error occurred while fetching all users from the database.',
            error: error.message,
        });
    }
};

/**
 * Exports the getAllUsers controller function to enable its use throughout the application.
 * @module getAllUsers
 * @exports {Function} getAllUsers - Function for fetching all users
 */
module.exports = getAllUsers;
