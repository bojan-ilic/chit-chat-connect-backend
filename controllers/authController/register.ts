// Import UserModel representing the Mongoose model for users based on UserSchema
const UserModel = require('../../models/userModel');

// Import 'bcrypt' library for password hashing and comparison
const bcrypt = require('bcrypt');

// Import HTTP status codes and messages for response handling
const { httpStatus } = require('../../config/constants');

// Set the number of salt rounds for password hashing
const saltRounds = 10;

/**
 * Controller function to handle user registration.
 * Extracts user registration details from the request object and creates a new user using UserModel.
 * @param {Object} req - The request object representing incoming registration data containing user details.
 * @param {Object} res - The response object representing the server's response for user registration.
 * @returns {Object} - Returns a response object representing the server's reply containing saved user data in case of a successful registration or an error message upon an unsuccessful attempt.
 */
const register = async (req, res) => {
    try {
        // Extracts user login details (email and password) from the request body according to the UserSchema
        const { email, password } = req.body;

        // Check if user with provided email already exists in the database
        const userExists = await UserModel.exists({ email });

        // Send error response if the user with the provided email already exists
        if (userExists) {
            return res.status(httpStatus.EXIST.code).send({
                status: 'error',
                message: httpStatus.EXIST.message,
                customMessage:
                    'A user with this email already exists. Please use a different email or try logging in.',
            });
        }

        // Hash the user's password using bcrypt with a specified number of salt rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user instance with hashed password
        const newUser = new UserModel({
            ...req.body,
            password: hashedPassword,
        });

        // Save the new user instance to the database
        const savedUser = await newUser.save();

        // Send a success response after saving the new user to the database
        res.status(httpStatus.SUCCESS.code).send({
            status: 'success',
            message: httpStatus.SUCCESS.message,
            customMessage: 'User registration successful.',
            user: savedUser, // Include the saved user data in the success response
        });
    } catch (error) {
        // Error handling and sending appropriate error response
        res.status(httpStatus.SERVICE_ERROR.code).send({
            status: 'error',
            message: httpStatus.SERVICE_ERROR.message,
            customMessage:
                'Server encountered an error during registration process.',
            error: error.message,
        });
    }
};

/**
 * Exports the Register controller function to enable its use throughout the application.
 * @module registerController
 * @exports {Function} register - Function for registering a new user
 */
module.exports = register;
