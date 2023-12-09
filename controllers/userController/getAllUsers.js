// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Importing the UserModel module representing the schema and functionalities for users
const UserModel = require('../../models/userModel');

/**
 * Controller function to retrieve all users from the database.
 * @param {Object} req - The request object containing details of the GET all users request.
 * @param {Object} res - The response object used to send the retrieved users or error messages.
 * @returns {Object} Returns a response with the list of users or an error message.
 */

const getAllUsers = async (req, res) => {
    try {
        // Fetching all users from the UserModel
        const users = await UserModel.find({});

        // Sending response with retrieved users
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            // Sending data object containing users
            data: { users },
        });
    } catch (error) {
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Internal Server Error',
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
