// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Import the UserModel representing the Mongoose model for users based on UserSchema
const UserModel = require('../../models/userModel');

/**
 * Controller function to add a new user.
 * @param {Object} req - The request object representing the incoming request and containing user information for registration.
 * @param {Object} res - The response object representing the server's response and used to send a success message or error message upon attempting to add a new user to the database.
 * @returns {Object} - Returns a response object representing the server's reply containing either the saved user data in case of a successful addition or an error message upon an unsuccessful attempt to add the user to the database.
 */

const addUser = async (req, res) => {
    try {
        // Extract user data from the request body
        const userData = req.body;

        // Create a new instance of UserModel with the user data
        const newUser = new UserModel(userData);

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Send a success response if the user is saved successfully
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'User added successfully',
            data: savedUser, // Contains the user data that was successfully added to the database
        });
    } catch (error) {
        // Send an error response if there is an issue while saving the user
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage: 'Failed to add user',
            error: error.message,
        });
    }
};

/**
 * Exports the addUser controller function to enable its use throughout the application.
 * @module addUser
 * @exports {Function} addUser - Function for adding a new user
 */
module.exports = addUser;
